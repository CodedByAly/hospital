import Icon from '../components/Icon'
import { restaurant, telLink, whatsappLink, fullAddress } from '../config/restaurant'

export default function About() {
  const ig = restaurant.social.instagram
  return (
    <section id="about" className="about section" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="about__photo" data-reveal>
          <img
            src="/images/photos/chippy-shrimp-tray.webp"
            width="1100"
            height="692"
            alt="Crispy Chippy shrimp with fries, lemon, tartar and cocktail sauce on Chippy branded paper"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="about__copy" data-reveal>
          <p className="eyebrow">About Chippy</p>
          <h2 id="about-title" className="display">Fish, shrimp &amp; chicken, done properly</h2>
          <p>
            Chippy is a fish and shrimp shop in Hleliyeh, right across from Queen Station. The menu keeps it simple: seafood
            combos with fries, Chippy Chicken boxes from five pieces up to twenty for the whole family, loaded sandwiches,
            and mongo bowls over rice or noodles.
          </p>
          <p>Pick up your order at the shop, or call us and we will bring it to you.</p>

          <dl className="facts">
            <div className="facts__item">
              <dt><Icon name="pin" size={18} /> Find us</dt>
              <dd>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">{fullAddress}</a>
              </dd>
            </div>
            <div className="facts__item">
              <dt><Icon name="truck" size={18} /> Delivery</dt>
              <dd>
                <a href={telLink}>{restaurant.phone.display}</a> ·{' '}
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </dd>
            </div>
            <div className="facts__item">
              <dt><Icon name="store" size={18} /> Pickup</dt>
              <dd>Order online or by phone, collect at the shop</dd>
            </div>
            {ig && (
              <div className="facts__item">
                <dt><Icon name="instagram" size={18} /> Instagram</dt>
                <dd>
                  <a href={ig.url} target="_blank" rel="noopener noreferrer">@{ig.handle}</a>
                </dd>
              </div>
            )}
            {restaurant.hours && (
              <div className="facts__item">
                <dt><Icon name="clock" size={18} /> Hours</dt>
                <dd>
                  {restaurant.hours.map((h) => (
                    <span key={h.days} className="facts__line">{h.days}: {h.hours}</span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  )
}
