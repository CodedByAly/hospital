import { Star } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { lines, restaurant, whatsappLink } from '../config/restaurant'
import './Feedback.css'

/**
 * Feedback goes to the restaurant as a WhatsApp message (there is no
 * server). Nothing is shown publicly, so no reviews are invented.
 */
export default function Feedback() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [lineId, setLineId] = useState(lines[0].id)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Please add your name.'
    if (!rating) errs.rating = 'Pick a rating from 1 to 5.'
    if (message.trim().length < 3) errs.message = 'Write a few words about your visit.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const line = lines.find((l) => l.id === lineId) ?? lines[0]
    const text = `Feedback for ${restaurant.name} from the website\nName: ${name.trim()}\nRating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)\n\n${message.trim()}`
    window.open(whatsappLink(line, text), '_blank', 'noopener')
    setSent(true)
  }

  return (
    <section className="feedback container" aria-labelledby="fb-title">
      <div className="feedback__intro">
        <p className="mark mark--ember">Feedback</p>
        <h2 id="fb-title" className="feedback__title">Tell us how it went.</h2>
        <p className="muted">Your message opens in WhatsApp, addressed to the restaurant. Press send there to deliver it.</p>
      </div>
      <form className="feedback__form" onSubmit={submit} noValidate>
        <label className="field">
          <span className="field__label">Your name</span>
          <input id="fb-name" className="input" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} autoComplete="name" />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>
        <fieldset className="field feedback__stars">
          <legend className="field__label">Rating</legend>
          <div role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} out of 5`} onClick={() => setRating(n)} data-on={n <= rating || undefined}>
                <Star size={26} aria-hidden="true" />
              </button>
            ))}
          </div>
          {errors.rating && <span className="field__error">{errors.rating}</span>}
        </fieldset>
        <label className="field feedback__wide">
          <span className="field__label">Your feedback</span>
          <textarea id="fb-message" className="input" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!errors.message} placeholder="What did you order, and how was it?" />
          {errors.message && <span className="field__error">{errors.message}</span>}
        </label>
        <label className="field">
          <span className="field__label">Send to</span>
          <select id="fb-line" className="input" value={lineId} onChange={(e) => setLineId(e.target.value)}>
            {lines.map((l) => <option key={l.id} value={l.id}>{l.display}</option>)}
          </select>
        </label>
        <div className="feedback__send">
          <button type="submit" className="btn btn--ember btn--lg">Open in WhatsApp</button>
          {sent && <p className="feedback__ok" role="status">WhatsApp opened with your message. Press send there to deliver it.</p>}
        </div>
      </form>
    </section>
  )
}
