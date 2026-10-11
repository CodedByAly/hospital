import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { itemsByCategory, menuLineCount } from '../data/menu';
import restaurant from '../config/restaurant';
import FoodImage from '../components/FoodImage';
import Reveal from '../components/Reveal';
import InstagramGrid from '../components/InstagramGrid';
import Icon from '../components/Icon';

export default function About() {
  useDocumentMeta('About', 'Khalifa Bites — The Original Lebanese Flavor. Burgers, crispy chicken, subs and shawarma in Saida.');
  const sections = itemsByCategory.filter((c) => c.id !== 'drinks');

  return (
    <div className="about">
      <section className="about__intro">
        <div className="container about__intro-grid">
          <div>
            <p className="eyebrow">{restaurant.tagline}</p>
            <h1 className="page-title page-title--xl">More than a snack.</h1>
            <p className="about__lead">
              Khalifa Bites is a burger, sub and shawarma kitchen in Saida. Beef patties go on the charcoal grill, chicken comes grilled or
              homemade-crispy, and the shawarma is rolled in arabic bread or markook — or packed by the kilo for the whole table.
            </p>
            <Link to="/menu" className="btn btn--primary btn--lg">
              See the menu <Icon name="arrow" size={20} />
            </Link>
          </div>
          <div className="about__stack" aria-hidden="true">
            <FoodImage name="nice-to-meet-you" alt="" className="about__food about__food--a" />
            <FoodImage name="pats-king-of-steak" alt="" className="about__food about__food--b" />
            <FoodImage name="hot-buffalo-wings" alt="" className="about__food about__food--c" />
          </div>
        </div>
      </section>

      <section className="section about__menu" aria-labelledby="about-menu-title">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <p className="eyebrow">What we make</p>
              <h2 id="about-menu-title" className="section-title">{menuLineCount} items, {itemsByCategory.length} sections</h2>
            </div>
          </Reveal>
          <ul className="about__list">
            {sections.map((c, i) => (
              <Reveal as="li" key={c.id} delay={(i % 4) * 50}>
                <Link to={`/menu#${c.id}`} className="about__row">
                  <span className="about__row-name">{c.name}</span>
                  <span className="about__row-items">{c.items.map((x) => x.name).join(' · ')}</span>
                  <Icon name="arrow" size={20} className="about__row-arrow" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section about__how" aria-labelledby="how-title">
        <div className="container">
          <Reveal><h2 id="how-title" className="section-title">How to get your order</h2></Reveal>
          <div className="about__how-grid">
            <Reveal className="service">
              <Icon name="store" size={30} />
              <h3>Pickup</h3>
              <p>Order here or on WhatsApp and collect it from us in Saida.</p>
            </Reveal>
            <Reveal className="service" delay={70}>
              <Icon name="truck" size={30} />
              <h3>Delivery</h3>
              <p>Give us your address at checkout — we confirm the time and fee on WhatsApp.</p>
            </Reveal>
            <Reveal className="service" delay={140}>
              <Icon name="whatsapp" size={30} />
              <h3>WhatsApp</h3>
              <p>Prefer to just message? Send your order to {restaurant.phone.display}.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section about__insta" aria-labelledby="about-insta">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="about-insta" className="section-title">From our Instagram</h2>
            <a href={restaurant.social.instagram} className="text-link" target="_blank" rel="noopener noreferrer">@khalifa.bites <Icon name="arrow" size={18} /></a>
          </Reveal>
          <InstagramGrid limit={4} />
        </div>
      </section>
    </div>
  );
}
