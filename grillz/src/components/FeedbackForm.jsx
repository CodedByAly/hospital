import { useState } from 'react';
import restaurant from '../config/restaurant';
import { isValidEmail, isValidLebanesePhone } from '../lib/format';
import { feedbackWhatsAppLink, sendFeedback } from '../lib/feedback';
import Field from './Field';
import Icon from './Icon';

const EMPTY = { name: '', contact: '', rating: 0, message: '' };
const RATING_WORDS = ['', 'Poor', 'Could be better', 'Good', 'Very good', 'Excellent'];

export default function FeedbackForm() {
  const [data, setData] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [via, setVia] = useState(null);

  const errors = {};
  if (!data.name.trim()) errors.name = 'Please tell us your name.';
  if (data.message.trim().length < 3) errors.message = 'Write a few words of feedback.';
  if (data.contact.trim() && !isValidEmail(data.contact) && !isValidLebanesePhone(data.contact)) errors.contact = 'That doesn’t look like a phone number or email.';
  const shown = (k) => (submitted || touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const blur = (k) => () => setTouched((x) => ({ ...x, [k]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    const payload = { ...data, name: data.name.trim(), contact: data.contact.trim(), message: data.message.trim() };
    if (!restaurant.endpoints.feedback) {
      // No form backend yet: hand it to WhatsApp, opened inside the click so it isn't blocked.
      window.open(feedbackWhatsAppLink(payload), '_blank', 'noopener');
      setVia('whatsapp');
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      await sendFeedback(payload);
      setVia('endpoint');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="feedback-done" role="status">
        <span className="feedback-done__icon">
          <Icon name="check" size={26} strokeWidth={2.2} />
        </span>
        <h3>Thank you.</h3>
        <p>
          {via === 'whatsapp'
            ? 'WhatsApp opened with your feedback written out — press send and it reaches us directly.'
            : 'We got your feedback. If you left a number or email, we may get back to you.'}
        </p>
        <button type="button" className="link-btn" onClick={() => { setData(EMPTY); setTouched({}); setSubmitted(false); setStatus('idle'); }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <Field label="Your name" required error={shown('name')}>
          <input className="field__input" type="text" autoComplete="name" value={data.name} onChange={set('name')} onBlur={blur('name')} maxLength={80} />
        </Field>
        <Field label="Phone or email" hint="Optional — only if you’d like a reply." error={shown('contact')}>
          <input className="field__input" type="text" autoComplete="tel" value={data.contact} onChange={set('contact')} onBlur={blur('contact')} maxLength={80} />
        </Field>
      </div>

      <fieldset className="rating">
        <legend className="field__label">
          How was it? <span className="rating__word">{RATING_WORDS[data.rating]}</span>
        </legend>
        <div className="rating__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rating__star ${data.rating >= n ? 'is-on' : ''}`}>
              <input type="radio" name="rating" value={n} checked={data.rating === n} onChange={() => setData((d) => ({ ...d, rating: n }))} aria-label={`${n} out of 5`} />
              <Icon name="star" size={30} strokeWidth={1.5} />
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Your feedback" required error={shown('message')}>
        <textarea className="field__input field__input--area" rows={4} placeholder="What did you order, and how was it?" value={data.message} onChange={set('message')} onBlur={blur('message')} maxLength={1000} />
      </Field>

      {status === 'error' && (
        <div className="form-alert" role="alert">
          <Icon name="alert" size={20} />
          Something went wrong sending your feedback. Please try again, or message us on WhatsApp.
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send feedback'}
        {status !== 'sending' && <Icon name="arrow" size={20} />}
      </button>
    </form>
  );
}
