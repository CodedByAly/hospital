import OpenStatus from './OpenStatus'
import { ArrowRightIcon, ClockIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons'
import { site, telLink, whatsappLink } from '../data/site'
import './Visit.css'

export default function Visit() {
  const instagram = site.social.find((s) => s.id === 'instagram')

  return (
    <section className="visit" id="visit" aria-labelledby="visit-title">
      <div className="visit__grid wrap">
        <div className="visit__info">
          <p className="eyebrow" data-reveal>
            Visit
          </p>
          <h2 id="visit-title" className="display section-title" data-reveal>
            Find us in {site.town}
          </h2>

          <ul className="visit__list" data-reveal>
            <li>
              <ClockIcon />
              <div>
                <p className="visit__label">Opening hours</p>
                <p className="visit__value">{site.hours.display}</p>
                <OpenStatus />
              </div>
            </li>
            <li>
              <PinIcon />
              <div>
                <p className="visit__label">Address</p>
                <p className="visit__value">
                  {site.town}, {site.country}
                </p>
                <a href={site.maps} className="visit__link" target="_blank" rel="noopener noreferrer">
                  Open in Google Maps <ArrowRightIcon />
                </a>
              </div>
            </li>
            <li>
              <PhoneIcon />
              <div>
                <p className="visit__label">Phone</p>
                <a href={telLink} className="visit__value visit__value--link">
                  {site.phone.display}
                </a>
                {site.whatsapp && (
                  <a
                    href={whatsappLink('Hi Bean Avenue, ')}
                    className="visit__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message us on WhatsApp <ArrowRightIcon />
                  </a>
                )}
              </div>
            </li>
            {instagram && (
              <li>
                <InstagramIcon />
                <div>
                  <p className="visit__label">Instagram</p>
                  <a
                    href={instagram.href}
                    className="visit__value visit__value--link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {instagram.handle}
                  </a>
                  <p className="visit__hint">Events and new things on the menu are posted here.</p>
                </div>
              </li>
            )}
          </ul>

          <div className="visit__actions" data-reveal>
            <a href={site.maps} className="btn" target="_blank" rel="noopener noreferrer">
              <PinIcon /> Directions
            </a>
            <a href={telLink} className="btn btn--ghost">
              <PhoneIcon /> Call
            </a>
            {site.whatsapp && (
              <a href={whatsappLink()} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <figure className="visit__media" data-reveal>
          <img
            src="/images/sushi.webp"
            width="504"
            height="320"
            alt="A tray of sushi rolls topped with mango, shrimp and crab at Bean Avenue"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Sushi, now at Bean Avenue.</figcaption>
        </figure>
      </div>
    </section>
  )
}
