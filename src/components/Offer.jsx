import { useCallback, useRef } from 'react';
import { restaurant } from '../data/restaurant.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';

export default function Offer() {
  const ref = useRef(null);
  const onProgress = useCallback((p) => ref.current?.style.setProperty('--op', p.toFixed(4)), []);
  useScrollProgress(ref, onProgress, 'pass');

  if (!restaurant.offer) return null;
  const { title, detail } = restaurant.offer;
  const [figure, ...rest] = title.split(' ');

  return (
    <section className="offer" ref={ref} aria-labelledby="offer-title">
      <div className="offer__grid container">
        <div className="offer__copy" data-reveal>
          <p className="eyebrow eyebrow--light">For students</p>
          <h2 id="offer-title" className="offer__title">
            <span className="offer__figure">{figure}</span>
            <span>{rest.join(' ')}</span>
          </h2>
          <p className="offer__detail">{detail} A little reward for all the hard work.</p>
        </div>
        <figure className="offer__photo" data-reveal>
          <img
            src="/images/student-offer.webp"
            alt="Sukun's terrace with a board game on a wooden table, announcing 20% off for student ID holders"
            width="739"
            height="1080"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
