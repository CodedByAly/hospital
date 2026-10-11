import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { isValidEmail, isValidLebanesePhone } from '../lib/format';
import { sendFeedback, feedbackWhatsAppLink } from '../lib/feedback';
import restaurant from '../config/restaurant';
import Field from './Field';
import Icon from './Icon';

const EMPTY = { name: '', contact: '', rating: 0, message: '' };

export default function FeedbackForm() {
  const { t, lang } = useLanguage();
  const f = t.feedback;
  const [data, setData] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [via, setVia] = useState(null);

  const errors = {};
  if (!data.name.trim()) errors.name = f.errors.name;
  if (data.message.trim().length < 3) errors.message = f.errors.message;
  if (data.contact.trim() && !isValidEmail(data.contact) && !isValidLebanesePhone(data.contact)) errors.contact = f.errors.contact;
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
      // No backend yet: open WhatsApp directly inside the click so it isn't blocked.
      window.open(feedbackWhatsAppLink(payload, lang), '_blank', 'noopener');
      setVia('whatsapp');
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      const result = await sendFeedback(payload, lang);
      setVia(result.via);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="feedback-done" role="status">
        <span className="feedback-done__icon"><Icon name="check" size={26} strokeWidth={2.2} /></span>
        <h3>{f.sentTitle}</h3>
        <p>{via === 'whatsapp' ? f.sentWhatsApp : f.sentBody}</p>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setData(EMPTY);
            setTouched({});
            setSubmitted(false);
            setStatus('idle');
          }}
        >
          {f.another}
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <Field label={f.name} required requiredLabel={t.checkout.required} error={shown('name')}>
          <input className="field__input" type="text" autoComplete="name" value={data.name} onChange={set('name')} onBlur={blur('name')} maxLength={80} />
        </Field>
        <Field label={f.contact} hint={f.contactHint} error={shown('contact')}>
          <input className="field__input" type="text" autoComplete="tel" dir="ltr" value={data.contact} onChange={set('contact')} onBlur={blur('contact')} maxLength={80} />
        </Field>
      </div>

      <fieldset className="rating">
        <legend className="field__label">{f.rating}</legend>
        <div className="rating__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rating__star ${data.rating >= n ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={data.rating === n}
                onChange={() => setData((d) => ({ ...d, rating: n }))}
                aria-label={f.ratingLabel(n)}
              />
              <Icon name="star" size={30} strokeWidth={1.5} />
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={f.message} required requiredLabel={t.checkout.required} error={shown('message')}>
        <textarea className="field__input field__input--area" rows={4} placeholder={f.messagePlaceholder} value={data.message} onChange={set('message')} onBlur={blur('message')} maxLength={1000} />
      </Field>

      {status === 'error' && (
        <div className="form-alert" role="alert">
          <Icon name="alert" size={20} />
          {f.errors.send}
        </div>
      )}

      <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? f.sending : f.send}
        {status !== 'sending' && <Icon name="arrow" size={20} />}
      </button>
    </form>
  );
}
