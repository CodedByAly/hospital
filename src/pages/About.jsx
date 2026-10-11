import { Link } from 'react-router-dom';
import { branches, site } from '../config/site.js';
import { menuItems } from '../data/menu.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import CountUp from '../components/CountUp.jsx';
import './About.css';

const gallery = ['double-burger', 'zinger-supreme', 'philadelphia', 'curly-fries'].map((id) => menuItems.find((i) => i.id === id));

export default function About() {
  useDocumentMeta('About', `Zaher's has been delivering happiness since ${site.since}, with branches in Tyre, Hamra and Batroun.`);

  return (
    <div className="about">
      <section className="about-hero">
        <div className="container about-hero__inner">
          <Logo variant="full" className="about-hero__logo" />
          <h1 className="about-hero__title">Delivering happiness since {site.since}.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container about__story">
          <div className="about__text">
            <SectionTitle>About Zaher’s</SectionTitle>
            <p>Opened in {site.since}. Today in Tyre, Hamra (Bliss Street) and Batroun.</p>
            <p>Burgers, Zingers, subs, twisters, wings and strips. Plus farooj al fahem with toom and kabis, fattoush and tabbouleh.</p>
            <p>Pickup or delivery. Cash or Whish.</p>
            <Link to="/menu" className="btn btn--primary">
              Browse the menu <Icon name="arrowRight" size={18} />
            </Link>
          </div>
          <div className="about__gallery" aria-hidden="true">
            {gallery.map((item, i) => (
              <Reveal key={item.id} delay={i * 70} className={`about__shot about__shot--${i + 1}`}>
                <img src={item.image} alt="" width="224" height="224" loading="lazy" decoding="async" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about__numbers" aria-label="Zaher’s in numbers">
        <div className="container about__numbers-grid">
          <div>
            <strong><CountUp from={1990} to={site.since} /></strong>
            <span>Opened</span>
          </div>
          <div>
            <strong><CountUp to={branches.length} duration={700} /></strong>
            <span>{branches.map((b) => b.name).join(' · ')}</span>
          </div>
          <div>
            <strong><CountUp to={menuItems.length} /></strong>
            <span>Menu items</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about__info">
          <div>
            <h2 className="section-title section-title--sm">Pickup</h2>
            <p>Order online and collect it from your branch.</p>
          </div>
          <div>
            <h2 className="section-title section-title--sm">Delivery</h2>
            <p>Add your address at checkout. The branch confirms the fee and time.</p>
          </div>
          <div>
            <h2 className="section-title section-title--sm">Questions</h2>
            <p>
              Call, WhatsApp or email <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
            <Link to="/contact" className="link-arrow">
              Contact & branches <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
