import { Link } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { itemsByCategory } from '../data/menu';
import restaurant from '../config/restaurant';
import { asset } from '../lib/asset';
import Reveal from '../components/Reveal';
import Hours from '../components/Hours';
import Icon from '../components/Icon';

export default function About() {
  useDocumentMeta('About', 'Grillz — Burger. Done right. Premium burgers and wraps near Beirut Arab University, open daily 12 PM – 1 AM.');
  const count = itemsByCategory.reduce((n, c) => n + c.items.length, 0);
  return (
    <div className="about">
      <section className="about__intro">
        <div className="container about__grid">
          <div>
            <p className="eyebrow">{restaurant.tagline}</p>
            <h1 className="page-title page-title--xl">Premium burgers <span className="accent">&amp; wraps.</span></h1>
            <p className="about__lead">
              Grillz is a burger grill near Beirut Arab University. Beef burgers are made with 100% Angus beef, the chicken is fried crispy or grilled,
              and the board is short: {count} items across burgers, wraps, a quesadilla and sides.
            </p>
            <Link to="/menu" className="btn btn--primary btn--lg">See the menu <Icon name="arrow" size={20} /></Link>
          </div>
          <Reveal className="about__photo">
            <img src={asset('images/offers/tiny-chefs.webp')} alt="Tiny chef figures building a Grillz crispy chicken burger" loading="lazy" decoding="async" />
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="facts-title">
        <div className="container">
          <h2 id="facts-title" className="sr-only">Restaurant information</h2>
          <dl className="facts">
            <Reveal className="fact">
              <dt><Icon name="clock" size={22} /> Hours</dt>
              <dd><Hours /></dd>
            </Reveal>
            <Reveal className="fact" delay={70}>
              <dt><Icon name="truck" size={22} /> Delivery</dt>
              <dd>Call or WhatsApp <a className="link" href={`tel:${restaurant.phone.international}`}>{restaurant.phone.display}</a>, or order on this site.</dd>
            </Reveal>
            <Reveal className="fact" delay={140}>
              <dt><Icon name="store" size={22} /> Pickup</dt>
              <dd>Order ahead and collect it — we’ll message you when it’s ready.</dd>
            </Reveal>
            <Reveal className="fact" delay={210}>
              <dt><Icon name="pin" size={22} /> Location</dt>
              <dd>{restaurant.address.full}. <a className="link" href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></dd>
            </Reveal>
          </dl>
        </div>
      </section>
    </div>
  );
}
