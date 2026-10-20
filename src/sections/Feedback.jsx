import { useState } from 'react'
import Field, { describedBy } from '../components/Field'
import Icon from '../components/Icon'
import { submitFeedback } from '../utils/feedback'
import { restaurant } from '../config/restaurant'

const empty = { name: '', contact: '', rating: 0, message: '' }
const ratingWords = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent']

export default function Feedback() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [hoverRating, setHoverRating] = useState(0)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  function validate() {
    const er = {}
    if (!form.name.trim()) er.name = 'Please tell us your name.'
    if (form.message.trim().length < 5) er.message = 'Please write a few words.'
    if (form.contact.trim() && !/^[+\d][\d\s-]{6,}$/.test(form.contact.trim()) && !/^\S+@\S+\.\S+$/.test(form.contact.trim())) {
      er.contact = 'Enter a phone number or an email address.'
    }
    return er
  }

  async function onSubmit(e) {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) {
      document.getElementById(`fb-${Object.keys(er)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      const { via } = await submitFeedback({ ...form, name: form.name.trim(), contact: form.contact.trim(), message: form.message.trim() })
      setStatus(via === 'email' ? 'email' : 'sent')
      setForm(empty)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent' || status === 'email') {
    return (
      <div className="feedback feedback--done" role="status">
        <span className="feedback__done-mark"><Icon name="check" size={26} strokeWidth={2.2} /></span>
        <h3>Thank you</h3>
        <p>
          {status === 'sent'
            ? 'Your feedback reached us. We read every message.'
            : `Your email app should have opened with your message. Just press send, or write to us at ${restaurant.email}.`}
        </p>
        <button type="button" className="btn btn--ghost" onClick={() => setStatus('idle')}>
          Write another
        </button>
      </div>
    )
  }

  const shown = hoverRating || form.rating

  return (
    <form className="feedback" onSubmit={onSubmit} noValidate aria-labelledby="feedback-title">
      <h3 id="feedback-title" className="feedback__title">Tell us how we did</h3>
      <p className="feedback__lead">Something you loved, or something we should fix? It goes straight to the team.</p>

      <fieldset className="rating" onMouseLeave={() => setHoverRating(0)}>
        <legend className="field-label">
          Your rating <span className="field-optional">Optional</span>
        </legend>
        <div className="rating__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rating__star ${n <= shown ? 'is-on' : ''}`} onMouseEnter={() => setHoverRating(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={form.rating === n}
                onChange={() => setForm((f) => ({ ...f, rating: n }))}
              />
              <Icon name="star" size={26} strokeWidth={1.5} />
              <span className="sr-only">{n} out of 5, {ratingWords[n]}</span>
            </label>
          ))}
          <span className="rating__word" aria-hidden="true">{ratingWords[shown]}</span>
        </div>
      </fieldset>

      <div className="form-grid">
        <Field id="fb-name" label="Name" error={errors.name}>
          <input id="fb-name" className="input" autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={describedBy('fb-name', errors.name)} />
        </Field>
        <Field id="fb-contact" label="Phone or email" optional error={errors.contact} hint="Only if you'd like a reply.">
          <input id="fb-contact" className="input" autoComplete="email" value={form.contact} onChange={set('contact')} aria-invalid={!!errors.contact} aria-describedby={describedBy('fb-contact', errors.contact, true)} />
        </Field>
      </div>
      <Field id="fb-message" label="Your message" error={errors.message}>
        <textarea id="fb-message" className="input" rows={4} maxLength={1000} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={describedBy('fb-message', errors.message)} />
      </Field>

      {status === 'error' && (
        <p className="form-alert" role="alert">
          <Icon name="alert" size={18} /> We couldn&rsquo;t send that. Please try again, or email {restaurant.email}.
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? <span className="spinner" aria-hidden="true" /> : null}
        <span>{status === 'sending' ? 'Sending...' : 'Send feedback'}</span>
      </button>
    </form>
  )
}
