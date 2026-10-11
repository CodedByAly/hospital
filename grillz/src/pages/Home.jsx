import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { activeOffers, itemsByCategory } from '../data/menu';
import restaurant from '../config/restaurant';
import { formatPrice } from '../lib/format';
import { whatsappLink } from '../lib/links';
import { openStatus } from '../lib/openNow';
import { flyToCart } from '../lib/flyToCart';
import { asset } from '../lib/asset';
import BurgerStack from '../components/BurgerStack';
import ItemName from '../components/ItemName';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

export default function Home() {
  useDocumentMeta(
    'Grillz | Burger. Done right.',
    'Grillz: Angus beef and crispy chicken burgers, wraps and quesadillas near Beirut Arab University. Open daily 12 PM – 1 AM. Delivery on 79 022 617.',
  );
  return (
    <>
      <Hero />
      <Offers />
      <Board />
      <Visit />
    </>
  );
}

function Hero() {
  const status = openStatus();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          {status && (
            <p className={`status hero__in ${status.open ? 'is-open' : ''}`} style={{ '--d': 0 }}>
              <span className="status__dot" aria-hidden="true" />
              {status.text}
            </p>
          )}
          <h1 id="hero-title" className="hero__title hero__in" style={{ '--d': 1 }}>
            Burger.<br />
            <span className="accent">Done right.</span>
          </h1>
          <p className="hero__lead hero__in" style={{ '--d': 2 }}>
            130g Angus beef and crispy chicken off the grill, wraps, quesadillas and loaded fries — near Beirut Arab University, every day until 1 AM.
          </p>
          <div className="hero__ctas hero__in" style={{ '--d': 3 }}>
            <Link to="/menu" className="btn btn--primary btn--lg">
              Order now <Icon name="arrow" size={20} />
            </Link>
            <a href={whatsappLink()} className="btn btn--ghost btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} /> {restaurant.phone.display}
            </a>
          </div>
          <ul className="hero__facts hero__in" style={{ '--d': 4 }}>
            <li><strong>Pickup</strong> or <strong>delivery</strong></li>
            <li><strong>100%</strong> Angus beef</li>
          </ul>
        </div>
        <div className="hero__stage">
          <BurgerStack />
          <p className="hero__hint" aria-hidden="true">Scroll — it comes apart</p>
        </div>
      </div>
    </section>
  );
}

function Offers() {
  const offers = activeOffers();
  if (!offers.length) return null;
  return (
    <section className="section offers" aria-labelledby="offers-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Offers</p>
            <h2 id="offers-title" className="section-title">On the grill right now</h2>
          </div>
        </Reveal>
        <div className="offers__list">
          {offers.map((o, i) => (
            <Reveal key={o.id} delay={i * 90}>
              <OfferCard offer={o} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer }) {
  const { add } = useCart();
  const imgRef = useRef(null);
  const src = asset(`images/offers/${offer.image}.webp`);
  const order = () => {
    add({ itemId: offer.id, qty: 1 });
    flyToCart(imgRef.current?.getBoundingClientRect(), src);
  };
  return (
    <article className="offer">
      <div className="offer__media">
        <img ref={imgRef} src={src} alt={`${offer.name}: ${offer.includes.join(', ')}`} loading="lazy" decoding="async" />
      </div>
      <div className="offer__body">
        <p className="offer__kicker" lang="ar">{offer.headline}</p>
        <h3 className="offer__name">{offer.name}</h3>
        <ul className="offer__includes">
          {offer.includes.map((x, i) => (
            <li key={x}>
              {i > 0 && <span className="plus" aria-hidden="true">+</span>}
              {x}
            </li>
          ))}
        </ul>
        {offer.caption && <p className="offer__caption">{offer.caption}</p>}
        <div className="offer__buy">
          <span className="offer__price">{formatPrice(offer.price, offer.currency)}</span>
          <button type="button" className="btn btn--primary" onClick={order}>
            <Icon name="plus" size={18} /> Add to order
          </button>
        </div>
      </div>
    </article>
  );
}

function Board() {
  const { openItem } = useUI();
  return (
    <section className="section board" aria-labelledby="board-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">The menu board</p>
            <h2 id="board-title" className="section-title">Pick your burger</h2>
          </div>
          <Link to="/menu" className="text-link">Full menu <Icon name="arrow" size={18} /></Link>
        </Reveal>
        <div className="board__grid">
          {itemsByCategory
            .filter((c) => ['beef-burgers', 'chicken-burgers', 'wraps-quesadilla'].includes(c.id))
            .map((c, i) => (
              <Reveal key={c.id} className="board__col" delay={i * 80}>
                <h3 className="tape">{c.name}</h3>
                {c.note && <p className="board__note">{c.note}</p>}
                <ul>
                  {c.items.map((item) => (
                    <li key={item.id}>
                      <button type="button" className="board__row" onClick={() => openItem(item.id)}>
                        <span className="board__name"><ItemName item={item} /></span>
                        <span className="board__dots" aria-hidden="true" />
                        <span className="board__price">{formatPrice(item.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <Reveal>
          <p className="eyebrow">Delivery & pickup</p>
          <h2 id="visit-title" className="section-title">Hungry at midnight? We’re still grilling.</h2>
          <p className="visit__lead">Open every day from 12 PM to 1 AM. Order here or on WhatsApp — pick it up or we deliver.</p>
          <div className="visit__ctas">
            <a href={whatsappLink()} className="btn btn--primary btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} /> Order on WhatsApp
            </a>
            <a href={restaurant.mapsUrl} className="btn btn--ghost btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={20} /> Get directions
            </a>
          </div>
        </Reveal>
        <Reveal delay={80} className="visit__photo">
          <img src={asset('images/offers/tiny-chefs.webp')} alt="Tiny chef figures building a Grillz crispy chicken burger" loading="lazy" decoding="async" />
        </Reveal>
      </div>
    </section>
  );
}
