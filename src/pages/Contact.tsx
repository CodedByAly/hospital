import { useState, type FormEvent } from 'react'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { restaurant, whatsappLink, phoneLink, mapsLink } from '../config/restaurant'
import { sendFeedback } from '../services/feedback'
import { clock } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { Reveal } from '../components/Reveal'
import { SocialLinks } from '../components/SocialLinks'
import { OpenStatus } from '../components/OpenStatus'
import { Icon, type IconName } from '../components/Icon'
import './Contact.css'

export default function Contact() {
  const { t, l, lang } = useLang()
  usePageMeta(t.contact.title, `Call or WhatsApp Kuku Chix Joint on ${restaurant.phoneDisplay}. Khaldeh, Lebanon.`)

  const cards: { icon: IconName; label: string; value: string; href: string; ltr?: boolean; external?: boolean }[] = [
    { icon: 'whatsapp', label: t.contact.whatsapp, value: restaurant.phoneDisplay, href: whatsappLink(), ltr: true, external: true },
    { icon: 'phone', label: t.contact.phone, value: restaurant.phoneDisplay, href: phoneLink, ltr: true },
    { icon: 'mail', label: t.contact.email, value: restaurant.email, href: `mailto:${restaurant.email}` },
    { icon: 'pin', label: t.contact.address, value: l(restaurant.address), href: mapsLink, external: true },
  ]

  return (
    <div className="contact">
      <header className="contact__hero">
        <div className="container">
          <h1>{t.contact.title}</h1>
          <p>{t.contact.sub}</p>
        </div>
      </header>

      <div className="container contact__grid">
        <div className="contact__info">
          <ul className="contact-cards">
            {cards.map((c, i) => (
              <Reveal as="li" key={c.label} delay={i * 0.05}>
                <a href={c.href} className="contact-card" target={c.external ? '_blank' : undefined} rel={c.external ? 'noreferrer' : undefined}>
                  <span className="contact-card__icon"><Icon name={c.icon} /></span>
                  <span className="contact-card__text">
                    <span>{c.label}</span>
                    <strong dir={c.ltr ? 'ltr' : undefined}>{c.value}</strong>
                  </span>
                  <Icon name="arrow" className="contact-card__go flip-rtl" />
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal className="contact-hours">
            <h2><Icon name="clock" /> {t.contact.hours}</h2>
            <p>
              {t.contact.everyday}: <strong dir="ltr">{clock(restaurant.hours.open, lang)} – {clock(restaurant.hours.close, lang)}</strong>
            </p>
            <OpenStatus />
          </Reveal>

          <Reveal className="contact-follow">
            <h2>{t.contact.follow}</h2>
            <SocialLinks withWhatsapp />
          </Reveal>

          <Reveal className="contact-map">
            <iframe
              title={`${restaurant.name} — map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapsSearchQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href={mapsLink} target="_blank" rel="noreferrer" className="btn btn--sm">
              <Icon name="pin" /> {t.contact.directions}
            </a>
          </Reveal>
        </div>

        <FeedbackForm />
      </div>
    </div>
  )
}

function FeedbackForm() {
  const { t } = useLang()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'wa' | 'error'>('idle')
  const [waUrl, setWaUrl] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (name.trim().length < 2) errs.name = t.contact.fbErrors.name
    if (!rating) errs.rating = t.contact.fbErrors.rating
    if (message.trim().length < 3) errs.message = t.contact.fbErrors.message
    setErrors(errs)
    if (Object.keys(errs).length) return
    setState('sending')
    try {
      const res = await sendFeedback({ name: name.trim(), contact: contact.trim(), rating, message: message.trim() })
      if (res.via === 'whatsapp') {
        setWaUrl(res.url)
        setState('wa')
        window.open(res.url, '_blank')
      } else {
        setState('done')
      }
      setMessage('')
      setRating(0)
    } catch {
      setState('error')
    }
  }

  return (
    <Reveal className="feedback">
      <h2>{t.contact.feedbackTitle}</h2>
      <p className="feedback__sub">{t.contact.feedbackSub}</p>

      {state === 'done' || state === 'wa' ? (
        <div className="feedback__done" role="status">
          <Icon name="check" />
          <p>{state === 'done' ? t.contact.fbThanks : t.contact.fbViaWhatsapp}</p>
          {state === 'wa' && (
            <a className="btn btn--wa btn--sm" href={waUrl} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> {t.contact.whatsapp}
            </a>
          )}
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setState('idle')}>
            {t.contact.fbSend}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="feedback__form">
          <div className="field" data-invalid={!!errors.name}>
            <label htmlFor="fb-name">{t.contact.fbName}<span className="req" aria-hidden="true">*</span></label>
            <input id="fb-name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="fb-contact">{t.contact.fbContact}</label>
            <input id="fb-contact" className="input" value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <fieldset className="field rating" data-invalid={!!errors.rating}>
            <legend className="label">{t.contact.fbRating}<span className="req" aria-hidden="true">*</span></legend>
            <div className="rating__stars" dir="ltr">
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className={n <= rating ? 'is-on' : ''}>
                  <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} />
                  <Icon name="star" />
                  <span className="sr-only">{fmt(t.contact.fbRate, { n })}</span>
                </label>
              ))}
            </div>
            {errors.rating && <span className="field-error">{errors.rating}</span>}
          </fieldset>
          <div className="field" data-invalid={!!errors.message}>
            <label htmlFor="fb-message">{t.contact.fbMessage}<span className="req" aria-hidden="true">*</span></label>
            <textarea id="fb-message" className="textarea" rows={5} maxLength={1000} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!errors.message} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
          {state === 'error' && <p className="field-error" role="alert">{t.contact.fbError}</p>}
          <button type="submit" className="btn btn--yellow btn--block" disabled={state === 'sending'}>
            {state === 'sending' ? t.contact.fbSending : t.contact.fbSend}
          </button>
        </form>
      )}
    </Reveal>
  )
}
