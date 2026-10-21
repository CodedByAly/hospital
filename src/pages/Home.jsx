import { Link } from 'react-router-dom'
import { Checker } from '../components/Checker.jsx'
import { IconArrowRight, IconClock, IconInstagram, IconPhone, IconPin, IconScooter, IconWhatsApp } from '../components/Icons.jsx'
import { OpenStatus } from '../components/OpenStatus.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { restaurant } from '../config/restaurant.js'
import { useCart } from '../context/CartContext.jsx'
import { categories, featuredItems } from '../data/menu.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { formatPrice, phoneLink, whatsappLink } from '../lib/format.js'

const instagram = restaurant.social.find((s) => s.id === 'instagram')

// Captions are the restaurant's own words from their Instagram posts.
const gallery = [
  { src: '/images/mozzarella-sticks.webp', w: 739, h: 922, alt: 'Mozzarella sticks in a red Jungs box', caption: 'Not everything can fix your day. Mozzarella sticks might.' },
  { src: '/images/goat-cheese-salad.webp', w: 450, h: 380, alt: 'Goat cheese salad with strawberries, walnuts and dried cranberries', caption: 'Goat Cheese Salad' },
  { src: '/images/grilled-chicken-burger.webp', w: 560, h: 355, alt: 'Grilled chicken burger cut in half showing melted cheese', caption: 'Grilled Chicken Burger, with a special twist' },
  { src: '/images/jungs-combo.webp', w: 739, h: 378, alt: 'Jungs combo: sub, burger, fries, tenders and a soft drink', caption: 'Any burger or sub + fries + 2 tenders + soft drink' },
]

export default function Home() {
  usePageMeta(null, `${restaurant.name} in ${restaurant.address.locality}: smashed burgers, beef subs, chicken sandwiches and salads. Order for pickup or delivery, open ${restaurant.hours.short}.`)
  const { openItem } = useCart()
  const menuCategories = categories.filter((c) => c.id !== 'offers')

  return (
    <>
      <section className="hero">
        <div className="hero__inner container">
          <div className="hero__copy">
            <OpenStatus className="hero__status" />
            <h1 className="hero__title">
              <span className="hero__name">{restaurant.name}</span>
              <span className="hero__line">
                Feast with <em>the guys.</em>
              </span>
            </h1>
            <p className="hero__lede">
              Smashed burgers, loaded subs, crispy chicken and big salads in {restaurant.address.locality}. {restaurant.bio}.
            </p>
            <div className="hero__ctas">
              <Link to="/menu" className="btn btn--primary btn--lg">
                Order now <IconArrowRight size={18} />
              </Link>
              <Link to="/menu" className="btn btn--ghost btn--lg">
                See the menu
              </Link>
            </div>
            <ul className="hero__services" aria-label="Ways to order">
              <li>Dine in</li>
              <li>Pickup</li>
              <li>Delivery</li>
            </ul>
          </div>

          <figure className="hero__media">
            <img
              src="/images/smashed-burger.webp"
              width="680"
              height="630"
              alt="Double smashed burger with melted cheese on a potato bun"
              fetchpriority="high"
              decoding="async"
            />
            <figcaption className="hero__tag">
              <span>Melted &amp;</span> <span>smashed</span>
            </figcaption>
          </figure>
        </div>
        <Checker tone="teal" />
      </section>

      <section className="deals" aria-labelledby="deals-title">
        <div className="container">
          <Reveal className="section-head section-head--light">
            <p className="eyebrow">More for less</p>
            <h2 id="deals-title" className="section-title">Meals &amp; offers</h2>
          </Reveal>
          <div className="deals__grid">
            {featuredItems.map((item, i) => (
              <Reveal key={item.id} className={`deal deal--${i}`} delay={i * 70}>
                <div className="deal__top">
                  <h3 className="deal__name">{item.name}</h3>
                  {item.portion && <span className="deal__portion">{item.portion}</span>}
                </div>
                <p className="deal__desc">{item.description}</p>
                <div className="deal__foot">
                  <span className="deal__price">{formatPrice(item.price)}</span>
                  <button type="button" className="btn btn--light" onClick={() => openItem(item.id)}>
                    Add <span className="visually-hidden">{item.name}</span>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="menu-index" aria-labelledby="menu-index-title">
        <div className="container menu-index__inner">
          <Reveal className="section-head">
            <p className="eyebrow">The menu</p>
            <h2 id="menu-index-title" className="section-title">What are you having?</h2>
            <p className="section-sub">Everything on the board, with prices. Tap a section to jump in.</p>
            <Link to="/menu" className="btn btn--ghost">
              Full menu <IconArrowRight size={18} />
            </Link>
          </Reveal>
          <ol className="menu-index__list">
            {menuCategories.map((c) => {
              const from = Math.min(...c.items.map((i) => i.price))
              return (
                <li key={c.id}>
                  <Link to={`/menu#${c.id}`} className={`menu-index__row tone-text-${c.tone}`}>
                    <span className="menu-index__name">{c.name}</span>
                    <span className="menu-index__meta">
                      {c.items.length} {c.items.length === 1 ? 'item' : 'items'} · from {formatPrice(from)}
                    </span>
                    <IconArrowRight size={20} className="menu-index__arrow" />
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="visit" aria-labelledby="visit-title">
        <div className="container">
          <Reveal className="visit__inner">
            <h2 id="visit-title" className="visit__title">
              Come by, or we&rsquo;ll bring it to you.
            </h2>
            <ul className="visit__facts">
              <li>
                <IconClock size={22} />
                <span>
                  <strong>Hours</strong>
                  {restaurant.hours.label}
                </span>
              </li>
              <li>
                <IconPin size={22} />
                <span>
                  <strong>Location</strong>
                  <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {restaurant.address.display}
                  </a>
                </span>
              </li>
              <li>
                <IconScooter size={22} />
                <span>
                  <strong>Service</strong>
                  Dine in, pickup &amp; delivery
                </span>
              </li>
              <li>
                <IconPhone size={22} />
                <span>
                  <strong>Call</strong>
                  <a href={phoneLink}>{restaurant.phone.display}</a>
                </span>
              </li>
            </ul>
            <a href={whatsappLink('Hi Jungs, I would like to place an order.')} className="btn btn--wa" target="_blank" rel="noopener noreferrer">
              <IconWhatsApp size={20} /> Order on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>

      <section className="gallery" aria-labelledby="gallery-title">
        <div className="container">
          <Reveal className="gallery__head">
            <h2 id="gallery-title" className="section-title">From the kitchen</h2>
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="gallery__ig">
              <IconInstagram size={18} /> {instagram.handle}
            </a>
          </Reveal>
          <div className="gallery__grid">
            {gallery.map((g, i) => (
              <Reveal as="figure" key={g.src} className={`gallery__item gallery__item--${i}`} delay={i * 60}>
                <img src={g.src} width={g.w} height={g.h} alt={g.alt} loading="lazy" decoding="async" />
                <figcaption>{g.caption}</figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
