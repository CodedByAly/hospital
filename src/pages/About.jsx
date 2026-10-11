import { Link } from 'react-router-dom';
import { branches, site } from '../config/site.js';
import { categories, menuItems } from '../data/menu.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import Reveal from '../components/Reveal.jsx';
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
            <p className="eyebrow">About Zaher’s</p>
            <h2 className="section-title">A diner menu with a Lebanese grill</h2>
            <p>
              Zaher’s started in {site.since} and today serves from three branches: Tyre, Hamra on Bliss Street, and Batroun.
            </p>
            <p>
              The menu runs from beef burgers and Zinger sandwiches to subs, twisters, wings and strips, and alongside them
              the things you’d expect from a Lebanese kitchen: farooj al fahem with toom and kabis, fattoush and tabbouleh.
            </p>
            <p>Order here for pickup or delivery, and pay cash or by Whish Money.</p>
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
            <strong>{site.since}</strong>
            <span>The year we opened</span>
          </div>
          <div>
            <strong>{branches.length}</strong>
            <span>Branches: {branches.map((b) => b.name).join(', ')}</span>
          </div>
          <div>
            <strong>{menuItems.length}</strong>
            <span>Items across {categories.length} sections of the menu</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about__info">
          <div>
            <h2 className="section-title section-title--sm">Pickup</h2>
            <p>Order here, pick a time, and collect it from the branch you chose. Pay cash at the counter or by Whish.</p>
          </div>
          <div>
            <h2 className="section-title section-title--sm">Delivery</h2>
            <p>Add your area and address at checkout. The branch confirms the delivery fee and time when it confirms your order.</p>
          </div>
          <div>
            <h2 className="section-title section-title--sm">Questions</h2>
            <p>
              Call any branch, message us on WhatsApp, or email <a href={`mailto:${site.email}`}>{site.email}</a>.
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
