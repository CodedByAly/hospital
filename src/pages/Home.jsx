import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
import { itemsById, itemsByCategory } from '../data/menu';
import { frozen, mealPlan, mission, offers, platDuJour } from '../data/highlights';
import { whatsappLink } from '../lib/whatsapp';
import usePageMeta from '../lib/usePageMeta';
import DishRow from '../components/DishRow';
import FoodImage from '../components/FoodImage';
import HoursList from '../components/HoursList';
import Icon from '../components/Icon';
import LeafPattern from '../components/LeafPattern';
import Logo from '../components/Logo';
import OpenStatus from '../components/OpenStatus';
import Price from '../components/Price';
import Reveal from '../components/Reveal';
import './Home.css';

// Editorial picks for the homepage, by menu id.
const STARTERS = [
  'crunch-combo',
  'double-oklahoma',
  'swiss-mushroom-burger',
  'lebanese-tawouk-sandwich',
  'fresh-kale-energy-bowl',
  'kibbeh-mekliye',
];

function Hero() {
  const { t, pick } = useI18n();
  return (
    <section className="hero" aria-labelledby="hero-title">
      <LeafPattern className="hero__pattern" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">{t('home.eyebrow')}</span>
          <h1 id="hero-title" className="hero__title">{t('home.title')}</h1>
          <p className="hero__lead">{t('home.lead')}</p>
          <div className="hero__actions">
            <Link to="/menu" className="btn btn--light">
              {t('home.orderCta')} <Icon name="arrow" className="flip-rtl" />
            </Link>
            <a href={whatsappLink()} className="btn btn--outline-light" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> {t('common.whatsapp')}
            </a>
          </div>
          <ul className="hero__facts">
            <li><OpenStatus tone="light" /></li>
            <li><Icon name="scooter" size={18} /> {t('home.pickupDelivery')}</li>
            <li><Icon name="pin" size={18} /> {pick(restaurant.location.area)}</li>
          </ul>
        </div>
        <div className="hero__badge" aria-hidden="true">
          <Logo layout="stacked" tagline={pick(restaurant.tagline)} />
        </div>
      </div>
    </section>
  );
}

function OfferStrip() {
  const { pick } = useI18n();
  const active = offers.filter((offer) => offer.active);
  if (!active.length) return null;
  return (
    <div className="offer-strip">
      <div className="container">
        {active.map((offer) => (
          <p key={offer.id}>
            <strong>{pick(offer.title)}</strong> <span aria-hidden="true">·</span> {pick(offer.text)}
          </p>
        ))}
      </div>
    </div>
  );
}

