import { useState } from 'react'
import { restaurant } from '../data/restaurant.js'
import Icon from '../components/Icon.jsx'
import { isValidLebanesePhone } from '../lib/format.js'
import { whatsappUrl } from '../lib/whatsapp.js'

const empty = { name: '', contact: '', branch: '', rating: 0, message: '' }
const ratingWords = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Loved it']
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (v.contact.trim() && !isEmail(v.contact.trim()) && !isValidLebanesePhone(v.contact)) e.contact = 'Enter a valid phone number or email, or leave it empty.'
  if (v.message.trim().length < 5) e.message = 'Write a few words so we know what happened.'
  return e
}

function feedbackText(v) {
  const branch = restaurant.branches.find((b) => b.id === v.branch)?.name
  const lines = ['Feedback for Birdy Fam', `Name: ${v.name.trim()}`]
  if (v.contact.trim()) lines.push(`Contact: ${v.contact.trim()}`)
  if (branch) lines.push(`Branch: ${branch}`)
  if (v.rating) lines.push(`Rating: ${v.rating}/5`)
  lines.push('', v.message.trim())
  return lines.join('\n')
}

export default function Feedback() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | whatsapp | error
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`fb-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    if (!restaurant.feedbackEndpoint) {
      // No form service connected yet: hand the message to WhatsApp.
      window.open(whatsappUrl(feedbackText(values)), '_blank', 'noopener')
      setStatus('whatsapp')
      setValues(empty)
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(restaurant.feedbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submittedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setValues(empty)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent' || status === 'whatsapp') {
    return (
      <div className="feedback feedback--done" role="status">
        <span className="feedback__check"><Icon name="check" size={26} strokeWidth={2.4} /></span>
        <h3 className="feedback__title">Thank you</h3>
        <p className="muted">
          {status === 'sent'
            ? 'Your feedback reached the team. We read every message.'
            : 'Your message is ready in WhatsApp. Hit send there and it comes straight to us.'}
        </p>
        <button type="button" className="text-btn" onClick={() => setStatus('idle')}>Send another</button>
      </div>
    )
  }

  return (
    <form className="feedback" onSubmit={submit} noValidate aria-labelledby="fb-title">
      <h3 id="fb-title" className="feedback__title">Tell us how we did</h3>
      <p className="muted feedback__intro">Good or bad, it goes straight to the team.</p>

      <div className="field">
        <label htmlFor="fb-name">Name</label>
        <input id="fb-name" value={values.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'fb-name-err' : undefined} />
        {errors.name && <p id="fb-name-err" className="field-error">{errors.name}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="fb-contact">Phone or email <span className="field__opt">optional</span></label>
          <input id="fb-contact" value={values.contact} onChange={set('contact')} autoComplete="tel" aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'fb-contact-err' : undefined} />
          {errors.contact && <p id="fb-contact-err" className="field-error">{errors.contact}</p>}
        </div>
        <div className="field">
          <label htmlFor="fb-branch">Branch <span className="field__opt">optional</span></label>
          <select id="fb-branch" value={values.branch} onChange={set('branch')}>
            <option value="">Not sure / delivery</option>
            {restaurant.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="field rating">
        <legend>Rating <span className="field__opt">optional</span></legend>
        <div className="rating__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rating__star ${values.rating >= n ? 'is-on' : ''}`}>
              <input type="radio" name="rating" value={n} checked={values.rating === n} onChange={() => setValues((v) => ({ ...v, rating: n }))} />
              <Icon name="star" size={26} />
              <span className="visually-hidden">{n} star{n > 1 ? 's' : ''}</span>
            </label>
          ))}
          <span className="rating__word" aria-hidden="true">{ratingWords[values.rating]}</span>
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="fb-message">Your feedback</label>
        <textarea id="fb-message" rows="4" value={values.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'fb-message-err' : undefined} />
        {errors.message && <p id="fb-message-err" className="field-error">{errors.message}</p>}
      </div>

      {status === 'error' && (
        <p className="form-alert" role="alert">
          <Icon name="alert" size={16} /> We couldn't send that just now. Try again, or message us on WhatsApp.
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : restaurant.feedbackEndpoint ? 'Send feedback' : 'Send via WhatsApp'}
      </button>
    </form>
  )
}
