import { Link } from 'react-router-dom';
import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { localized } from '../lib/format';
import Reveal from '../components/Reveal';
import ContactList from '../components/ContactList';
import OpeningHours from '../components/OpeningHours';
import SocialLinks from '../components/SocialLinks';
import Icon from '../components/Icon';

const gallery = ['nkhaat', 'mini-mix-box', 'rocca-beetroot-salad', 'makanik'];

export default function About() {
  const { t, lang } = useLanguage();
  usePageMeta(t.about.title);
  const services = [
    restaurant.services.dineIn && t.info.dineIn,
    restaurant.services.pickup && t.info.pickup,
    restaurant.services.delivery && t.info.delivery,
  ].filter(Boolean);

  return (
    <>
      <header className="page-head page-head--dark">
        <div className="container">
          <p className="eyebrow eyebrow--light">
            <bdi>“{restaurant.tagline}”</bdi>
          </p>
          <h1 className="page-title">{t.about.title}</h1>
          <p className="page-lead">{t.about.lead}</p>
        </div>
      </header>

      <section className="section">
        <div className="container about">
          <Reveal className="about__text">
            {t.about.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Link to="/menu" className="btn btn--primary btn--lg">
              {t.common.viewMenu}
              <Icon name="arrow" size={18} className="flip-rtl" />
            </Link>
          </Reveal>
          <Reveal className="about__gallery" delay={80} aria-hidden="true">
            {gallery.map((id) => (
              <img key={id} src={`/images/menu/${id}.jpg`} alt="" width="466" height="314" loading="lazy" decoding="async" />
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--paper" aria-labelledby="info-title">
        <div className="container">
          <h2 id="info-title" className="section-title">{t.about.infoTitle}</h2>
          <div className="info-grid">
            <Reveal className="info-card">
              <h3>{t.about.services}</h3>
              <ul className="check-list">
                {services.map((s) => (
                  <li key={s}>
                    <Icon name="check" size={18} strokeWidth={2.2} />
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="info-card" delay={60}>
              <h3>{t.about.deliveryArea}</h3>
              <p className="info-card__big">{localized(restaurant.deliveryArea, lang)}</p>
            </Reveal>
            <Reveal className="info-card" delay={120}>
              <h3>{t.contact.title}</h3>
              <ContactList />
              <OpeningHours />
            </Reveal>
            <Reveal className="info-card" delay={180}>
              <h3>{t.contact.social}</h3>
              <SocialLinks withHandles />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
