import { useId, useState } from 'react';
import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { hasWhatsApp, openWhatsApp } from '../lib/whatsapp';
import Icon from './Icon';

const empty = { name: '', contact: '', rating: 0, message: '' };

/**
 * Feedback form. Posts JSON to `restaurant.feedbackEndpoint` when configured,
 * otherwise hands the message to WhatsApp.
 */
export default function FeedbackForm() {
  const { t, lang } = useLanguage();
  const uid = useId();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | sent-whatsapp | error

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = t.feedback.errors.name;
    if (values.message.trim().length < 3) e.message = t.feedback.errors.message;
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    const payload = { ...values, name: values.name.trim(), message: values.message.trim(), lang, sentAt: new Date().toISOString() };

    if (restaurant.feedbackEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(restaurant.feedbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sent');
        setValues(empty);
      } catch {
        setStatus('error');
      }
      return;
    }

    if (hasWhatsApp) {
      const m = t.whatsappMsg;
      const text = [
        `*${m.feedback} — ${restaurant.name}*`,
        `${m.customer}: ${payload.name}`,
        payload.contact ? `${m.contact}: ${payload.contact}` : null,
        payload.rating ? `${m.rating}: ${'★'.repeat(payload.rating)}${'☆'.repeat(5 - payload.rating)}` : null,
        '',
        payload.message,
      ]
        .filter((l) => l !== null)
        .join('\n');
      openWhatsApp(text);
      setStatus('sent-whatsapp');
      setValues(empty);
    }
  };

  if (status === 'sent' || status === 'sent-whatsapp') {
    return (
      <div className="feedback feedback--done" role="status">
        <span className="confirm__check" aria-hidden="true">
          <Icon name="check" size={26} strokeWidth={2.4} />
        </span>
        <h3>{t.feedback.sentTitle}</h3>
        <p>{status === 'sent' ? t.feedback.sentText : t.feedback.sentWhatsapp}</p>
        <button type="button" className="text-button" onClick={() => setStatus('idle')}>
          {t.feedback.another}
        </button>
      </div>
    );
  }

  const err = (key) =>
    errors[key]
      ? { 'aria-invalid': true, 'aria-describedby': `${uid}-${key}-error` }
      : {};

  return (
    <form className="feedback" onSubmit={submit} noValidate>
      <div className="field-grid">
        <div className={`field ${errors.name ? 'has-error' : ''}`}>
          <label className="field-label" htmlFor={`${uid}-name`}>{t.feedback.name}</label>
          <input id={`${uid}-name`} className="input" autoComplete="name" value={values.name} onChange={set('name')} {...err('name')} />
          {errors.name ? <p className="field-error" id={`${uid}-name-error`}>{errors.name}</p> : null}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${uid}-contact`}>
            {t.feedback.contact}
            <span className="option-group__badge option-group__badge--muted">{t.common.optional}</span>
          </label>
          <input id={`${uid}-contact`} className="input" autoComplete="tel" value={values.contact} onChange={set('contact')} />
        </div>
      </div>

      <fieldset className="field">
        <legend className="field-label">
          {t.feedback.rating}
          <span className="option-group__badge option-group__badge--muted">{t.common.optional}</span>
        </legend>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`stars__star ${values.rating >= n ? 'is-on' : ''}`}>
              <input
                type="radio"
                name={`${uid}-rating`}
                value={n}
                checked={values.rating === n}
                onChange={() => setValues((v) => ({ ...v, rating: n }))}
              />
              <Icon name="star" size={28} strokeWidth={1.5} />
              <span className="sr-only">{t.feedback.ratingLabel(n)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`field ${errors.message ? 'has-error' : ''}`}>
        <label className="field-label" htmlFor={`${uid}-message`}>{t.feedback.message}</label>
        <textarea
          id={`${uid}-message`}
          className="input"
          rows={4}
          maxLength={1000}
          placeholder={t.feedback.messagePlaceholder}
          value={values.message}
          onChange={set('message')}
          {...err('message')}
        />
        {errors.message ? <p className="field-error" id={`${uid}-message-error`}>{errors.message}</p> : null}
      </div>

      {status === 'error' ? <p className="alert" role="alert">{t.feedback.error}</p> : null}

      <button type="submit" className="btn btn--dark btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? t.feedback.sending : t.feedback.send}
      </button>
    </form>
  );
}
