import { useState } from 'react'
import { feedbackEndpoint, restaurant } from '../config/restaurant'
import { t } from '../content/text'
import { isEmail, normalizeLebanesePhone } from '../lib/validate'
import Field from './Field'
import Icon from './Icon'

const empty = { name: '', contact: '', rating: 0, message: '' }

/**
 * Posts JSON to `feedbackEndpoint` when one is configured (Formspree,
 * Getform, your own API...). Without one, it opens the customer's email
 * app with the message addressed to the restaurant.
 */
export default function FeedbackForm() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | mailed | error

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = t('contact.errors.name')
    if (values.message.trim().length < 3) next.message = t('contact.errors.message')
    const contact = values.contact.trim()
    if (contact && !isEmail(contact) && !normalizeLebanesePhone(contact)) next.contact = t('contact.errors.contact')
    return next
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }

    const payload = {
      name: values.name.trim(),
      contact: values.contact.trim(),
      rating: values.rating || null,
      message: values.message.trim(),
    }

    if (!feedbackEndpoint) {
      const body = [payload.message, '', `${payload.name}${payload.contact ? ` · ${payload.contact}` : ''}`, payload.rating ? `Rating: ${payload.rating}/5` : '']
        .filter((line, i) => line || i === 1)
        .join('\n')
      window.location.href = `mailto:${restaurant.email}?subject=${encodeURIComponent('Website feedback')}&body=${encodeURIComponent(body)}`
      setState('mailed')
      return
    }

    setState('sending')
    try {
      const response = await fetch(feedbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(String(response.status))
      setState('sent')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent' || state === 'mailed') {
    return (
      <div className="feedback-done" role="status">
        <span className="feedback-done__mark">
          <Icon name="check" size={28} />
        </span>
        <p>{state === 'sent' ? t('contact.thanks') : t('contact.thanksMail')}</p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            setValues(empty)
            setState('idle')
          }}
        >
          {t('contact.another')}
        </button>
      </div>
    )
  }

  return (
    <form className="feedback" onSubmit={onSubmit} noValidate>
      <h2>{t('contact.feedbackTitle')}</h2>
      <p className="feedback__lead">{t('contact.feedbackLead')}</p>

      <div className="feedback__fields">
        <Field label={t('contact.name')} value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field
          label={t('contact.contactField')}
          optional={t('checkout.optional')}
          value={values.contact}
          onChange={set('contact')}
          error={errors.contact}
          autoComplete="email"
          dir="ltr"
        />

        <fieldset className="rating">
          <legend className="field__label">
            {t('contact.rating')} <span className="field__optional">({t('checkout.optional')})</span>
          </legend>
          <div className="rating__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={n <= values.rating ? 'is-on' : ''}>
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={values.rating === n}
                  onChange={() => setValues((v) => ({ ...v, rating: n }))}
                  onClick={() => values.rating === n && setValues((v) => ({ ...v, rating: 0 }))}
                />
                <Icon name="star" size={28} />
                <span className="visually-hidden">{t('contact.ratingValue', { n })}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field as="textarea" rows={5} label={t('contact.message')} value={values.message} onChange={set('message')} error={errors.message} maxLength={2000} />
      </div>

      {state === 'error' && (
        <p className="field__error feedback__error" role="alert">
          {t('contact.error')}
        </p>
      )}

      <button type="submit" className="btn btn--dark btn--lg btn--block" disabled={state === 'sending'}>
        {state === 'sending' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  )
}
