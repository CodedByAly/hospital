import { useState } from 'react'
import { feedbackGoesToWhatsApp, submitFeedback } from '../lib/submit.js'
import { isValidEmail, isValidPhone } from '../lib/validate.js'
import { Field } from './Field.jsx'
import { IconCheck, IconStar } from './Icons.jsx'

const empty = { name: '', contact: '', rating: 0, message: '' }
const ratingWords = ['', 'Poor', 'Could be better', 'Good', 'Very good', 'Excellent']

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell us your name.'
  const contact = values.contact.trim()
  if (contact && !isValidPhone(contact) && !isValidEmail(contact)) errors.contact = 'Enter a valid phone number or email.'
  if (values.message.trim().length < 5) errors.message = 'Please write a few words.'
  return errors
}

export function FeedbackForm() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      e.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setStatus('sending')
    submitFeedback({ ...values, rating: values.rating || null, sentAt: new Date().toISOString() })
      .then(() => setStatus('sent'))
      .catch(() => setStatus('error'))
  }

  if (status === 'sent') {
    return (
      <div className="form-done" role="status">
        <span className="form-done__icon">
          <IconCheck size={22} />
        </span>
        <p className="form-done__title">Thank you, {values.name.split(' ')[0]}.</p>
        <p>
          {feedbackGoesToWhatsApp
            ? 'Your message opened in WhatsApp. Hit send there and it reaches us directly.'
            : 'Your feedback has been sent to the team.'}
        </p>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setValues(empty)
            setStatus('idle')
          }}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form__row">
        <Field label="Name" error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" value={values.name} onChange={set('name')} />}
        </Field>
        <Field label="Phone or email" optional error={errors.contact} hint="Only if you'd like a reply.">
          {(p) => <input {...p} type="text" autoComplete="tel" value={values.contact} onChange={set('contact')} />}
        </Field>
      </div>

      <fieldset className="rating">
        <legend className="field__label">
          Your rating <span className="field__optional">Optional</span>
        </legend>
        <div className="rating__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rating__star ${values.rating >= n ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={values.rating === n}
                onChange={() => setValues((v) => ({ ...v, rating: n }))}
                className="visually-hidden"
              />
              <IconStar size={28} filled={values.rating >= n} />
              <span className="visually-hidden">
                {n} {n === 1 ? 'star' : 'stars'}
              </span>
            </label>
          ))}
          <span className="rating__word" aria-hidden="true">
            {ratingWords[values.rating]}
          </span>
        </div>
      </fieldset>

      <Field label="Your feedback" error={errors.message}>
        {(p) => <textarea {...p} rows={5} value={values.message} onChange={set('message')} />}
      </Field>

      {status === 'error' && (
        <p className="form__error" role="alert">
          Something went wrong sending your message. Please try again, or reach us on WhatsApp.
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : feedbackGoesToWhatsApp ? 'Send via WhatsApp' : 'Send feedback'}
      </button>
    </form>
  )
}
