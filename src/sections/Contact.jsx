import Icon from '../components/Icon'
import Feedback from './Feedback'
import { restaurant, telLink, whatsappLink, fullAddress } from '../config/restaurant'

export default function Contact() {
  const ig = restaurant.social.instagram
  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__info" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title" className="display">Call or drop by</h2>
          <p className="contact__lead">Delivery orders and WhatsApp go to the same number.</p>

          <a href={telLink} className="contact__phone">
            <span className="contact__phone-label">Delivery &amp; orders</span>
            <span className="contact__phone-number">{restaurant.phone.display}</span>
          </a>

          <div className="contact__buttons">
            <a className="btn btn--whatsapp btn--lg" href={whatsappLink('Hi Chippy, I would like to place an order.')} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={19} />
              <span>Order on WhatsApp</span>
            </a>
            <a className="btn btn--ghost btn--lg" href={telLink}>
              <Icon name="phone" size={18} />
              <span>Call now</span>
            </a>
          </div>

          <ul className="contact__list">
            <li>
              <Icon name="pin" size={19} />
              <div>
                <span className="contact__k">Address</span>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">{fullAddress}, {restaurant.address.country}</a>
                <a className="contact__sub" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
              </div>
            </li>
            <li>
              <Icon name="mail" size={19} />
              <div>
                <span className="contact__k">Email</span>
                <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
              </div>
            </li>
            {ig && (
              <li>
                <Icon name="instagram" size={19} />
                <div>
                  <span className="contact__k">Instagram</span>
                  <a href={ig.url} target="_blank" rel="noopener noreferrer">@{ig.handle}</a>
                </div>
              </li>
            )}
            <li>
              <Icon name="clock" size={19} />
              <div>
                <span className="contact__k">Opening hours</span>
                {restaurant.hours ? (
                  restaurant.hours.map((h) => (
                    <span key={h.days} className="contact__line">{h.days}: {h.hours}</span>
                  ))
                ) : (
                  <span className="contact__line">Message us on WhatsApp for today&rsquo;s hours</span>
                )}
              </div>
            </li>
          </ul>
        </div>

        <div data-reveal>
          <Feedback />
        </div>
      </div>
    </section>
  )
}
