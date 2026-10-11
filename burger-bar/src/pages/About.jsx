import { Link } from 'react-router-dom';
import { branches, schedule, site } from '../config/site.js';
import { categories, menuItems } from '../data/menu.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import CountUp from '../components/CountUp.jsx';
import './About.css';

const branch = branches[0];
const gallery = ['/images/menu/beef-bacon-burger.webp', '/images/menu/stivo-swiss.webp', '/images/menu/crispy-burger.webp', '/images/gallery/fried-chicken.webp'];
const daysOpen = Object.values(schedule).filter(Boolean).length;

export default function About() {
  useDocumentMeta('About', 'Burger Bar on Al-Manara main road, West Bekaa. Burgers, sandwiches, plates and salads. Dine-in, delivery and takeaway.');

  return (
    <div className="about">
      <section className="about-hero">
        <div className="container about-hero__inner">
          <Logo className="about-hero__logo" />
          <h1 className="about-hero__title">{site.tagline}.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container about__story">
          <div className="about__text">
            <SectionTitle>About Burger Bar</SectionTitle>
            <p>On the main road in Al-Manara, West Bekaa.</p>
            <p>Burgers, Stivo, tawook and twisters. Farouj fa7m, Alfredo plates and salads.</p>
            <p>Dine in, take away or order delivery. Cash or Whish.</p>
            <Link to="/menu" className="btn btn--primary">
              See the menu <Icon name="arrowRight" size={18} />
            </Link>
          </div>
          <div className="about__gallery" aria-hidden="true">
            {gallery.map((src, i) => (
              <Reveal key={src} delay={i * 80} className={`about__shot about__shot--${i + 1}`}>
                <img src={src} alt="" loading="lazy" decoding="async" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about__numbers" aria-label="Burger Bar in numbers">
        <div className="container about__numbers-grid">
          <div>
            <strong>
              <CountUp to={menuItems.length} />
            </strong>
            <span>Menu items</span>
          </div>
          <div>
            <strong>
              <CountUp to={categories.length} duration={700} />
            </strong>
            <span>Sections: {categories.map((c) => c.name).join(', ')}</span>
          </div>
          <div>
            <strong>
              <CountUp to={daysOpen} duration={700} />
            </strong>
            <span>Days a week. Closed Mondays</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about__info">
          <div>
            <h2 className="section-title section-title--sm">Dine-in</h2>
            <p>{branch.address}.</p>
          </div>
          <div>
            <h2 className="section-title section-title--sm">Delivery</h2>
            <p>Add your address at checkout. We confirm the fee and time on WhatsApp.</p>
          </div>
          <div>
            <h2 className="section-title section-title--sm">Takeaway</h2>
            <p>Order online, pick a time and collect it at the counter.</p>
            <Link to="/contact" className="link-arrow">
              Contact <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