function Mission() {
  const { t, pick } = useI18n();
  return (
    <section className="section mission" aria-labelledby="mission-title">
      <div className="container mission__inner">
        <Reveal className="mission__head">
          <span className="eyebrow">{t('nav.about')}</span>
          <h2 id="mission-title" className="section-title">{t('home.howTitle')}</h2>
        </Reveal>
        <Reveal as="figure" className="mission__quote" delay={80}>
          <blockquote>
            <p>{pick(mission)}</p>
          </blockquote>
          <figcaption>{pick(mission.signature)}</figcaption>
        </Reveal>
        <ol className="mission__steps">
          {[
            ['howOne', 'howOneText'],
            ['howTwo', 'howTwoText'],
            ['howThree', 'howThreeText'],
          ].map(([title, text], index) => (
            <Reveal as="li" key={title} delay={index * 90}>
              <h3>{t(`home.${title}`)}</h3>
              <p>{t(`home.${text}`)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MenuSections() {
  const { t, pick } = useI18n();
  return (
    <section className="section menu-sections" aria-labelledby="menu-sections-title">
      <div className="container">
        <Reveal className="section__head section__head--split">
          <div>
            <h2 id="menu-sections-title" className="section-title">{t('home.menuTitle')}</h2>
            <p className="lead">{t('home.menuText')}</p>
          </div>
          <Link to="/menu" className="text-link">
            {t('home.menuCta')} <Icon name="arrow" size={18} className="flip-rtl" />
          </Link>
        </Reveal>

        <ul className="menu-sections__list">
          {itemsByCategory.map((category, index) => {
            const from = Math.min(
              ...category.items.map((item) => (item.variants ? Math.min(...item.variants.options.map((o) => o.price)) : item.price)),
            );
            const countLabel = category.id === 'beverages' ? 'home.drinks' : 'home.dishes';
            return (
              <Reveal as="li" key={category.id} delay={(index % 2) * 60}>
                <Link to={`/menu#${category.id}`} className="menu-sections__link">
                  <span className="menu-sections__name">{pick(category.name)}</span>
                  <span className="menu-sections__meta">
                    {t(countLabel, { count: category.items.length })}
                    <span aria-hidden="true"> · </span>
                    {t('common.from', { price: '' })}<Price value={from} />
                  </span>
                  <Icon name="arrow" size={22} className="menu-sections__arrow flip-rtl" />
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Starters() {
  const { t } = useI18n();
  const picks = STARTERS.map((id) => itemsById[id]).filter(Boolean);
  return (
    <section className="section section--tight starters" aria-labelledby="starters-title">
      <div className="container">
        <Reveal className="section__head">
          <h2 id="starters-title" className="section-title">{t('home.popularTitle')}</h2>
        </Reveal>
        <div className="starters__grid">
          {picks.map((item, index) => (
            <Reveal key={item.id} delay={(index % 2) * 60}>
              <DishRow item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Beyond() {
  const { t, pick } = useI18n();
  return (
    <section className="section beyond" aria-labelledby="beyond-title">
      <div className="container">
        <Reveal className="section__head">
          <h2 id="beyond-title" className="section-title">{t('home.moreTitle')}</h2>
        </Reveal>
        <div className="beyond__grid">
          <Reveal as="article" className="beyond__card beyond__card--frozen">
            <FoodImage src={frozen.image} alt={frozen.products.map((p) => pick(p)).join(', ')} ratio="4 / 5" />
            <div className="beyond__body">
              <h3>{pick(frozen.title)}</h3>
              <p>{pick(frozen.text)}</p>
              <ul className="beyond__products">
                {frozen.products.map((product) => <li key={product.en}>{pick(product)}</li>)}
              </ul>
              <a className="text-link" href={whatsappLink(`Hi Life Kitchen, I'd like to ask about your frozen boxes.`)} target="_blank" rel="noopener noreferrer">
                {t('home.askOnWhatsapp')} <Icon name="arrow" size={18} className="flip-rtl" />
              </a>
            </div>
          </Reveal>

          <div className="beyond__stack">
            <Reveal as="article" className="beyond__card beyond__card--plat" delay={80}>
              <LeafPattern className="beyond__pattern" />
              <h3>{pick(platDuJour.title)}</h3>
              <p>{pick(platDuJour.text)}</p>
              <a className="btn btn--light btn--sm" href={whatsappLink(`Hi Life Kitchen, what's today's plat du jour?`)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={18} /> {t('home.askOnWhatsapp')}
              </a>
            </Reveal>
            <Reveal as="article" className="beyond__card beyond__card--plan" delay={140}>
              <h3>{pick(mealPlan.title)}</h3>
              <p className="beyond__big">{pick(mealPlan.text)}</p>
              <a className="text-link" href={whatsappLink(`Hi Life Kitchen, I'd like to know more about the monthly meal plan.`)} target="_blank" rel="noopener noreferrer">
                {t('home.subscribe')} <Icon name="arrow" size={18} className="flip-rtl" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Visit() {
  const { t, pick } = useI18n();
  return (
    <section className="section visit" aria-labelledby="visit-title">
      <div className="container visit__grid">
        <Reveal className="visit__intro">
          <h2 id="visit-title" className="section-title">{t('home.visitTitle')}</h2>
          <p className="lead">{t('home.visitText')}</p>
          <div className="visit__actions">
            <Link to="/menu" className="btn">{t('home.orderCta')}</Link>
            <a href={`tel:${restaurant.phone.tel}`} className="btn btn--ghost">
              <Icon name="phone" size={18} /> <span className="ltr">{restaurant.phone.display}</span>
            </a>
          </div>
        </Reveal>
        <Reveal className="visit__details" delay={80}>
          <div className="visit__block">
            <h3>{t('contact.hours')}</h3>
            <OpenStatus />
            <HoursList />
          </div>
          <div className="visit__block">
            <h3>{t('contact.address')}</h3>
            <p>{pick(restaurant.location.area)}</p>
            <a className="text-link" href={restaurant.location.mapsUrl} target="_blank" rel="noopener noreferrer">
              {t('contact.mapCta')} <Icon name="arrow" size={18} className="flip-rtl" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  usePageMeta(t('meta.homeTitle'), t('meta.homeDescription'));
  return (
    <>
      <Hero />
      <OfferStrip />
      <Mission />
      <MenuSections />
      <Starters />
      <Beyond />
      <Visit />
    </>
  );
}
