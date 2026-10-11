import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { branches, featuredItemIds, site } from '../config/site.js';
import { itemsByCategory, getItem } from '../data/menu.js';
import { formatPhone, formatPrice, mapsHref, telHref, whatsappHref } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { prefersReducedMotion } from '../lib/motion.js';
import HoursList from '../components/HoursList.jsx';
import Icon, { InstagramIcon, WhatsAppIcon } from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import OpenStatus from '../components/OpenStatus.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import Ticker from '../components/Ticker.jsx';
import HeroPicks from '../components/HeroPicks.jsx';
import './Home.css';

const branch = branches[0];
const featured = featuredItemIds.map(getItem).filter(Boolean);
const heroPicks = featured.filter((item) => item.image).slice(0, 5);

const categoryTiles = itemsByCategory.map((category) => ({
  ...category,
  image: category.items.find((item) => item.image)?.image ?? null,
  from: Math.min(...category.items.filter((i) => i.price != null).map((i) => i.price)),
}));

const tickerWords = [...itemsByCategory.map((c) => c.name), 'Stivo Swiss', 'Farouj fa7m', 'Dine-in', 'Delivery', 'Takeaway'];

const gallery = [
  { src: '/images/gallery/burger-wrapped.webp', alt: 'Cheeseburger wrapped in Burger Bar paper' },
  { src: '/images/gallery/fried-chicken.webp', alt: 'Fried chicken pieces with dipping sauces' },
  { src: '/images/menu/stivo-swiss.webp', alt: 'Stivo Swiss sandwich with melted cheese' },
  { src: '/images/gallery/swiss-mushroom-dark.webp', alt: 'Swiss and mushroom burger' },
  { src: '/images/menu/tawook-plate.webp', alt: 'Tawook plate with fries, coleslaw and pickles' },
];

export default function Home() {
  useDocumentMeta(null);
  const heroRef = useRef(null);

  // Pointer parallax and a slight scroll drift on the hero photo.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return undefined;
    let frame = 0;
    const onScroll = () => hero.style.setProperty('--sy', Math.min(window.scrollY, 800).toFixed(0));
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
    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.matchMedia('(pointer: fine)').matches) {
      hero.addEventListener('pointermove', onMove);
      hero.addEventListener('pointerleave', onLeave);
    }
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
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <div className="hero__eyebrow">
              <OpenStatus />
              <span className="hero__place">Al-Manara · West Bekaa</span>
            </div>
            <h1 className="hero__title">
              <span className="hero__line"><span>Burgers,</span></span>{' '}
              <span className="hero__line"><span>Stivo &amp;</span></span>{' '}
              <span className="hero__line hero__title-accent"><span>farouj fa7m.</span></span>
            </h1>
            <p className="hero__lede">Dine in, take away or get it delivered. Order here and pay cash or by Whish.</p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn--primary btn--lg">
                Order now <Icon name="arrowRight" size={18} />
              </Link>
              <a href={telHref(branch.phone)} className="btn btn--outline btn--lg">
                <Icon name="phone" size={18} /> {formatPhone(branch.phone)}
              </a>
            </div>
            <ul className="hero__modes" aria-label="Ways to order">
              <li>
                <Icon name="store" size={18} /> Dine-in
              </li>
              <li>
                <Icon name="scooter" size={18} /> Delivery
              </li>
              <li>
                <Icon name="bag" size={18} /> Takeaway
              </li>
            </ul>
          </div>

          <div className="hero__visual">
            <div className="hero__photo">
              <img src="/images/gallery/hero-classic.webp" alt="Classic burger with cheddar, lettuce, tomato and pickles" width="739" height="785" fetchPriority="high" />
            </div>
            <div className="hero__badge" aria-hidden="true">
              <Logo className="hero__badge-logo" title="" />
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
              <Reveal as="li" key={category.id} delay={i * 50}>
                <Link to={`/menu#${category.id}`} className={`cat-tile ${category.image ? '' : 'cat-tile--plain'}`}>
                  {category.image && <img src={category.image} alt="" width="480" height="480" loading="lazy" decoding="async" />}
                  <span className="cat-tile__count">{String(category.items.length).padStart(2, '0')}</span>
                  <span className="cat-tile__name">{category.name}</span>
                  <span className="cat-tile__meta">from {formatPrice(category.from)}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tight featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="section-head">
            <SectionTitle id="featured-title">Quick picks</SectionTitle>
            <Link to="/menu" className="link-arrow hide-sm">
              Full menu <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="featured__grid">
            {featured.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60}>
                <MenuItemCard item={item} layout="tile" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section gallery" aria-labelledby="gallery-title">
        <div className="container">
          <div className="section-head">
            <SectionTitle id="gallery-title">From Instagram</SectionTitle>
            <a href={site.social.instagram.url} className="link-arrow" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={18} /> @{site.social.instagram.handle}
            </a>
          </div>
          <div className="gallery__grid">
            {gallery.map((photo, i) => (
              <Reveal key={photo.src} className={`gallery__item gallery__item--${i + 1}`} delay={i * 70}>
                <a href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`${photo.alt}, on Instagram`}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section visit" aria-labelledby="visit-title">
        <div className="container visit__grid">
          <div>
            <SectionTitle id="visit-title">Visit us</SectionTitle>
            <p className="visit__address">{branch.address}</p>
            <OpenStatus className="visit__status" />
            <div className="visit__actions">
              <a className="btn btn--primary" href={mapsHref(branch)} target="_blank" rel="noopener noreferrer">
                <Icon name="pin" size={18} /> Directions
              </a>
              <a className="btn btn--outline" href={telHref(branch.phone)}>
                <Icon name="phone" size={18} /> Call
              </a>
              <a className="btn btn--outline" href={whatsappHref(branch.whatsapp)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
            </div>
          </div>
          <Reveal className="visit__hours">
            <h3>Opening hours</h3>
            <HoursList />
          </Reveal>
        </div>
      </section>

      <section className="follow" aria-labelledby="follow-title">
        <div className="container follow__inner">
          <h2 id="follow-title" className="follow__title">
            New items go up on Instagram first.
          </h2>
          <div className="follow__actions">
            <a href={site.social.instagram.url} className="btn btn--dark btn--lg" target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={20} /> Follow @{site.social.instagram.handle}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
