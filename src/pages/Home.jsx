import { Link } from 'react-router-dom';
import { restaurant } from '../config/restaurant';
import { itemsByCategory, itemsById } from '../data/menu';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { localized } from '../lib/format';
import MenuCard, { PromoCard } from '../components/MenuCard';
import Reveal from '../components/Reveal';
import ContactList from '../components/ContactList';
import SocialLinks from '../components/SocialLinks';
import OpeningHours from '../components/OpeningHours';
import Icon from '../components/Icon';
import HeroShowcase from '../components/HeroShowcase';
import Steam from '../components/Steam';

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--light">
            <Icon name="pin" size={16} />
            {t.home.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">O'snack — </span>
            <span className="hero__tagline" lang="en" dir="ltr">
              Taste That <em>Talks!</em>
            </span>
          </h1>
          <p className="hero__lead">{t.home.lead}</p>
          <div className="hero__actions">
            <Link to="/menu" className="btn btn--primary btn--lg">
              {t.home.ctaOrder}
              <Icon name="arrow" size={18} className="flip-rtl" />
            </Link>
            <a href={`tel:${restaurant.phone.tel}`} className="btn btn--ghost-light btn--lg">
              <Icon name="phone" size={18} />
              <span dir="ltr">{restaurant.phone.display}</span>
            </a>
          </div>
          <ul className="hero__services">
            {t.home.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <HeroShowcase />
      </div>
    </section>
  );
}

function Offers() {
  const { t } = useLanguage();
  const offers = itemsByCategory.find((c) => c.id === 'offers').items;
  const boxes = offers.filter((i) => !i.promo);
  const promos = offers.filter((i) => i.promo);

  return (
    <section className="section" aria-labelledby="offers-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <h2 id="offers-title" className="section-title">{t.home.boxesTitle}</h2>
            <p className="section-text">{t.home.boxesText}</p>
          </div>
          <Link to="/menu#offers" className="link-arrow">
            {t.home.boxesLink}
            <Icon name="arrow" size={18} className="flip-rtl" />
          </Link>
        </Reveal>

        <div className="box-grid">
          {boxes.map((item, i) => (
            <Reveal key={item.id} delay={i * 70}>
              <MenuCard item={item} layout="feature" />
            </Reveal>
          ))}
        </div>
        <div className="promo-row">
          {promos.map((item, i) => (
            <Reveal key={item.id} delay={i * 70}>
              <PromoCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const { t, lang } = useLanguage();
  const sections = itemsByCategory.filter((c) => c.id !== 'offers');
  return (
    <section className="section section--paper" aria-labelledby="cats-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <h2 id="cats-title" className="section-title">{t.home.menuTitle}</h2>
            <p className="section-text">{t.home.menuText}</p>
          </div>
        </Reveal>
        <ul className="cat-grid">
          {sections.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 60}>
              <Link to={`/menu#${c.id}`} className={`cat-tile ${i === 0 ? 'cat-tile--feature' : ''}`}>
                {i === 0 ? <Steam className="cat-tile__steam" origin={{ x: 0.5, y: 0.5, spread: 0.4 }} intensity={0.7} /> : null}
                <span className="cat-tile__shadow" aria-hidden="true" />
                <img
                  className="cat-tile__dish"
                  src={itemsById[c.dish]?.cutout ?? c.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="cat-tile__text">
                  <span className="cat-tile__name">{localized(c.name, lang)}</span>
                  <span className="cat-tile__count">{t.home.itemsCount(c.items.length)}</span>
                </span>
                <Icon name="arrow" size={20} className="cat-tile__arrow flip-rtl" />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowTo() {
  const { t } = useLanguage();
  return (
    <section className="section" aria-labelledby="how-title">
      <div className="container">
        <Reveal className="section-head">
          <h2 id="how-title" className="section-title">{t.home.howTitle}</h2>
        </Reveal>
        <ol className="steps">
          {t.home.howSteps.map((step, i) => (
            <Reveal as="li" key={step.title} className="step" delay={i * 70}>
              <span className="step__num" aria-hidden="true">0{i + 1}</span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </Reveal>
          ))}
        </ol>
        <div className="steps__cta">
          <Link to="/menu" className="btn btn--dark btn--lg">
            {t.common.viewMenu}
            <Icon name="arrow" size={18} className="flip-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Visit() {
  const { t } = useLanguage();
  return (
    <section className="section section--paper" aria-labelledby="visit-title">
      <div className="container visit">
        <Reveal className="visit__info">
          <h2 id="visit-title" className="section-title">{t.home.visitTitle}</h2>
          <ContactList />
          <OpeningHours className="visit__hours" />
        </Reveal>
        <Reveal className="visit__follow" delay={80}>
          <h2 className="visit__follow-title">{t.home.followTitle}</h2>
          <p>{t.home.followText}</p>
          <SocialLinks withHandles />
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(null);
  return (
    <>
      <Hero />
      <Offers />
      <Categories />
      <HowTo />
      <Visit />
    </>
  );
}
