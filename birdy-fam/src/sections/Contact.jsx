import { restaurant, formatPhone } from '../data/restaurant.js'
import Icon from '../components/Icon.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { hoursLabel } from '../lib/hours.js'
import { telUrl, whatsappUrl } from '../lib/whatsapp.js'
import Feedback from './Feedback.jsx'

export default function Contact() {
  const ref = useReveal()
  const ig = restaurant.social.instagram
  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div ref={ref} className="container contact__grid reveal">
        <div className="contact__info">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="section-title">Find us, call us, message us</h2>

          <ul className="contact-list">
            <li>
              <Icon name="whatsapp" size={20} />
              <div>
                <p className="contact-list__label">Orders on WhatsApp</p>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="contact-list__value">{formatPhone()}</a>
              </div>
            </li>
            <li>
              <Icon name="phone" size={20} />
              <div>
                <p className="contact-list__label">Call</p>
                <a href={telUrl} className="contact-list__value">{formatPhone()}</a>
              </div>
            </li>
            <li>
              <Icon name="clock" size={20} />
              <div>
                <p className="contact-list__label">Opening hours</p>
                <p className="contact-list__value">{restaurant.hours[0].days}, {hoursLabel}</p>
              </div>
            </li>
            {ig && (
              <li>
                <Icon name="instagram" size={20} />
                <div>
                  <p className="contact-list__label">Instagram</p>
                  <a href={ig.url} target="_blank" rel="noopener noreferrer" className="contact-list__value">@{ig.handle}</a>
                </div>
              </li>
            )}
          </ul>

          <div className="contact-branches">
            {restaurant.branches.map((b) => (
              <a key={b.id} href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="contact-branch">
                <Icon name="pin" size={20} />
                <span>
                  <span className="contact-branch__name">{b.name}</span>
                  <span className="contact-branch__hint">Open in Google Maps</span>
                </span>
                <Icon name="arrowRight" size={18} className="contact-branch__arrow" />
              </a>
            ))}
          </div>

          <a className="btn btn--whatsapp btn--lg" href={whatsappUrl('Hi Birdy Fam, ')} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} /> Message us on WhatsApp
          </a>
        </div>

        <Feedback />
      </div>
    </section>
  )
}
