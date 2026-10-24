import { Lockup, BeanMark } from './Logo'
import OpenStatus from './OpenStatus'
import { ArrowRightIcon, PinIcon } from './Icons'
import { site } from '../data/site'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <BeanMark className="hero__doodle" />

      <div className="hero__grid wrap">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            Coffee house <span aria-hidden="true">/</span> {site.town}, {site.country}
          </p>

          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{site.name}</span>
            <Lockup />
          </h1>

          <p className="hero__line display">{site.bio}.</p>

          <p className="lede hero__lede">
            Espresso, V60 and French press, rakwah, teas, frappés and shakes, with freshly baked
            croissants, desserts, salads and sandwiches. Pull up a chair and stay as long as you like.
          </p>

          <div className="hero__actions">
            <a href="#menu" className="btn">
              See the menu <ArrowRightIcon className="nudge" />
            </a>
            <a href={site.maps} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
              <PinIcon /> Find us in {site.town}
            </a>
          </div>

          <dl className="hero__facts">
            <div>
              <dt>Hours</dt>
              <dd>{site.hours.display}</dd>
              <dd>
                <OpenStatus />
              </dd>
            </div>
            <div>
              <dt>Call</dt>
              <dd>
                <a href={`tel:${site.phone.e164}`}>{site.phone.display}</a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className="hero__media">
          <div className="hero__frame">
            <img
              src="/images/iced-latte-sushi.webp"
              srcSet="/images/iced-latte-sushi-480.webp 480w, /images/iced-latte-sushi.webp 739w"
              sizes="(min-width: 960px) 42vw, 100vw"
              width="739"
              height="603"
              alt="An iced latte in a Bean Avenue cup next to a tray of sushi on a wooden table"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <figcaption>Iced latte, and the sushi we now serve alongside it.</figcaption>
        </figure>
      </div>
    </section>
  )
}
