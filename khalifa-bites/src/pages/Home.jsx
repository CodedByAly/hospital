import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { itemsById, itemsByCategory, menuLineCount } from '../data/menu';
import restaurant from '../config/restaurant';
import { formatPrice } from '../lib/format';
import { whatsappLink } from '../lib/links';
import { flyToCart } from '../lib/flyToCart';
import FoodImage, { menuSrc } from '../components/FoodImage';
import Reveal from '../components/Reveal';
import Hours from '../components/Hours';
import Icon from '../components/Icon';
import InstagramGrid from '../components/InstagramGrid';

export default function Home() {
  useDocumentMeta(
    'Khalifa Bites | Burgers, Subs & Shawarma in Saida',
    'Khalifa Bites in Saida: charcoal-grilled burgers, crispy chicken, subs, hot dogs and shawarma. Order for pickup or delivery on 76 086 068.',
  );
  return (
    <>
      <Hero />
      <Sections />
      <HouseBurgers />
      <Shawarma />
      <Instagram />
      <Visit />
    </>
  );
}

function Hero() {
  const { openItem } = useUI();
  const stageRef = useRef(null);

  // A few pixels of parallax on desktop pointers — enough to feel alive, not enough to notice.
  const onMove = (e) => {
    const el = stageRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  return (
    <section className="hero" aria-labelledby="hero-title" onPointerMove={onMove}>
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow hero__in" style={{ '--d': 0 }}>
            <span className="hero__flag" aria-hidden="true" />
            {restaurant.tagline}
          </p>
          <h1 id="hero-title" className="hero__title hero__in" style={{ '--d': 1 }}>
            Locked, loaded and ready to be devoured.
          </h1>
          <p className="hero__lead hero__in" style={{ '--d': 2 }}>
            Charcoal-grilled burgers, crispy chicken, loaded subs and shawarma by the kilo — in Saida. Pick it up or we’ll bring it to you.
          </p>
          <div className="hero__ctas hero__in" style={{ '--d': 3 }}>
            <Link to="/menu" className="btn btn--white btn--lg">
              Order now
              <Icon name="arrow" size={20} />
            </Link>
            <a href={whatsappLink()} className="btn btn--ghost-light btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} />
              {restaurant.phone.display}
            </a>
          </div>
          <dl className="hero__facts hero__in" style={{ '--d': 4 }}>
            <div>
              <dt>On the menu</dt>
              <dd>{menuLineCount} items</dd>
            </div>
            <div>
              <dt>Order</dt>
              <dd>Pickup or delivery</dd>
            </div>
            <div>
              <dt>Find us</dt>
              <dd>Saida</dd>
            </div>
          </dl>
        </div>

        <div className="hero__stage" ref={stageRef}>
          <span className="hero__disc" aria-hidden="true" />
          <button type="button" className="hero__food hero__food--side" onClick={() => openItem('french-fries')} aria-label="French Fries">
            <FoodImage name="french-fries" alt="" eager />
          </button>
          <button type="button" className="hero__food hero__food--main" onClick={() => openItem('khalifa-tower')} aria-label="Khalifa Tower">
            <FoodImage name="khalifa-tower" alt="Khalifa Tower burger" eager />
          </button>
          <button type="button" className="hero__food hero__food--front" onClick={() => openItem('chicken-shawarma', { variant: 'large' })} aria-label="Chicken Shawarma">
            <FoodImage name="chicken-shawarma-large" alt="" eager />
          </button>
          <button type="button" className="hero__tag" onClick={() => openItem('khalifa-tower')}>
            <span>Khalifa Tower</span>
            <strong>{formatPrice(itemsById['khalifa-tower'].price)}</strong>
          </button>
        </div>
      </div>
    </section>
  );
}

function Sections() {
  const sections = itemsByCategory.filter((c) => c.image);
  return (
    <section className="section sections" aria-labelledby="sections-title">
      <div className="container">
        <Reveal className="section-head">
          <h2 id="sections-title" className="section-title">The menu, section by section</h2>
          <Link to="/menu" className="text-link">
            Full menu <Icon name="arrow" size={18} />
          </Link>
        </Reveal>
        <ul className="sections__grid">
          {sections.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 5) * 50}>
              <Link to={`/menu#${c.id}`} className="section-tile">
                <span className="section-tile__img">
                  <FoodImage name={c.image} alt="" />
                </span>
                <span className="section-tile__name">{c.name}</span>
                <span className="section-tile__count">{c.items.length} {c.items.length === 1 ? 'item' : 'items'}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HouseBurgers() {
  return (
    <section className="section house" aria-labelledby="house-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Charcoal-grilled</p>
            <h2 id="house-title" className="section-title">The two with our name on them</h2>
          </div>
        </Reveal>
        <div className="house__grid">
          {['khalifa-burger', 'khalifa-tower'].map((id, i) => (
            <Reveal key={id} delay={i * 90}>
              <FeatureCard item={itemsById[id]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ item }) {
  const { openItem } = useUI();
  const { add } = useCart();
  const mediaRef = useRef(null);
  const quickAdd = () => {
    add({ itemId: item.id, qty: 1 });
    flyToCart(mediaRef.current.querySelector('img')?.getBoundingClientRect(), menuSrc(item.image));
  };
  return (
    <article className="feature">
      <button type="button" className="feature__media" ref={mediaRef} onClick={() => openItem(item.id)} aria-label={`${item.name} details`}>
        <FoodImage name={item.image} alt={item.name} />
      </button>
      <div className="feature__body">
        <h3 className="label-title">{item.name}</h3>
        <p className="feature__desc">{item.description}</p>
        <div className="feature__buy">
          <span className="price-tag price-tag--lg">{formatPrice(item.price)}</span>
          <button type="button" className="btn btn--primary" onClick={quickAdd}>
            <Icon name="plus" size={18} /> Add to cart
          </button>
          <button type="button" className="link-btn" onClick={() => openItem(item.id)}>
            Customise
          </button>
        </div>
      </div>
    </article>
  );
}

function Shawarma() {
  const { openItem } = useUI();
  const rows = [
    { item: 'chicken-shawarma', title: 'Chicken' },
    { item: 'beef-shawarma', title: 'Beef' },
  ];
  const kilo = itemsById['shawarma-1kg'];
  const mix = itemsById['mix-markook-shawarma'];
  return (
    <section className="shawarma" aria-labelledby="shawarma-title">
      <div className="container shawarma__grid">
        <Reveal className="shawarma__copy">
          <p className="eyebrow eyebrow--light">Shawarma</p>
          <h2 id="shawarma-title" className="section-title section-title--light">By the sandwich, or by the kilo.</h2>
          <p className="shawarma__lead">Arabic bread or markook, chicken with garlic sauce or beef with tahini — and boxes for the whole table.</p>

          <table className="shawarma__table">
            <caption className="sr-only">Shawarma prices</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Type</span></th>
                <th scope="col">Small</th>
                <th scope="col">Large</th>
                <th scope="col">Markook</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const item = itemsById[r.item];
                return (
                  <tr key={r.item}>
                    <th scope="row">{r.title}</th>
                    {item.variants.map((v) => (
                      <td key={v.id}>
                        <button type="button" onClick={() => openItem(item.id, { variant: v.id })} aria-label={`${r.title} ${v.label}, ${formatPrice(v.price)}`}>
                          {formatPrice(v.price)}
                        </button>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <ul className="shawarma__boxes">
            {kilo.variants.map((v) => (
              <li key={v.id}>
                <button type="button" onClick={() => openItem(kilo.id, { variant: v.id })}>
                  <span>1 KG {v.label}</span>
                  <strong>{formatPrice(v.price)}</strong>
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => openItem(mix.id)}>
                <span>{mix.name}</span>
                <strong>{formatPrice(mix.price)}</strong>
              </button>
            </li>
          </ul>
        </Reveal>
        <Reveal className="shawarma__media" delay={100}>
          <FoodImage name="shawarma-1kg-beef" alt="1 KG beef shawarma box" className="shawarma__box" />
          <FoodImage name="beef-shawarma-markook" alt="" className="shawarma__roll" />
        </Reveal>
      </div>
    </section>
  );
}

function Instagram() {
  return (
    <section className="section insta" aria-labelledby="insta-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">On Instagram</p>
            <h2 id="insta-title" className="section-title">@khalifa.bites</h2>
          </div>
          <a href={restaurant.social.instagram} className="text-link" target="_blank" rel="noopener noreferrer">
            Follow us <Icon name="arrow" size={18} />
          </a>
        </Reveal>
        <InstagramGrid />
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <Reveal>
          <p className="eyebrow eyebrow--light">Fast delivery</p>
          <h2 id="visit-title" className="section-title section-title--light">On the road to you.</h2>
          <p className="visit__lead">Order on the site or on WhatsApp — pick it up in Saida or have it delivered.</p>
          <div className="visit__ctas">
            <a href={whatsappLink()} className="btn btn--white btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} /> Order on WhatsApp
            </a>
            <Link to="/contact#feedback" className="btn btn--ghost-light btn--lg">
              Leave feedback
            </Link>
          </div>
        </Reveal>
        <Reveal className="visit__list" delay={80}>
          <a className="visit__line" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" />
            <span>
              <strong>{restaurant.address.full}</strong>
              <small>Open in Google Maps</small>
            </span>
          </a>
          <a className="visit__line" href={`tel:${restaurant.phone.international}`}>
            <Icon name="phone" />
            <span>
              <strong>{restaurant.phone.display}</strong>
              <small>Call to order</small>
            </span>
          </a>
          <div className="visit__line">
            <Icon name="clock" />
            <span>
              <strong>Opening hours</strong>
              <Hours className="visit__hours" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
