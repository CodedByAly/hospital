import { Link } from 'react-router-dom'
import { Checker } from '../components/Checker.jsx'
import { IconArrowRight } from '../components/Icons.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { SocialLinks } from '../components/SocialLinks.jsx'
import { restaurant } from '../config/restaurant.js'
import { categories } from '../data/menu.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { phoneLink } from '../lib/format.js'

export default function About() {
  usePageMeta('About', `${restaurant.name} is a burger and sandwich spot in ${restaurant.address.locality}, Lebanon. Dine in, pickup and delivery, open ${restaurant.hours.short}.`)
  const sections = categories.filter((c) => c.id !== 'offers' && c.id !== 'drinks')

  return (
    <div className="about">
      <header className="page-hero page-hero--red">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 className="page-hero__title">{restaurant.bio}.</h1>
          <p className="page-hero__lede">
            {restaurant.name} is a burger and sandwich spot in {restaurant.address.locality}. Pull up a chair with your friends, grab
            it on your way, or have it delivered.
          </p>
        </div>
        <Checker tone="teal" />
      </header>

      <div className="container about__body">
        <Reveal as="section" className="about__block" aria-labelledby="about-food">
          <h2 id="about-food" className="about__heading">What&rsquo;s on the board</h2>
          <p className="about__text">
            Smashed beef burgers on potato buns, steak subs, grilled and crispy chicken, salads you can order in a half portion,
            and meal deals built for sharing, plus a kids meal with a little gift.
          </p>
          <ul className="about__tags">
            {sections.map((c) => (
              <li key={c.id}>
                <Link to={`/menu#${c.id}`} className={`tag tone-${c.tone}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" className="about__block" aria-labelledby="about-service">
          <h2 id="about-service" className="about__heading">Three ways to eat</h2>
          <dl className="about__services">
            <div>
              <dt>Dine in</dt>
              <dd>Bring the gang. {restaurant.tagline}.</dd>
            </div>
            <div>
              <dt>Pickup</dt>
              <dd>Order here or on WhatsApp, pick a time, and it will be ready when you arrive.</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>Tell us your area and address at checkout. Pay cash on delivery or by Whish.</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal as="section" className="about__block about__find" aria-labelledby="about-find">
          <h2 id="about-find" className="about__heading">Find us</h2>
          <dl className="info-list">
            <div>
              <dt>Location</dt>
              <dd>
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {restaurant.address.display}
                </a>
              </dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>{restaurant.hours.label}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={phoneLink}>{restaurant.phone.display}</a>
              </dd>
            </div>
            <div>
              <dt>Follow</dt>
              <dd>
                <SocialLinks showHandle className="social--inline" size={18} />
              </dd>
            </div>
          </dl>
          <Link to="/menu" className="btn btn--primary">
            Start an order <IconArrowRight size={18} />
          </Link>
        </Reveal>
      </div>
    </div>
  )
}
