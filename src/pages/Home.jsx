import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { branches, featuredItemIds, site } from '../config/site.js';
import { itemsByCategory, getItem } from '../data/menu.js';
import { activeOffers } from '../data/offers.js';
import { formatPrice, whatsappHref } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { prefersReducedMotion } from '../lib/motion.js';
import BranchCard from '../components/BranchCard.jsx';
import Icon, { InstagramIcon, WhatsAppIcon } from '../components/Icon.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import Reveal from '../components/Reveal.jsx';
import './Home.css';

const featured = featuredItemIds.map(getItem).filter(Boolean);

// Category tiles use a photo from inside the category, when there is one.
const categoryTiles = itemsByCategory.map((category) => ({
  ...category,
  image: category.items.find((item) => item.image)?.image ?? null,
  from: Math.min(...category.items.map((item) => item.price)),
}));

const tickerWords = [...itemsByCategory.map((c) => c.name), 'Farooj al fahem', `Since ${site.since}`, site.tagline];

export default function Home() {
  useDocumentMeta(null);
  const heroRef = useRef(null);

  // Gentle pointer parallax on the hero photo (mouse/trackpad only).
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    const onMove = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--px', ((event.clientX - r.left) / r.width - 0.5).toFixed(3));
        hero.style.setProperty('--py', ((event.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    };
    const onLeave = () => {
      hero.style.setProperty('--px', 0);
      hero.style.setProperty('--py', 0);
    };
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="hero__eyebrow">
              <span>Since {site.since}</span>
              <span aria-hidden="true">/</span>
              <span>Tyre · Hamra · Batroun</span>
            </p>
            <h1 className="hero__title">
              <span className="hero__line"><span>Burgers,</span></span>{' '}
              <span className="hero__line"><span>crispy chicken</span></span>{' '}
              <span className="hero__line hero__title-accent"><span>&amp; charcoal grills.</span></span>
            </h1>
            <p className="hero__lede">
              Stacked beef burgers, Zinger sandwiches, wings and farooj al fahem from Zaher’s. Order ahead and pick it up,
              or have it delivered from your nearest branch.
            </p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn--primary btn--lg">
                Start your order <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/menu" className="btn btn--outline btn--lg">
                See the menu
              </Link>
            </div>
            <ul className="hero__modes" aria-label="Ways to order">
              <li>
                <Icon name="store" size={18} /> Pickup
              </li>
              <li>
                <Icon name="scooter" size={18} /> Delivery
              </li>
              <li>
                <Icon name="cash" size={18} /> Cash or Whish
              </li>
            </ul>
          </div>

          <div className="hero__visual">
            <div className="hero__photo">
              <img
                src="/images/hero-honey.webp"
                alt="Crispy chicken burger with pickles and coleslaw, honey-glazed chicken strips and wings"
                width="739"
                height="506"
                fetchPriority="high"
              />
            </div>
            <div className="hero__sticker" aria-hidden="true">
              <span>Delivering</span>
              <span>Happiness</span>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <span key={copy} className="ticker__group">
              {tickerWords.map((word) => (
                <span key={word} className="ticker__word">
                  {word}
                  <svg viewBox="0 0 24 24" width="18" height="18"><path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" fill="currentColor" /></svg>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="section categories" aria-labelledby="categories-title">
        <div className="container">
          <div className="section-head">
            <h2 id="categories-title" className="section-title">What’s cooking</h2>
            <Link to="/menu" className="link-arrow">
              Full menu <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <ul className="categories__rail">
            {categoryTiles.map((category, i) => (
              <Reveal as="li" key={category.id} delay={i * 40}>
                <Link to={`/menu#${category.id}`} className={`cat-tile ${category.image ? '' : 'cat-tile--plain'}`}>
                  {category.image && <img src={category.image} alt="" width="224" height="224" loading="lazy" decoding="async" />}
                  <span className="cat-tile__name">{category.name}</span>
                  <span className="cat-tile__meta">
                    {category.items.length} items · from {formatPrice(category.from)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tight featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Straight from the menu</p>
              <h2 id="featured-title" className="section-title">Order in two taps</h2>
            </div>
            <Link to="/menu" className="link-arrow hide-sm">
              Everything else <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="featured__grid">
            {featured.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 50}>
                <MenuItemCard item={item} layout="tile" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {activeOffers.length > 0 && (
        <section className="section offers" aria-labelledby="offers-title">
          <div className="container">
            <div className="section-head section-head--light">
              <div>
                <p className="eyebrow eyebrow--light">From our Instagram</p>
                <h2 id="offers-title" className="section-title">Offers running now</h2>
              </div>
              <a href={site.social.instagram.url} className="link-arrow link-arrow--light" target="_blank" rel="noopener noreferrer">
                <InstagramIcon size={18} /> @{site.social.instagram.handle}
              </a>
            </div>
          </div>
          <ul className="offers__rail" aria-label="Offers">
            {activeOffers.map((offer) => (
              <li key={offer.id} className="offer">
                <img src={offer.image} alt={offer.imageAlt} loading="lazy" decoding="async" />
                <div className="offer__body">
                  <h3 className="offer__title">
                    {offer.title}
                    {offer.price != null && <span className="offer__price">{formatPrice(offer.price)}</span>}
                  </h3>
                  <p>{offer.details}</p>
                  <p className="offer__terms">{offer.terms}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="container">
            <p className="offers__note">
              Offers can change. Message us on{' '}
              <a href={whatsappHref(site.whatsapp, 'Hi Zaher’s, is this offer still available?')} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{' '}
              or call your branch to order one.
            </p>
          </div>
        </section>
      )}

      <section className="section how" aria-labelledby="how-title">
        <div className="container how__grid">
          <div>
            <p className="eyebrow">Ordering online</p>
            <h2 id="how-title" className="section-title">Your order, your way</h2>
            <p className="how__lede">
              Build your order here, tell us what to leave out, and choose how you want it. Your branch confirms
              every order before it goes on the grill.
            </p>
          </div>
          <ol className="how__steps">
            <Reveal as="li">
              <span className="how__num">01</span>
              <h3>Pick your food</h3>
              <p>Every item on the menu, with no pickles, no onions or whatever suits you.</p>
            </Reveal>
            <Reveal as="li" delay={60}>
              <span className="how__num">02</span>
              <h3>Pickup or delivery</h3>
              <p>Choose your branch, then collect it yourself or give us your address.</p>
            </Reveal>
            <Reveal as="li" delay={120}>
              <span className="how__num">03</span>
              <h3>Pay how you like</h3>
              <p>Cash when it reaches you or when you pick it up, or transfer with Whish Money.</p>
            </Reveal>
          </ol>
        </div>
      </section>

      <section className="section branches-band" aria-labelledby="branches-title">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Find us</p>
              <h2 id="branches-title" className="section-title">Three branches</h2>
            </div>
            <Link to="/contact" className="link-arrow hide-sm">
              Contact <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="branches-grid">
            {branches.map((branch, i) => (
              <Reveal key={branch.id} delay={i * 60}>
                <BranchCard branch={branch} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="follow" aria-labelledby="follow-title">
        <div className="container follow__inner">
          <h2 id="follow-title" className="follow__title">
            New items and weekly offers land on Instagram first.
          </h2>
          <div className="follow__actions">
            <a href={site.social.instagram.url} className="btn btn--light btn--lg" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={20} /> Follow @{site.social.instagram.handle}
            </a>
            <a href={whatsappHref(site.whatsapp)} className="btn btn--on-orange btn--lg" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
