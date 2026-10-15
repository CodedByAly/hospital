import { useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { feedbackWhatsappUrl, sendFeedback, usesFeedbackEndpoint } from '../services/feedback';
import Icon from './Icon';
import './FeedbackForm.css';

const EMPTY = { name: '', contact: '', rating: 0, message: '' };

export default function FeedbackForm() {
  const { t } = useI18n();
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [touched, setTouched] = useState(false);
  const viaEndpoint = usesFeedbackEndpoint();

  const messageError = form.message.trim().length < 3 ? t('contact.errors.message') : '';
  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (messageError) {
      event.currentTarget.querySelector('#fb-message')?.focus();
      return;
    }
    const data = { ...form, rating: form.rating || null, message: form.message.trim() };
    if (!viaEndpoint) {
      window.open(feedbackWhatsappUrl(data), '_blank', 'noopener');
      setState('sent');
      return;
    }
    setState('sending');
    try {
      await sendFeedback(data);
      setState('sent');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="feedback-done" role="status">
        <span className="feedback-done__icon"><Icon name="check" size={22} strokeWidth={2.2} /></span>
        <p>{viaEndpoint ? t('contact.thanks') : t('contact.thanksWhatsapp')}</p>
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setForm(EMPTY);
            setTouched(false);
            setState('idle');
          }}
        >
          {t('contact.another')}
        </button>
      </div>
    );
  }

  return (
    <form className="feedback" onSubmit={submit} noValidate>
      <div className="feedback__row">
        <div className="field">
          <label className="field__label" htmlFor="fb-name">{t('contact.name')} <small>{t('checkout.optional')}</small></label>
          <input id="fb-name" className="input" type="text" autoComplete="name" value={form.name} onChange={set('name')} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="fb-contact">{t('contact.contactField')} <small>{t('checkout.optional')}</small></label>
          <input id="fb-contact" className="input" type="text" autoComplete="tel" value={form.contact} onChange={set('contact')} />
        </div>
      </div>

      <fieldset className="field">
        <legend className="field__label">{t('contact.rating')} <small>{t('checkout.optional')}</small></legend>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`stars__star ${form.rating >= n ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={form.rating === n}
                onChange={() => setForm((f) => ({ ...f, rating: n }))}
                onClick={() => form.rating === n && setForm((f) => ({ ...f, rating: 0 }))}
              />
              <Icon name="star" size={30} strokeWidth={1.4} />
              <span className="sr-only">{t('contact.ratingValue', { n })}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="fb-message">{t('contact.message')}</label>
        <textarea
          id="fb-message"
          className="input"
          rows={5}
          maxLength={1500}
          placeholder={t('contact.messagePlaceholder')}
          value={form.message}
          onChange={set('message')}
          aria-invalid={touched && messageError ? 'true' : undefined}
          aria-describedby={touched && messageError ? 'fb-message-error' : undefined}
        />
        {touched && messageError && (
          <span className="field__error" id="fb-message-error"><Icon name="close" size={14} strokeWidth={2.2} /> {messageError}</span>
        )}
      </div>

      {state === 'error' && <p className="form-alert" role="alert">{t('contact.errors.submit')}</p>}

      <button type="submit" className="btn" disabled={state === 'sending'}>
        {state === 'sending' ? t('contact.sending') : viaEndpoint ? t('contact.send') : t('contact.sendWhatsapp')}
      </button>
    </form>
  );
}
