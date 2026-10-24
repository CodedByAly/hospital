import { useState } from 'react'
import { CheckIcon } from './Icons'
import { site, whatsappLink } from '../data/site'
import './Feedback.css'

const empty = { name: '', contact: '', rating: 0, message: '' }
const ratingWords = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Loved it']

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  const c = v.contact.trim()
  if (c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && !/^\+?[\d\s()-]{7,}$/.test(c))
    e.contact = 'That doesn’t look like a phone number or email.'
  if (v.message.trim().length < 5) e.message = 'Write a few words so we know what happened.'
  return e
}

function toText(v) {
  const lines = [`Feedback for ${site.name}`, `Name: ${v.name.trim()}`]
  if (v.contact.trim()) lines.push(`Contact: ${v.contact.trim()}`)
  if (v.rating) lines.push(`Rating: ${v.rating}/5 (${ratingWords[v.rating]})`)
  lines.push('', v.message.trim())
  return lines.join('\n')
}

export default function Feedback() {
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | handed-off | error
  const viaWhatsApp = !site.feedbackEndpoint && !!site.whatsapp

  const set = (f) => (e) => {
    const next = { ...v, [f]: e.target.value }
    setV(next)
    if (touched[f]) setErrors(validate(next))
  }
  const blur = (f) => () => {
    setTouched((t) => ({ ...t, [f]: true }))
    setErrors(validate(v))
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(v)
    setErrors(errs)
    setTouched({ name: true, contact: true, message: true })
    const first = ['name', 'contact', 'message'].find((f) => errs[f])
    if (first) {
      document.getElementById(`fb-${first}`)?.focus()
      return
    }
    if (site.feedbackEndpoint) {
      setStatus('sending')
      try {
        const res = await fetch(site.feedbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...v, rating: v.rating || null, source: 'website' }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStatus('sent')
      } catch {
        setStatus('error')
      }
    } else if (viaWhatsApp) {
      window.open(whatsappLink(toText(v)), '_blank', 'noopener')
      setStatus('handed-off')
    } else {
      setStatus('error')
    }
  }

  const fp = (f) => ({
    id: `fb-${f}`,
    name: f,
    value: v[f],
    onChange: set(f),
    onBlur: blur(f),
    className: 'input',
    'aria-invalid': touched[f] && errors[f] ? 'true' : undefined,
    'aria-describedby': touched[f] && errors[f] ? `fb-${f}-err` : undefined,
  })
  const err = (f) =>
    touched[f] &&
    errors[f] && (
      <p className="field__error" id={`fb-${f}-err`}>
        {errors[f]}
      </p>
    )

  const reset = () => {
    setV(empty)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  return (
    <section className="feedback" id="feedback" aria-labelledby="feedback-title">
      <div className="feedback__grid wrap">
        <div className="feedback__intro">
          <p className="eyebrow" data-reveal>
            Feedback
          </p>
          <h2 id="feedback-title" className="display section-title" data-reveal>
            How was it?
          </h2>
          <p className="lede" data-reveal>
            Loved the Chick Boom? Fries not crispy enough? Tell us. It comes straight to the kitchen.
          </p>
        </div>

        {status === 'sent' || status === 'handed-off' ? (
          <div className="feedback__done" role="status">
            <span className="feedback__tick">
              <CheckIcon />
            </span>
            {status === 'sent' ? (
              <>
                <p className="display">Thank you, {v.name.trim().split(' ')[0]}.</p>
                <p>Your message reached us.</p>
              </>
            ) : (
              <>
                <p className="display">Almost there.</p>
                <p>
                  WhatsApp opened with your message written out. Just press send. If it didn’t open,{' '}
                  <a href={whatsappLink(toText(v))} target="_blank" rel="noopener noreferrer">
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
          <form className="fb-form" onSubmit={submit} noValidate data-reveal>
            <div className="fb-form__row">
              <div className="field">
                <label htmlFor="fb-name">Name</label>
                <input type="text" autoComplete="name" {...fp('name')} />
                {err('name')}
              </div>
              <div className="field">
                <label htmlFor="fb-contact">
                  Phone or email <span className="field__opt">optional</span>
                </label>
                <input type="text" autoComplete="email" {...fp('contact')} />
                {err('contact')}
              </div>
            </div>

            <fieldset className="field">
              <legend className="field__label">
                Rating <span className="field__opt">optional</span>
              </legend>
              <div className="rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n} className={`rating__opt${v.rating >= n ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="rating"
                      value={n}
                      checked={v.rating === n}
                      onChange={() => setV((c) => ({ ...c, rating: n }))}
                    />
                    <span aria-hidden="true">{n}</span>
                    <span className="sr-only">
                      {n} out of 5, {ratingWords[n]}
                    </span>
                  </label>
                ))}
                <span className="rating__word" aria-hidden="true">
                  {ratingWords[v.rating]}
                </span>
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="fb-message">Message</label>
              <textarea rows={5} {...fp('message')} />
              {err('message')}
            </div>

            {status === 'error' && (
              <p className="fb-form__alert" role="alert">
                We couldn’t send that just now. Please try again, or call us on {site.phone.display}.
              </p>
            )}

            <div className="fb-form__foot">
              <button type="submit" className="btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : viaWhatsApp ? 'Send via WhatsApp' : 'Send feedback'}
              </button>
              {viaWhatsApp && <p className="field__hint">Opens WhatsApp with your message ready to send.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
