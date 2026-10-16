import { useMemo } from 'react';
import { restaurant, addressLine } from '../data/restaurant';
import { featuredIds, getItem } from '../data/menu';
import { useUI } from '../context/UIContext';
import Carousel3D from './Carousel3D';
import Icon from './Icon';
import './Hero.css';

export default function Hero() {
  const { openItem } = useUI();
  const featured = useMemo(() => featuredIds.map(getItem).filter(Boolean), []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">Resto Cafe &middot; Saida</p>
          <h1 id="hero-title" className="hero__title display">
            Built for your <em>daily grind.</em>
          </h1>
          <p className="hero__text">
            Manakish and breakfast plates, sandwiches, pizza and pasta, a full coffee bar and argili.
            Find us on Bikkerman Street, next to LIU, every day from 7:30 in the morning.
          </p>
          <div className="hero__actions">
            <a href="#menu" className="btn btn--wine">
              See the menu
              <Icon name="arrowRight" size={18} />
            </a>
            <a href="#visit" className="btn btn--ghost">
              Find us
            </a>
          </div>
          <dl className="hero__facts">
            <div>
              <dt>Hours</dt>
              <dd>{restaurant.hours.summary.replace('Open all week', 'Daily')}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{addressLine.replace(', Lebanon', '')}</dd>
            </div>
            <div>
              <dt>Call</dt>
              <dd>{restaurant.phoneDisplay}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <div className="hero__wall" aria-hidden="true" />
          <div className="hero__table" aria-hidden="true" />
          <Carousel3D items={featured} onSelect={(item) => openItem(item.id)} />
          <p className="hero__hint" aria-hidden="true">
            Drag to turn the table &middot; tap a dish
          </p>
        </div>
      </div>
    </section>
  );
}
