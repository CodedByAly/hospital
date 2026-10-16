import { restaurant, whatsappLink, telLink } from '../data/restaurant';
import Icon from './Icon';
import Reveal from './Reveal';
import './Visit.css';

export default function Visit() {
  const { address, hours } = restaurant;
  const instagram = restaurant.socials.find((s) => s.id === 'instagram');

  return (
    <section className="visit section" id="visit" aria-labelledby="visit-title">
      <div className="container">
        <Reveal className="visit__head">
          <p className="eyebrow visit__eyebrow">Visit &amp; contact</p>
          <h2 id="visit-title" className="section-title visit__title">
            Meet us on <em>Bikkerman Street.</em>
          </h2>
        </Reveal>

        <div className="visit__grid">
          <Reveal className="visit__card visit__card--where" delay={40}>
            <Icon name="pin" size={22} />
            <h3>Address</h3>
            <address>
              {address.street}
              <br />
              {address.city}, {address.country}
            </address>
            <p className="visit__muted">{address.landmark}</p>
            <a className="visit__link" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps <Icon name="arrowRight" size={16} />
            </a>
          </Reveal>

          <Reveal className="visit__card" delay={100}>
            <Icon name="clock" size={22} />
            <h3>Opening hours</h3>
            <p className="visit__big">{hours.days}</p>
            <p>From {hours.opens}</p>
            {hours.closes && <p>Until {hours.closes}</p>}
            <p className="visit__muted">Dine-in, every day of the week.</p>
          </Reveal>

          <Reveal className="visit__card" delay={160}>
            <Icon name="phone" size={22} />
            <h3>Call or message</h3>
            <a className="visit__big visit__plain visit__phone" href={telLink}>
              {restaurant.phoneDisplay}
            </a>
            <div className="visit__actions">
              <a className="btn btn--light btn--sm" href={telLink}>
                <Icon name="phone" size={16} /> Call
              </a>
              <a className="btn btn--light btn--sm" href={whatsappLink('Hi Talia, ')} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={16} /> WhatsApp
              </a>
            </div>
          </Reveal>

          {instagram && (
            <Reveal className="visit__card visit__card--ig" delay={220}>
              <Icon name="instagram" size={22} />
              <h3>Follow along</h3>
              <a className="visit__big visit__plain" href={instagram.url} target="_blank" rel="noopener noreferrer">
                {instagram.handle}
              </a>
              <p className="visit__muted">New drinks, dishes and what&rsquo;s happening at the cafe.</p>
              <a className="visit__link" href={instagram.url} target="_blank" rel="noopener noreferrer">
                See us on Instagram <Icon name="arrowRight" size={16} />
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
