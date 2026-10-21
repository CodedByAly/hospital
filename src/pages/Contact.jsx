import { Checker } from '../components/Checker.jsx'
import { FeedbackForm } from '../components/FeedbackForm.jsx'
import { IconClock, IconInstagram, IconMail, IconPhone, IconPin, IconWhatsApp } from '../components/Icons.jsx'
import { OpenStatus } from '../components/OpenStatus.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { restaurant } from '../config/restaurant.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { emailLink, phoneLink, whatsappLink } from '../lib/format.js'

const instagram = restaurant.social.find((s) => s.id === 'instagram')

const channels = [
  { icon: IconPhone, label: 'Call', value: restaurant.phone.display, href: phoneLink },
  { icon: IconWhatsApp, label: 'WhatsApp', value: restaurant.phone.display, href: whatsappLink(), external: true },
  { icon: IconMail, label: 'Email', value: restaurant.email, href: emailLink },
  { icon: IconInstagram, label: 'Instagram', value: instagram.handle, href: instagram.url, external: true },
  { icon: IconPin, label: 'Location', value: restaurant.address.display, href: restaurant.mapsUrl, external: true, cta: 'Open in Google Maps' },
  { icon: IconClock, label: 'Hours', value: restaurant.hours.label },
]

export default function Contact() {
  usePageMeta('Contact', `Call or WhatsApp ${restaurant.name} on ${restaurant.phone.display}. ${restaurant.address.display}, open ${restaurant.hours.short}.`)
  return (
    <div className="contact">
      <header className="page-hero page-hero--yellow">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 className="page-hero__title">Talk to us.</h1>
          <p className="page-hero__lede">
            Questions about an order, a big group, or something we can do better. The quickest way is WhatsApp.
          </p>
          <OpenStatus />
        </div>
        <Checker tone="red" />
      </header>

      <div className="container contact__body">
        <Reveal as="section" className="contact__channels" aria-labelledby="reach-title">
          <h2 id="reach-title" className="about__heading">Reach us</h2>
          <ul className="channel-list">
            {channels.map(({ icon: Icon, label, value, href, external, cta }) => {
              const content = (
                <>
                  <span className="channel__icon">
                    <Icon size={20} />
                  </span>
                  <span className="channel__text">
                    <span className="channel__label">{label}</span>
                    <span className="channel__value">{value}</span>
                    {cta && <span className="channel__cta">{cta}</span>}
                  </span>
                </>
              )
              return (
                <li key={label}>
                  {href ? (
                    <a className="channel" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {content}
                    </a>
                  ) : (
                    <div className="channel">{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
          <a href={whatsappLink('Hi Jungs, ')} className="btn btn--wa btn--block" target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={20} /> Message us on WhatsApp
          </a>
        </Reveal>

        <Reveal as="section" className="contact__feedback" aria-labelledby="feedback-title" delay={80}>
          <h2 id="feedback-title" className="about__heading">Leave feedback</h2>
          <p className="section-sub">Tell us how your meal was, or what we could do better.</p>
          <FeedbackForm />
        </Reveal>
      </div>
    </div>
  )
}
