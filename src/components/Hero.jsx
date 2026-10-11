import { useCallback, useRef } from 'react';
import { ArrowIcon, PinIcon } from './Icons.jsx';
import { restaurant } from '../data/restaurant.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';

export default function Hero() {
  const ref = useRef(null);
  const setProgress = useCallback((p) => {
    ref.current?.style.setProperty('--hp', p.toFixed(4));
  }, []);
  useScrollProgress(ref, setProgress, 'pass');

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__grid container">
        <div className="hero__copy">
          <p className="eyebrow hero__in" style={{ '--d': 0 }}>
            {restaurant.address.street} &middot; {restaurant.address.city}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="line"><span className="hero__in" style={{ '--d': 1 }}>In the middle</span></span>
            <span className="line"><span className="hero__in" style={{ '--d': 2 }}>of the rush,</span></span>
            <span className="line"><span className="hero__in" style={{ '--d': 3 }}>we chose to be</span></span>
            <span className="line"><em className="hero__in" style={{ '--d': 4 }}>Sukun.</em></span>
          </h1>
          <p className="hero__lead hero__in" style={{ '--d': 5 }}>
            Specialty coffee, breakfast and board games in a small corner of {restaurant.address.street},
            right under the olive trees.
          </p>
          <div className="hero__actions hero__in" style={{ '--d': 6 }}>
            <a href="#menu" className="btn btn--solid">
              See the menu <ArrowIcon width={18} height={18} />
            </a>
            <a href={restaurant.mapsUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">
              <PinIcon width={18} height={18} /> Get directions
            </a>
          </div>
          <ul className="hero__tags hero__in" style={{ '--d': 7 }} aria-label="What we do">
            {restaurant.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <figure className="hero__main">
            <img
              src="/images/storefront.webp"
              alt="The Sukun sign glowing at night above the terrace on Azmi Street, full of guests"
              width="739"
              height="981"
              fetchPriority="high"
            />
          </figure>
          <figure className="hero__inset">
            <img
              src="/images/cup-neon.webp"
              alt="A Sukun cup held up in front of the café's neon logo"
              width="739"
              height="888"
              loading="lazy"
            />
          </figure>
          <p className="hero__caption" aria-hidden="true">
            <span>{restaurant.social.instagram.handle}</span>
            <span>{restaurant.address.city}, {restaurant.address.country}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
