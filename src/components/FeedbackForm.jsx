import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { feedbackWhatsappLink, hasFeedbackEndpoint, postFeedback } from '../lib/feedback'
import Field from './Field'
import Icon from './Icon'
import './FeedbackForm.css'

const EMPTY = { name: '', contact: '', rating: 0, message: '' }

export default function FeedbackForm() {
  const { t, lang } = useLanguage()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | whatsapp | error
  const [hover, setHover] = useState(0)

  const validate = (f) => {
    const e = {}
    if (f.name.trim().length < 2) e.name = t('contact.errors.name')
    if (!f.rating) e.rating = t('contact.errors.rating')
    if (f.message.trim().length < 3) e.message = t('contact.errors.message')
    return e
  }

  const set = (key, value) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (Object.keys(errors).length) setErrors(validate(next))
  }

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    const data = { name: form.name.trim(), contact: form.contact.trim(), rating: form.rating, message: form.message.trim() }
    if (!hasFeedbackEndpoint()) {
      // opened synchronously inside the submit handler so it isn't blocked as a popup
      window.open(feedbackWhatsappLink(data, lang), '_blank', 'noopener')
      setStatus('whatsapp')
      setForm(EMPTY)
      return
    }
    setStatus('sending')
    try {
      await postFeedback(data, lang)
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  const shown = hover || form.rating

  return (
    <form className="feedback" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label={t('contact.name')} error={errors.name}>
          <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={60} />
        </Field>
        <Field label={t('contact.contact')} hint={t('contact.contactHint')} optional>
          <input className="input" value={form.contact} onChange={(e) => set('contact', e.target.value)} autoComplete="email" maxLength={80} dir="auto" />
        </Field>
      </div>

      <fieldset className="rating" aria-invalid={errors.rating ? true : undefined} aria-describedby={errors.rating ? 'rating-error' : undefined}>
        <legend className="field-label">{t('contact.rating')}</legend>
        <div className="rating__stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="rating__star" data-on={n <= shown || undefined} onMouseEnter={() => setHover(n)}>
              <input type="radio" name="rating" value={n} checked={form.rating === n} onChange={() => set('rating', n)} />
              <Icon name="star" size={28} />
              <span className="visually-hidden">{t('contact.ratingLabel', { n })}</span>
            </label>
          ))}
        </div>
        {errors.rating && <p className="field-error" id="rating-error">{errors.rating}</p>}
      </fieldset>

      <Field label={t('contact.message')} error={errors.message}>
        <textarea className="input" rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder={t('contact.messagePlaceholder')} maxLength={1000} />
      </Field>

      <div className="feedback__foot">
        <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
          {status === 'sending' ? t('contact.sending') : t('contact.send')}
        </button>
        <p className="feedback__status" role="status">
          {status === 'sent' && t('contact.success')}
          {status === 'whatsapp' && t('contact.successWhatsapp')}
          {status === 'error' && <span className="field-error">{t('contact.error')}</span>}
        </p>
      </div>
    </form>
  )
}
