import Logo from './Logo'
import { ArrowRightIcon, ScooterIcon, StoreIcon, WhatsAppIcon } from './Icons'
import { useCart } from '../cart/CartContext'
import { itemsById } from '../data/menu'
import { money, site, whatsappLink } from '../data/site'
import './Hero.css'

const featured = itemsById['mushroom-steak']

export default function Hero() {
  const { openItem } = useCart()

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__grid wrap">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">{site.specialties.join(' · ')}</p>

          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{site.name}</span>
            <Logo />
          </h1>

          <p className="hero__tagline display">{site.tagline}</p>

          <p className="lede hero__lede">
            {site.bio} Crispy chicken, steak sandwiches, burgers and Lebanese favorites like taouk and
            kafta. Order for delivery or pickup, and pay cash when it’s in your hands.
          </p>

          <div className="hero__actions">
            <a href="#menu" className="btn">
              Order now <ArrowRightIcon />
            </a>
            {site.whatsapp && (
              <a href={whatsappLink()} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Chat with us
              </a>
            )}
          </div>

          <ul className="hero__perks" aria-label="Ways to order">
            {site.ordering.delivery && (
              <li>
                <ScooterIcon /> Delivery
              </li>
            )}
            {site.ordering.pickup && (
              <li>
                <StoreIcon /> Pickup
              </li>
            )}
            <li>
              <span className="hero__cash" aria-hidden="true">
                $
              </span>
              Cash payment
            </li>
          </ul>
        </div>

        <figure className="hero__media">
          <div className="hero__frame">
            <img
              src="/images/mushroom-steak.webp"
              srcSet="/images/mushroom-steak-420.webp 420w, /images/mushroom-steak.webp 591w"
              sizes="(min-width: 960px) 40vw, 100vw"
              width="591"
              height="523"
              alt="Mushroom Steak: sliced beef, onions, mushrooms and melted cheese in a toasted sub, cut in half"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <figcaption className="hero__card">
            <div>
              <p className="hero__card-name">{featured.name}</p>
              <p className="hero__card-desc">{featured.desc}</p>
            </div>
            <button type="button" className="btn hero__card-btn" onClick={() => openItem(featured)}>
              {money(featured.price)}
              <span className="hero__card-add">Add</span>
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
