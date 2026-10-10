import { restaurant } from '../data/restaurant.js'
import { useShop } from '../context/ShopContext.jsx'
import Icon from '../components/Icon.jsx'
import OpenStatus from '../components/OpenStatus.jsx'
import { goToSection } from '../lib/router.js'
import { whatsappUrl } from '../lib/whatsapp.js'
import { hoursLabel } from '../lib/hours.js'

export default function Hero() {
  const { branchId, setBranchId } = useShop()

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="halal-badge">Halal</span>
            {restaurant.branches.map((b, i) => (
              <span key={b.id} className="hero__branch">
                {i > 0 && <span aria-hidden="true" className="hero__sep">/</span>}
                <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">{b.name}</a>
              </span>
            ))}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="visually-hidden">{restaurant.name}: </span>
            <span aria-hidden="true">Birdy<br />Fam</span>
          </h1>
          <p className="hero__lead">
            Chip-crusted chicken strips, sliders and wraps, with our legendary Chico sauce on the side. Then something sweet: a Cregg, a Brookie or a Birdy Sundae.
          </p>
          <div className="hero__ctas">
            <button type="button" className="btn btn--cream btn--lg" onClick={() => goToSection('menu')}>
              Order for pickup
              <Icon name="arrowRight" size={18} />
            </button>
            <a className="btn btn--ghost-light btn--lg" href={whatsappUrl('Hi Birdy Fam, I would like to place an order.')} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} />
              Order on WhatsApp
            </a>
          </div>
          <OpenStatus className="hero__status" />
        </div>

        <div className="hero__art">
          <img
            src="/images/logo.webp"
            srcSet="/images/logo-240.webp 240w, /images/logo.webp 482w"
            sizes="(min-width: 960px) 420px, 64vw"
            alt="The Birdy Fam family: the chef rooster with his two chicks"
            width="482"
            height="482"
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="branches container" id="branches" aria-labelledby="branches-title">
        <h2 id="branches-title" className="branches__title">Our branches</h2>
        <ul className="branches__list">
          {restaurant.branches.map((b) => {
            const selected = branchId === b.id
            return (
              <li key={b.id} className={`branch ${selected ? 'is-selected' : ''}`}>
                <div className="branch__head">
                  <Icon name="pin" size={20} />
                  <div>
                    <h3 className="branch__name">{b.name}</h3>
                    <p className="branch__meta">Every day, {hoursLabel}</p>
                  </div>
                </div>
                <div className="branch__actions">
                  <a className="branch__link" href={b.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Directions <Icon name="external" size={14} />
                  </a>
                  <button
                    type="button"
                    className="branch__pick"
                    aria-pressed={selected}
                    onClick={() => {
                      setBranchId(b.id)
                      goToSection('menu')
                    }}
                  >
                    {selected ? <><Icon name="check" size={15} strokeWidth={2.4} /> Ordering here</> : 'Order from here'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
