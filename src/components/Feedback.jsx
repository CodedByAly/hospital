import { useState } from 'react'
import { BeanMark } from './Logo'
import { site, whatsappLink } from '../data/site'
import './Feedback.css'

const empty = { name: '', contact: '', rating: 0, message: '' }
const ratingWords = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Loved it']

function validate(v) {
  const errors = {}
  if (!v.name.trim()) errors.name = 'Please tell us your name.'
  if (v.contact.trim()) {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.contact.trim())
    const phone = /^\+?[\d\s()-]{7,}$/.test(v.contact.trim())
    if (!email && !phone) errors.contact = 'That doesn’t look like a phone number or email.'
  }
  if (v.message.trim().length < 5) errors.message = 'Write a few words so we know what happened.'
  return errors
}

function toText(v) {
  const lines = [`Feedback for ${site.name}`, `Name: ${v.name.trim()}`]
  if (v.contact.trim()) lines.push(`Contact: ${v.contact.trim()}`)
  if (v.rating) lines.push(`Rating: ${v.rating}/5 (${ratingWords[v.rating]})`)
  lines.push('', v.message.trim())
  return lines.join('\n')
}

export default function Feedback() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  // idle | sending | sent | handed-off | error
  const [status, setStatus] = useState('idle')

  const viaWhatsApp = !site.feedbackEndpoint && !!site.whatsapp

  const set = (field) => (e) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (touched[field]) setErrors(validate(next))
  }

  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, contact: true, message: true })
    const firstError = ['name', 'contact', 'message'].find((f) => errs[f])
    if (firstError) {
      document.getElementById(`fb-${firstError}`)?.focus()
      return
    }

    if (site.feedbackEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.feedbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...values, rating: values.rating || null, source: 'website' }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
      } catch {
        setStatus('error')
      }
      return
    }

    if (viaWhatsApp) {
      window.open(whatsappLink(toText(values)), '_blank', 'noopener')
      setStatus('handed-off')
      return
    }

    setStatus('error')
  }

  const reset = () => {
    setValues(empty)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  const fieldProps = (field) => ({
    id: `fb-${field}`,
    name: field,
    value: values[field],
    onChange: set(field),
    onBlur: blur(field),
    'aria-invalid': touched[field] && errors[field] ? 'true' : undefined,
    'aria-describedby': touched[field] && errors[field] ? `fb-${field}-error` : undefined,
  })

  const fieldError = (field) =>
    touched[field] &&
    errors[field] && (
      <p className="field__error" id={`fb-${field}-error`}>
        {errors[field]}
      </p>
    )

  const done = status === 'sent' || status === 'handed-off'

  return (
    <section className="feedback" id="feedback" aria-labelledby="feedback-title">
      <div className="feedback__grid wrap">
        <div className="feedback__intro">
          <p className="eyebrow" data-reveal>
            Feedback
          </p>
          <h2 id="feedback-title" className="display section-title" data-reveal>
            Tell us how it went
          </h2>
          <p className="lede" data-reveal>
            Something you loved, something we got wrong, a drink you wish we made. Tell us, it comes
            straight to the café.
          </p>
        </div>

        {done ? (
          <div className="feedback__done" role="status">
            <BeanMark className="feedback__done-mark" />
            {status === 'sent' ? (
              <>
                <p className="display">Thank you, {values.name.trim().split(' ')[0]}.</p>
                <p>Your message reached us. If you left a number or email, we may get back to you.</p>
              </>
            ) : (
              <>
                <p className="display">Almost there.</p>
                <p>
                  WhatsApp opened in a new tab with your message written out. Just press send. If it
                  didn’t open,{' '}
                  <a href={whatsappLink(toText(values))} target="_blank" rel="noopener noreferrer">
                    tap here
                  </a>
                  .
                </p>
              </>
            )}
            <button type="button" className="btn btn--ghost" onClick={reset}>
              Write another
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate data-reveal>
            <div className="form__row">
              <div className="field">
                <label htmlFor="fb-name">Name</label>
                <input type="text" autoComplete="name" required {...fieldProps('name')} />
                {fieldError('name')}
              </div>
              <div className="field">
                <label htmlFor="fb-contact">
                  Phone or email <span className="field__opt">optional</span>
                </label>
                <input type="text" inputMode="email" autoComplete="email" {...fieldProps('contact')} />
                {fieldError('contact')}
              </div>
            </div>

            <fieldset className="field rating">
              <legend>
                Your visit <span className="field__opt">optional</span>
              </legend>
              <div className="rating__options">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className={`rating__bean${values.rating >= n ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={values.rating === n}
                      onChange={() => setValues((v) => ({ ...v, rating: n }))}
                      onClick={() => values.rating === n && setValues((v) => ({ ...v, rating: 0 }))}
                    />
                    <BeanMark />
                    <span className="sr-only">
                      {n} out of 5, {ratingWords[n]}
                    </span>
                  </label>
                ))}
                <span className="rating__word" aria-hidden="true">
                  {ratingWords[values.rating]}
                </span>
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="fb-message">Message</label>
              <textarea rows={5} required {...fieldProps('message')} />
              {fieldError('message')}
            </div>

            {status === 'error' && (
              <p className="form__alert" role="alert">
                We couldn’t send that just now.{' '}
                {site.whatsapp ? (
                  <>
                    Please try again, or{' '}
                    <a href={whatsappLink(toText(values))} target="_blank" rel="noopener noreferrer">
                      send it on WhatsApp
                    </a>
                    .
                  </>
                ) : (
                  <>Please call us on {site.phone.display}.</>
                )}
              </p>
            )}

            <div className="form__foot">
              <button type="submit" className="btn btn--ember" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : viaWhatsApp ? 'Send via WhatsApp' : 'Send feedback'}
              </button>
              {viaWhatsApp && <p className="form__hint">Opens WhatsApp with your message ready to send.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
