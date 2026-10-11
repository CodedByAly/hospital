import Logo from './Logo.jsx';
import { ArrowUpRight, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons.jsx';
import { restaurant, whatsappLink } from '../data/restaurant.js';

export default function Visit() {
  const { address, phones, hours, social, mapsUrl } = restaurant;

  return (
    <section id="visit" className="visit" aria-labelledby="visit-title">
      <Logo className="visit__watermark" title="" />
      <div className="container visit__grid">
        <div className="visit__intro" data-reveal>
          <p className="eyebrow eyebrow--light">Visit</p>
          <h2 id="visit-title" className="section-title section-title--light">
            A small corner in the heart of <em>{address.street}.</em>
          </h2>
          <a className="btn btn--light" href={mapsUrl} target="_blank" rel="noreferrer">
            <PinIcon width={18} height={18} /> Open in Google Maps
          </a>
        </div>

        <div className="visit__details">
          <div className="visit__block" data-reveal>
            <h3>Address</h3>
            <address>
              {address.street}
              <br />
              {address.landmark}
              <br />
              {address.city}, {address.country}
            </address>
            <a className="link-arrow link-arrow--light" href={mapsUrl} target="_blank" rel="noreferrer">
              Directions <ArrowUpRight width={16} height={16} />
            </a>
          </div>

          <div className="visit__block" data-reveal>
            <h3>Call or message</h3>
            <ul className="visit__list">
              {phones.map((p) => (
                <li key={p.tel}>
                  <a href={`tel:${p.tel}`}>
                    <PhoneIcon width={18} height={18} /> {p.display}
                  </a>
                </li>
              ))}
              <li>
                <a href={whatsappLink('Hello Sukun, ')} target="_blank" rel="noreferrer">
                  <WhatsAppIcon width={18} height={18} /> WhatsApp us
                </a>
              </li>
            </ul>
          </div>

          {hours.length > 0 && (
            <div className="visit__block" data-reveal>
              <h3>Opening hours</h3>
              <dl className="visit__hours">
                {hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="visit__block" data-reveal>
            <h3>Follow</h3>
            <ul className="visit__list">
              <li>
                <a href={social.instagram.url} target="_blank" rel="noreferrer">
                  <InstagramIcon width={18} height={18} /> {social.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
