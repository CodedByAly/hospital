import { useState } from 'react';
import { branches } from '../config/site.js';
import { sendFeedback } from '../services/feedback.js';
import Icon from './Icon.jsx';
import './FeedbackForm.css';

const empty = { name: '', contact: '', branch: '', rating: 0, message: '' };
const ratingWords = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Great'];

export default function FeedbackForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | mailto | error
  const [hover, setHover] = useState(0);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Enter your name.';
    if (form.message.trim().length < 5) found.message = 'Write a message.';
    if (form.contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact) && form.contact.replace(/\D/g, '').length < 7) {
      found.contact = 'Enter a phone number or an email address.';
    }
    setErrors(found);
    if (Object.keys(found).length) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    setStatus('sending');
    try {
      const result = await sendFeedback({ ...form, name: form.name.trim(), message: form.message.trim(), rating: form.rating || null });
      setStatus(result);
      if (result === 'sent') setForm(empty);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="feedback-done" role="status">
        <Icon name="check" size={28} strokeWidth={2.2} />
        <p className="feedback-done__title">Sent. Thank you.</p>
        <button type="button" className="text-btn" onClick={() => setStatus('idle')}>
          Send another
        </button>
      </div>
    );
  }

  const invalid = (key) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `fb-${key}-error` } : {});

  return (
    <form className="feedback" onSubmit={submit} noValidate>
      <div className="field-row">
        <div className={`field ${errors.name ? 'has-error' : ''}`}>
          <label className="field__label" htmlFor="fb-name">Name</label>
          <input id="fb-name" type="text" autoComplete="name" value={form.name} onChange={set('name')} {...invalid('name')} />
          {errors.name && <p className="field__error" id="fb-name-error">{errors.name}</p>}
        </div>
        <div className={`field ${errors.contact ? 'has-error' : ''}`}>
          <label className="field__label" htmlFor="fb-contact">
            Phone or email <span className="field__optional">optional</span>
          </label>
          <input id="fb-contact" type="text" autoComplete="email" value={form.contact} onChange={set('contact')} {...invalid('contact')} />
          {errors.contact && <p className="field__error" id="fb-contact-error">{errors.contact}</p>}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field__label" htmlFor="fb-branch">
            Branch <span className="field__optional">optional</span>
          </label>
          <select id="fb-branch" value={form.branch} onChange={set('branch')}>
            <option value="">Any branch</option>
            {branches.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="field">
          <legend className="field__label">
            Your rating <span className="field__optional">optional</span>
          </legend>
          <div className="stars" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={`star ${(hover || form.rating) >= n ? 'is-on' : ''}`} onMouseEnter={() => setHover(n)}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={form.rating === n}
                  onChange={() => setForm((f) => ({ ...f, rating: n }))}
                  onClick={() => form.rating === n && setForm((f) => ({ ...f, rating: 0 }))}
                />
                <Icon name="star" size={26} filled={(hover || form.rating) >= n} strokeWidth={1.5} />
                <span className="visually-hidden">{n} out of 5, {ratingWords[n]}</span>
              </label>
            ))}
            <span className="stars__word" aria-hidden="true">{ratingWords[hover || form.rating]}</span>
          </div>
        </fieldset>
      </div>

      <div className={`field ${errors.message ? 'has-error' : ''}`}>
        <label className="field__label" htmlFor="fb-message">Message</label>
        <textarea id="fb-message" rows={4} maxLength={1500} value={form.message} onChange={set('message')} {...invalid('message')} />
        {errors.message && <p className="field__error" id="fb-message-error">{errors.message}</p>}
      </div>

      <div className="feedback__foot">
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send feedback'}
        </button>
        <p className="feedback__status" role="status">
          {status === 'mailto' && 'Your email app will open with the message ready.'}
          {status === 'error' && 'Didn’t go through. Try again or WhatsApp us.'}
        </p>
      </div>
    </form>
  );
}
