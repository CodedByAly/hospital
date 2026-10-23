import { useState } from 'react'
import { phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { usePageMeta } from '../hooks/usePageMeta'
import { isValidEmail, isValidPhone } from '../lib/validate'
import Field from '../components/Field'
import OpenStatus from '../components/OpenStatus'
import Reveal from '../components/Reveal'
import { CheckIcon, ClockIcon, InstagramIcon, PhoneIcon, PinIcon, StarIcon, WhatsAppIcon } from '../components/Icons'

export default function Contact() {
  usePageMeta('تواصل', `تواصل مع ${restaurant.name}: ${restaurant.phone.display} واتساب واتصال، الموقع على الخريطة، والدوام ${restaurant.hoursLabel}.`)

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow eyebrow--ember">تواصل</p>
          <h1 className="page-title">نحنا عالخط</h1>
          <p className="page-lead">للطلبات، الأسئلة أو أي ملاحظة — اتصل، ابعت واتساب، أو اكتبلنا هون.</p>
        </div>
      </header>

      <section className="section">
        <div className="container contact">
          <div className="contact__cards">
            <Reveal as="a" href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="contact-card contact-card--wa">
              <WhatsAppIcon size={26} />
              <span className="contact-card__label">واتساب</span>
              <span className="contact-card__value" dir="ltr">
                {restaurant.phone.display}
              </span>
            </Reveal>
            <Reveal as="a" href={phoneLink} className="contact-card" delay={50}>
              <PhoneIcon size={26} />
              <span className="contact-card__label">اتصال</span>
              <span className="contact-card__value" dir="ltr">
                {restaurant.phone.display}
              </span>
            </Reveal>
            <Reveal as="a" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="contact-card" delay={100}>
              <PinIcon size={26} />
              <span className="contact-card__label">الموقع</span>
              <span className="contact-card__value">{restaurant.address || 'افتح على خرائط Google'}</span>
            </Reveal>
            <Reveal className="contact-card contact-card--static" delay={150}>
              <ClockIcon size={26} />
              <span className="contact-card__label">الدوام</span>
              <span className="contact-card__value">{restaurant.hoursLabel}</span>
              <OpenStatus />
            </Reveal>
            <Reveal as="a" href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="contact-card" delay={200}>
              <InstagramIcon size={26} />
              <span className="contact-card__label">إنستغرام</span>
              <span className="contact-card__value" dir="ltr">
                @{restaurant.social.instagram.handle}
              </span>
            </Reveal>
          </div>

          <FeedbackForm />
        </div>
      </section>
    </>
  )
}

const RATING_LABELS = ['', 'سيئ', 'مقبول', 'منيح', 'كتير منيح', 'ممتاز']
const EMPTY = { name: '', contact: '', rating: 0, message: '' }

function FeedbackForm() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [waLink, setWaLink] = useState('')
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'اكتب اسمك'
    if (form.contact.trim() && !isValidPhone(form.contact) && !isValidEmail(form.contact)) next.contact = 'رقم أو إيميل غير صحيح'
    if (form.message.trim().length < 5) next.message = 'اكتب ملاحظتك (5 أحرف عالأقل)'
    return next
  }

  const submit = async (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      event.currentTarget.querySelector('[aria-invalid="true"]')?.focus()
      return
    }

    if (!restaurant.feedbackEndpoint) {
      // No form service yet — hand the message to WhatsApp instead.
      const rows = ['ملاحظة من الموقع', `الاسم: ${form.name.trim()}`]
      if (form.contact.trim()) rows.push(`للتواصل: ${form.contact.trim()}`)
      if (form.rating) rows.push(`التقييم: ${form.rating}/5`)
      rows.push('', form.message.trim())
      const link = whatsappLink(rows.join('\n'))
      setWaLink(link)
      window.open(link, '_blank', 'noopener')
      setStatus('sent')
      setForm(EMPTY)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(restaurant.feedbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, rating: form.rating || null }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    const viaWhatsApp = !restaurant.feedbackEndpoint
    return (
      <div className="feedback feedback--done" role="status">
        <span className="feedback__check">
          <CheckIcon size={28} />
        </span>
        <h2 className="feedback__title">{viaWhatsApp ? 'بقي تكبس إرسال على واتساب' : 'شكراً، وصلتنا ملاحظتك'}</h2>
        <p className="muted">
          {viaWhatsApp
            ? 'فتحنالك رسالة جاهزة على واتساب. إذا ما فتحت، كبوس هون.'
            : 'منقرا كل رسالة، ومنرد إذا تركتلنا رقم أو إيميل.'}
        </p>
        <div className="feedback__actions">
          {viaWhatsApp && waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              <WhatsAppIcon size={20} />
              افتح واتساب
            </a>
          )}
          <button type="button" className="btn btn--outline" onClick={() => setStatus('idle')}>
            ملاحظة جديدة
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="feedback" onSubmit={submit} noValidate>
      <h2 className="feedback__title">رأيك بيهمنا</h2>
      <p className="muted">شي عجبك، أو شي لازم نحسّنه؟ اكتبلنا.</p>

      <Field label="الاسم" error={errors.name}>
        <input className="input" value={form.name} onChange={set('name')} autoComplete="name" maxLength={60} />
      </Field>

      <Field label="رقم الهاتف أو الإيميل" optional hint="إذا بدك نرد عليك" error={errors.contact}>
        <input className="input" value={form.contact} onChange={set('contact')} dir="auto" maxLength={80} inputMode="email" />
      </Field>

      <fieldset className="field rating">
        <legend className="field__label">
          تقييمك <span className="field__optional">اختياري</span>
        </legend>
        <div className="rating__stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rating__star ${n <= form.rating ? 'is-on' : ''}`}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={form.rating === n}
                onChange={() => setForm((f) => ({ ...f, rating: n }))}
                onClick={() => form.rating === n && setForm((f) => ({ ...f, rating: 0 }))}
                className="sr-only"
              />
              <StarIcon size={28} filled={n <= form.rating} />
              <span className="sr-only">{RATING_LABELS[n]}</span>
            </label>
          ))}
          {form.rating > 0 && <span className="rating__label">{RATING_LABELS[form.rating]}</span>}
        </div>
      </fieldset>

      <Field label="ملاحظتك" error={errors.message}>
        <textarea className="input" rows={5} value={form.message} onChange={set('message')} maxLength={1000} />
      </Field>

      {status === 'error' && (
        <p className="form-error" role="alert">
          ما قدرنا نبعت الرسالة. جرّب كمان مرة أو راسلنا عالواتساب.
        </p>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? 'عم نبعت…' : restaurant.feedbackEndpoint ? 'إرسال' : 'إرسال عبر واتساب'}
      </button>
    </form>
  )
}
