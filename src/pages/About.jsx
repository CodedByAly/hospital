import { Link } from 'react-router-dom';
import CategoryVisual from '../components/CategoryVisual';
import { ArrowRightIcon, InstagramIcon } from '../components/Icons';
import Reveal from '../components/Reveal';
import { categoriesById } from '../data/menu';
import { restaurant } from '../data/restaurant';
import useDocumentMeta from '../hooks/useDocumentMeta';

// Menu names that come straight from Chicago landmarks.
const landmarks = [
  ['Wrigley Field', 'Loaded fries'],
  ['Cloud Gate Crunch', 'Loaded fries'],
  ['Magnificent Mile Melt', 'Signature beef'],
  ['South Side Spice', 'Chicken burger'],
  ['Grant Park Beef', 'Sandwich'],
  ['Lakeshore Chicken', 'Sandwich'],
];

export default function About() {
  useDocumentMeta(
    'About',
    'Chicago Burgers is a burger kitchen on Kamil Shamoun Blvd, Beirut: smashed and flame-grilled beef, chicken burgers, loaded fries and subs.',
  );
  const duo = { ...categoriesById.get('chicken-burgers'), tone: 'peach' };

  return (
    <>
      <header className="page-hero on-dark">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 className="display h1">
            Chicago names,
            <br />
            <span className="accent">Beirut kitchen</span>
          </h1>
        </div>
      </header>

      <section className="section about">
        <div className="container about__grid">
          <Reveal className="about__copy">
            <p className="about__big">
              {restaurant.name} is a burger kitchen at Gallery Semaan on Kamil Shamoun Boulevard, by the Keserwani Center.
            </p>
            <p>
              The menu is built around beef cooked two ways: <strong>smashed</strong> into thin patties with crisp edges, or{' '}
              <strong>char-grilled</strong> over the flame. Crispy chicken burgers, loaded fries, subs and a short list of sides fill in the
              rest.
            </p>
            <p>
              Order on this site or on WhatsApp, then pick it up from us or have it delivered. Pay in cash, or by Whish Money transfer.
            </p>
            <p>
              We work alongside{' '}
              <a href={restaurant.partner.url} target="_blank" rel="noopener noreferrer" className="text-link">
                {restaurant.partner.name} ({restaurant.partner.handle})
              </a>
              .
            </p>
            <div className="about__ctas">
              <Link to="/menu" className="btn btn--dark btn--lg">
                See the menu <ArrowRightIcon size={18} />
              </Link>
              <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--lg">
                <InstagramIcon size={18} /> {restaurant.social.instagram.handle}
              </a>
            </div>
          </Reveal>
          <Reveal className="about__media" delay={100}>
            <CategoryVisual category={duo} />
          </Reveal>
        </div>
      </section>

      <section className="section landmarks on-dark">
        <div className="container">
          <Reveal className="landmarks__head">
            <p className="eyebrow">Why “Chicago”</p>
            <h2 className="display h2">Read the menu like a map</h2>
            <p className="lede">Most of our burgers and fries are named after places in Chicago.</p>
          </Reveal>
          <ul className="landmarks__list">
            {landmarks.map(([name, kind], i) => (
              <Reveal as="li" key={name} delay={(i % 3) * 60} className="landmarks__item">
                <span className="display">{name}</span>
                <span>{kind}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
