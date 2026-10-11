import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { itemsById } from '../data/menu';
import { tr } from '../lib/format';
import useDocumentMeta from '../hooks/useDocumentMeta';
import FoodImage from '../components/FoodImage';
import Reveal from '../components/Reveal';
import Icon from '../components/Icon';

export default function About() {
  const { t, lang } = useLanguage();
  const a = t.about;
  const nameOf = (id) => tr(itemsById[id].name, lang);
  useDocumentMeta(t.meta.about, t.meta.aboutDescription);

  return (
    <div className="about">
      <section className="about__intro">
        <div className="container about__intro-grid">
          <div>
            <p className="eyebrow">{a.kicker}</p>
            <h1 className="page-title page-title--xl">{a.title}</h1>
            <p className="about__lead">{a.lead}</p>
            <p className="about__body">{a.p1}</p>
            <Link to="/menu" className="btn btn--primary btn--lg">
              {a.cta}
              <Icon name="arrow" size={20} />
            </Link>
          </div>
          <div className="about__photos">
            <FoodImage name="mix-burger" alt={nameOf('mix-burger')} eager className="about__photo about__photo--tall" sizes="(min-width: 960px) 30vw, 60vw" />
            <FoodImage name="seafood-spread" alt={`${nameOf('shrimp-caesar-salad')} · ${nameOf('qambri-crab-salad')}`} className="about__photo about__photo--small" sizes="(min-width: 960px) 20vw, 40vw" />
          </div>
        </div>
      </section>

      <section className="about__quotes" aria-label="Qambri">
        <div className="container about__quotes-grid">
          <Reveal as="figure" className="quote">
            <FoodImage name="grilled-shrimp-meal" alt={nameOf('grilled-shrimp-meal')} className="quote__photo" />
            <figcaption>
              <p className="quote__ar" lang="ar">{a.quote1}</p>
              {a.quote1En && <p className="quote__en">{a.quote1En}</p>}
            </figcaption>
          </Reveal>
          <Reveal as="figure" className="quote" delay={90}>
            <FoodImage name="fish-burger" alt={nameOf('fish-burger')} className="quote__photo" />
            <figcaption>
              <p className="quote__ar" lang="ar">{a.quote2}</p>
              {a.quote2En && <p className="quote__en">{a.quote2En}</p>}
            </figcaption>
          </Reveal>
        </div>
      </section>

      <section className="section about__services" aria-labelledby="services-title">
        <div className="container">
          <Reveal>
            <h2 id="services-title" className="section-title">{a.servicesTitle}</h2>
          </Reveal>
          <div className="about__service-grid">
            <Reveal className="service">
              <Icon name="store" size={30} />
              <h3>{t.checkout.pickup}</h3>
              <p>{a.pickupBody}</p>
            </Reveal>
            <Reveal className="service" delay={80}>
              <Icon name="truck" size={30} />
              <h3>{t.checkout.delivery}</h3>
              <p>{a.deliveryBody}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
