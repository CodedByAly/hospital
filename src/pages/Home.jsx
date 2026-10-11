import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { itemsById, itemsByCategory } from '../data/menu';
import restaurant from '../config/restaurant';
import { tr } from '../lib/format';
import { telLink, whatsappLink } from '../lib/links';
import { flyToCart } from '../lib/flyToCart';
import FoodImage, { foodSrc } from '../components/FoodImage';
import Price from '../components/Price';
import Reveal from '../components/Reveal';
import Hours from '../components/Hours';
import SocialLinks from '../components/SocialLinks';
import Icon from '../components/Icon';

// Dishes we have real photos of, in the order they appear on the homepage.
const SHOWCASE = ['dynamite-wrap', 'fish-burger', 'grilled-shrimp-meal', 'mix-burger', 'shrimp-caesar-salad', 'crispy-shrimp-meal'];

export default function Home() {
  const { t } = useLanguage();
  useDocumentMeta(t.meta.homeTitle, t.meta.homeDescription);

  return (
    <>
      <Hero />
      <Kitchen />
      <MenuIndex />
      <FamilyMeal />
      <Visit />
      <FeedbackBand />
    </>
  );
}

function Hero() {
  const { t, lang } = useLanguage();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow eyebrow--light hero__in" style={{ '--d': 0 }}>{t.home.eyebrow}</p>
          <h1 id="hero-title" className="hero__title hero__in" style={{ '--d': 1 }}>
            {t.home.title}
          </h1>
          <p className="hero__lead hero__in" style={{ '--d': 2 }}>{t.home.lead}</p>
          <div className="hero__ctas hero__in" style={{ '--d': 3 }}>
            <Link to="/menu" className="btn btn--accent btn--lg">
              {t.common.orderNow}
              <Icon name="arrow" size={20} />
            </Link>
            <a href={telLink} className="btn btn--ghost-light btn--lg">
              <Icon name="phone" size={19} />
              <span dir="ltr">{restaurant.phone.display}</span>
            </a>
          </div>
          <ul className="hero__services hero__in" style={{ '--d': 4 }}>
            {t.home.services.map((s) => (
              <li key={s}>
                <Icon name="check" size={16} strokeWidth={2.2} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__media">
          <FoodImage
            name="fish-burger"
            alt={tr(itemsById['fish-burger'].name, lang)}
            eager
            className="hero__photo"
            sizes="(min-width: 960px) 460px, 90vw"
          />
          <p className="sticker hero__sticker" lang="ar" aria-label={t.home.stickerLabel}>
            {t.home.sticker}
          </p>
        </div>
      </div>
    </section>
  );
}

function Kitchen() {
  const { t } = useLanguage();
  return (
    <section className="section kitchen" aria-labelledby="kitchen-title">
      <div className="container">
        <Reveal className="section-head">
          <h2 id="kitchen-title" className="section-title">{t.home.kitchenTitle}</h2>
          <p className="section-lead">{t.home.kitchenLead}</p>
        </Reveal>
        <div className="kitchen__grid">
          {SHOWCASE.map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 70} className={`dish dish--${i + 1}`}>
              <Dish item={itemsById[id]} />
            </Reveal>
          ))}
        </div>
        <Reveal className="kitchen__more">
          <Link to="/menu" className="btn btn--outline">
            {t.common.seeMenu}
            <Icon name="arrow" size={20} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Dish({ item }) {
  const { t, lang } = useLanguage();
  const { openItem } = useUI();
  const { add } = useCart();
  const mediaRef = useRef(null);
  const name = tr(item.name, lang);
  const canQuickAdd = !item.includedSauces;

  const quickAdd = () => {
    add({ itemId: item.id, qty: 1 });
    flyToCart(mediaRef.current.getBoundingClientRect(), foodSrc(item.image));
  };

  return (
    <article className="dish__card">
      <button type="button" className="dish__open" onClick={() => openItem(item.id)}>
        <span className="dish__media" ref={mediaRef}>
          <FoodImage name={item.image} alt={name} sizes="(min-width: 960px) 33vw, 50vw" />
        </span>
        <span className="dish__meta">
          <span className="dish__name">{name}</span>
          <Price value={item.price} className="dish__price" />
        </span>
      </button>
      <button
        type="button"
        className="dish__add"
        onClick={canQuickAdd ? quickAdd : () => openItem(item.id)}
        aria-label={t.menu.quickAdd(name)}
      >
        <Icon name="plus" size={20} strokeWidth={2} />
      </button>
    </article>
  );
}

function MenuIndex() {
  const { t, lang } = useLanguage();
  return (
    <section className="section menu-index" aria-labelledby="menu-index-title">
      <div className="container menu-index__grid">
        <Reveal className="menu-index__head">
          <h2 id="menu-index-title" className="section-title">{t.home.menuTitle}</h2>
          <p className="section-lead">{t.home.menuLead}</p>
          <Link to="/menu" className="btn btn--primary">
            {t.common.seeMenu}
            <Icon name="arrow" size={20} />
          </Link>
        </Reveal>
        <ol className="menu-index__list">
          {itemsByCategory.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 50}>
              <Link to={`/menu#${c.id}`} className="menu-index__row">
                <span className="menu-index__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu-index__name">{tr(c.name, lang)}</span>
                <span className="menu-index__count">{t.common.items(c.items.length)}</span>
                <Icon name="arrow" size={20} className="menu-index__arrow" />
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FamilyMeal() {
  const { t, lang } = useLanguage();
  const { add } = useCart();
  const { openItem } = useUI();
  const mediaRef = useRef(null);
  const item = itemsById['family-meal'];

  const addFamily = () => {
    add({ itemId: item.id, qty: 1 });
    flyToCart(mediaRef.current.getBoundingClientRect(), foodSrc(item.image));
  };

  return (
    <section className="family" aria-labelledby="family-title">
      <div className="container family__grid">
        <Reveal className="family__media">
          <button type="button" className="family__photo" onClick={() => openItem(item.id)} ref={mediaRef} aria-label={tr(item.name, lang)}>
            <FoodImage name={item.image} alt={tr(item.name, lang)} sizes="(min-width: 960px) 50vw, 100vw" />
          </button>
        </Reveal>
        <Reveal className="family__copy" delay={80}>
          <p className="eyebrow eyebrow--light">{t.home.familyKicker}</p>
          <h2 id="family-title" className="family__title">{tr(item.name, lang)}</h2>
          <ul className="family__contents">
            {item.contents.map((c) => (
              <li key={c.en}>{tr(c, lang)}</li>
            ))}
          </ul>
          <div className="family__buy">
            <Price value={item.price} className="family__price" />
            <button type="button" className="btn btn--cream btn--lg" onClick={addFamily}>
              <Icon name="plus" size={20} />
              {t.home.familyCta}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Visit() {
  const { t, lang } = useLanguage();
  return (
    <section className="visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <Reveal className="visit__intro">
          <p className="visit__kicker" lang="ar">{t.contact.findUs}</p>
          <h2 id="visit-title" className="section-title section-title--light">{t.home.visitTitle}</h2>
          <p className="visit__lead">{t.home.visitLead}</p>
          <SocialLinks className="visit__social" />
        </Reveal>
        <Reveal className="visit__cards" delay={80}>
          <a className="visit__line" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="pin" />
            <span>
              <strong>{tr(restaurant.address, lang)}</strong>
              <small>{t.common.openMaps}</small>
            </span>
          </a>
          <a className="visit__line" href={telLink}>
            <Icon name="phone" />
            <span>
              <strong dir="ltr">{restaurant.phone.display}</strong>
              <small>{t.common.call}</small>
            </span>
          </a>
          <a className="visit__line" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />
            <span>
              <strong>{t.contact.whatsappCta}</strong>
              <small dir="ltr">{restaurant.phone.display}</small>
            </span>
          </a>
          <div className="visit__line visit__line--static">
            <Icon name="clock" />
            <span>
              <strong>{t.contact.hours}</strong>
              <Hours className="visit__hours" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeedbackBand() {
  const { t } = useLanguage();
  return (
    <section className="feedback-band" aria-labelledby="feedback-band-title">
      <Reveal className="container feedback-band__inner">
        <div>
          <h2 id="feedback-band-title" className="feedback-band__title">{t.home.feedbackTitle}</h2>
          <p>{t.home.feedbackLead}</p>
        </div>
        <Link to="/contact#feedback" className="btn btn--primary btn--lg">
          {t.home.feedbackCta}
          <Icon name="arrow" size={20} />
        </Link>
      </Reveal>
    </section>
  );
}
