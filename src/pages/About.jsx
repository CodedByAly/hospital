import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
import { frozen, mealPlan, mission, platDuJour } from '../data/highlights';
import usePageMeta from '../lib/usePageMeta';
import FoodImage from '../components/FoodImage';
import HoursList from '../components/HoursList';
import Icon from '../components/Icon';
import LeafPattern from '../components/LeafPattern';
import Logo from '../components/Logo';
import OpenStatus from '../components/OpenStatus';
import Reveal from '../components/Reveal';
import SocialLinks from '../components/SocialLinks';
import './About.css';

export default function About() {
  const { t, pick } = useI18n();
  usePageMeta(t('meta.aboutTitle'), t('meta.aboutDescription'));
  const area = pick(restaurant.location.area);

  return (
    <>
      <header className="page-hero">
        <div className="container about-hero">
          <div>
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h1>{t('about.title')}</h1>
            <p className="lead">{t('about.lead')}</p>
          </div>
        </div>
      </header>

      <section className="about-cover" aria-label={pick(restaurant.tagline)}>
        <div className="container">
          <div className="about-cover__panel">
            <LeafPattern className="about-cover__pattern" />
            <Logo layout="stacked" tone="light" tagline={pick(restaurant.tagline)} />
          </div>
        </div>
      </section>

      <section className="section about-story">
        <div className="container about-story__grid">
          <Reveal as="figure" className="about-story__quote">
            <blockquote><p>{pick(mission)}</p></blockquote>
            <figcaption>{pick(mission.signature)}</figcaption>
          </Reveal>
          <Reveal className="about-story__facts" delay={80}>
            <h2 className="about-story__heading">{t('about.modelTitle')}</h2>
            <ul>
              <li><span className="about-story__num">{pick({ en: '1 for 1', ar: '1 مقابل 1' })}</span>{t('home.howThreeText')}</li>
              <li><span className="about-story__num">{pick({ en: 'Non-profit', ar: 'غير ربحي' })}</span>{t('about.profits')}</li>
              <li><span className="about-story__num">{pick(mealPlan.title)}</span>{pick(mealPlan.text)}</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight about-more">
        <div className="container about-more__grid">
          <Reveal className="about-more__image">
            <FoodImage src={frozen.image} alt={frozen.products.map((p) => pick(p)).join(', ')} ratio="4 / 5" />
          </Reveal>
          <Reveal className="about-more__text" delay={80}>
            <h2 className="section-title">{pick(frozen.title)}</h2>
            <p className="lead">{pick(frozen.text)}</p>
            <p className="lead">{pick(platDuJour.text)}</p>
            <Link to="/menu" className="btn">{t('home.menuCta')}</Link>
          </Reveal>
        </div>
      </section>

      <section className="section about-info" aria-labelledby="info-title">
        <div className="container">
          <Reveal className="section__head">
            <h2 id="info-title" className="section-title">{t('about.infoTitle')}</h2>
          </Reveal>
          <div className="about-info__grid">
            <Reveal className="about-info__item">
              <Icon name="store" size={26} />
              <h3>{t('about.pickup')}</h3>
              <p>{t('about.pickupText', { area })}</p>
            </Reveal>
            <Reveal className="about-info__item" delay={60}>
              <Icon name="scooter" size={26} />
              <h3>{t('about.delivery')}</h3>
              <p>{t('about.deliveryText')}</p>
            </Reveal>
            <Reveal className="about-info__item" delay={120}>
              <Icon name="clock" size={26} />
              <h3>{t('about.hours')}</h3>
              <OpenStatus />
              <HoursList />
            </Reveal>
            <Reveal className="about-info__item" delay={180}>
              <Icon name="pin" size={26} />
              <h3>{t('about.location')}</h3>
              <p>{area}</p>
              <a className="text-link" href={restaurant.location.mapsUrl} target="_blank" rel="noopener noreferrer">
                {t('contact.mapCta')} <Icon name="arrow" size={18} className="flip-rtl" />
              </a>
              <SocialLinks variant="list" include={['instagram', 'facebook', 'tiktok']} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
