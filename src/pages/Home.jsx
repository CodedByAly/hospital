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
import SectionTitle from '../components/SectionTitle.jsx';
import Ticker from '../components/Ticker.jsx';
import HeroPicks from '../components/HeroPicks.jsx';
import OfferRail from '../components/OfferRail.jsx';
import './Home.css';

const featured = featuredItemIds.map(getItem).filter(Boolean);
const heroPicks = featured.filter((item) => item.image).slice(0, 5);

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
    const onScroll = () => hero.style.setProperty('--sy', Math.min(window.scrollY, 800).toFixed(0));
    window.addEventListener('scroll', onScroll, { passive: true });
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
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
              Burgers, Zingers, wings and farooj al fahem. Pick it up or get it delivered.
            </p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn--primary btn--lg">
                Order now <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/menu" className="btn btn--outline btn--lg">
                Menu
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
            <HeroPicks items={heroPicks} />
          </div>
        </div>
      </section>

      <Ticker words={tickerWords} />

      <section className="section categories" aria-labelledby="categories-title">
        <div className="container">
          <div className="section-head">
            <SectionTitle id="categories-title">The menu</SectionTitle>
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
              <SectionTitle id="featured-title">Quick picks</SectionTitle>
            </div>
            <Link to="/menu" className="link-arrow hide-sm">
              Full menu <Icon name="arrowRight" size={16} />
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
                <SectionTitle id="offers-title">Offers</SectionTitle>
              </div>
              <a href={site.social.instagram.url} className="link-arrow link-arrow--light" target="_blank" rel="noopener noreferrer">
                <InstagramIcon size={18} /> @{site.social.instagram.handle}
              </a>
            </div>
          </div>
          <OfferRail className="offers__rail" label="Offers">
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
          </OfferRail>
          <div className="container">
            <p className="offers__note">
              To order an offer,{' '}
              <a href={whatsappHref(site.whatsapp, 'Hi Zaher’s, I’d like to order an offer.')} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{' '}
              or call your branch.
            </p>
          </div>
        </section>
      )}

      <section className="section branches-band" aria-labelledby="branches-title">
        <div className="container">
          <div className="section-head">
            <div>
              <SectionTitle id="branches-title">Our branches</SectionTitle>
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
            New items and offers go up on Instagram first.
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
