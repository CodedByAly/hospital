import { useId, useState } from 'react';
import { restaurant, whatsappLink } from '../data/restaurant';
import { CheckIcon, StarIcon, WhatsAppIcon } from './Icons';
import './FeedbackForm.css';

const RATING_LABELS = ['Poor', 'Not great', 'Okay', 'Good', 'Great'];
const empty = { name: '', contact: '', rating: 0, message: '' };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please add your name.';
  if (f.message.trim().length < 5) e.message = 'Tell us a little more.';
  if (f.contact.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contact.trim()) && f.contact.replace(/\D/g, '').length < 7) {
    e.contact = 'Enter a phone number or an email address.';
  }
  return e;
}

function feedbackMessage(f) {
  const lines = ['Feedback from the website', `Name: ${f.name.trim()}`];
  if (f.contact.trim()) lines.push(`Contact: ${f.contact.trim()}`);
  if (f.rating) lines.push(`Rating: ${f.rating}/5 (${RATING_LABELS[f.rating - 1]})`);
  lines.push('', f.message.trim());
  return lines.join('\n');
}

/**
 * Feedback form. Posts JSON to `restaurant.ordering.feedbackEndpoint` when one is set;
 * until then it hands the message to WhatsApp.
 */
export default function FeedbackForm() {
  const ids = useId();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const endpoint = restaurant.ordering.feedbackEndpoint;

  const update = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: validate(next)[key] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${ids}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (!endpoint) {
      window.open(whatsappLink(feedbackMessage(form)), '_blank', 'noopener');
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="feedback-done" role="status">
        <span className="feedback-done__icon">
          <CheckIcon size={26} />
        </span>
        <p className="display feedback-done__title">Thank you, {form.name.trim().split(' ')[0]}</p>
        <p>{endpoint ? 'Your feedback has been sent.' : 'Your message is ready in WhatsApp. Press send and it comes straight to us.'}</p>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setForm(empty);
            setStatus('idle');
          }}
        >
          Write another
        </button>
      </div>
    );
  }

  const err = (key) =>
    errors[key] ? (
      <p className="field__error" id={`${ids}-${key}-err`}>
        {errors[key]}
      </p>
    ) : null;
  const aria = (key) => ({
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${ids}-${key}-err` : undefined,
  });

  return (
    <form className="feedback-form" onSubmit={onSubmit} noValidate>
      <div className="feedback-form__row">
        <div className="field">
          <label className="field__label" htmlFor={`${ids}-name`}>
            Name
          </label>
          <input id={`${ids}-name`} className="input" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} {...aria('name')} />
          {err('name')}
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${ids}-contact`}>
            Phone or email <span className="optional">(optional)</span>
          </label>
          <input id={`${ids}-contact`} className="input" value={form.contact} onChange={(e) => update('contact', e.target.value)} {...aria('contact')} />
          {err('contact')}
        </div>
      </div>

      <fieldset className="field">
        <legend className="field__label">
          Rating <span className="optional">(optional)</span>
        </legend>
        <div className="stars">
          {RATING_LABELS.map((label, i) => {
            const value = i + 1;
            return (
              <label key={value} className={`star ${form.rating >= value ? 'is-on' : ''}`} title={label}>
                <input type="radio" name={`${ids}-rating`} value={value} checked={form.rating === value} onChange={() => update('rating', value)} />
                <StarIcon size={28} />
                <span className="visually-hidden">
                  {value} of 5, {label}
                </span>
              </label>
            );
          })}
          <span className="stars__label" aria-hidden="true">
            {form.rating ? RATING_LABELS[form.rating - 1] : ''}
          </span>
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor={`${ids}-message`}>
          Your feedback
        </label>
        <textarea
          id={`${ids}-message`}
          className="input"
          rows={5}
          maxLength={1000}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          {...aria('message')}
        />
        {err('message')}
      </div>

      {status === 'error' && (
        <p className="checkout__error" role="alert">
          That didn’t go through. Try again, or send it to us on WhatsApp.
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
        {endpoint ? (
          status === 'sending' ? 'Sending…' : 'Send feedback'
        ) : (
          <>
            <WhatsAppIcon size={18} /> Send feedback
          </>
        )}
      </button>
    </form>
  );
}
