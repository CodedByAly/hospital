import { ArrowRightIcon, ClockIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons'
import { site, telLink, whatsappLink } from '../data/site'
import './Contact.css'

export default function Contact() {
  const where = [site.address, site.town, site.country].filter(Boolean).join(', ')

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__grid wrap">
        <div className="contact__intro">
          <p className="eyebrow" data-reveal>
            Contact
          </p>
          <h2 id="contact-title" className="display section-title" data-reveal>
            Hungry? Message us.
          </h2>
          <p className="lede" data-reveal>
            WhatsApp is the quickest way to reach us, for orders, questions or anything else.
          </p>
          {site.whatsapp && (
            <a
              href={whatsappLink(`Hi ${site.name}, `)}
              className="btn btn--olive contact__wa"
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </a>
          )}
        </div>

        <ul className="contact__list" data-reveal>
          {site.whatsapp && (
            <li>
              <WhatsAppIcon />
              <div>
                <p className="contact__label">WhatsApp</p>
                <a href={whatsappLink()} className="contact__value" target="_blank" rel="noopener noreferrer">
                  {site.phone.display}
                </a>
              </div>
            </li>
          )}
          <li>
            <PhoneIcon />
            <div>
              <p className="contact__label">Call</p>
              <a href={telLink} className="contact__value">
                {site.phone.display}
              </a>
            </div>
          </li>
          {site.social.map((s) => (
            <li key={s.id}>
              <InstagramIcon />
              <div>
                <p className="contact__label">{s.label}</p>
                <a href={s.href} className="contact__value" target="_blank" rel="noopener noreferrer">
                  {s.handle}
                </a>
              </div>
            </li>
          ))}
          <li>
            <PinIcon />
            <div>
              <p className="contact__label">Location</p>
              <p className="contact__value">{where}</p>
              {site.maps && (
                <a href={site.maps} className="contact__link" target="_blank" rel="noopener noreferrer">
                  Open in Google Maps <ArrowRightIcon />
                </a>
              )}
            </div>
          </li>
          {site.hours && (
            <li>
              <ClockIcon />
              <div>
                <p className="contact__label">Opening hours</p>
                <p className="contact__value">{site.hours}</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
