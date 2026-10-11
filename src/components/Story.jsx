import { useCallback, useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress.js';

// Lines adapted from Sukun's own Instagram captions.
const CHAPTERS = [
  {
    kicker: 'The name',
    title: 'Some places you visit. Others settle into you.',
    body: 'Sukun means stillness. We wanted a place on Azmi Street where the noise of the city stays outside and the afternoon slows down with your cup.',
    image: '/images/barista-pour.webp',
    alt: 'A barista in a Sukun apron pouring steamed milk into a grey ceramic cup',
    w: 739,
    h: 1055,
  },
  {
    kicker: 'The table',
    title: 'Coffee is only the beginning.',
    body: 'The laughs, the long talks and the good company are the whole story. Bring a friend, pick a board game, and settle in.',
    image: '/images/two-cups.webp',
    alt: 'Two Sukun cups on a dark wooden table next to an old book and a brass key',
    w: 739,
    h: 898,
  },
  {
    kicker: 'The cold side',
    title: 'Something fresh for the warm days.',
    body: 'Fresh juices, smoothies, frappés and shakes, made at the bar, alongside the matcha selection and iced coffee.',
    image: '/images/refreshers.webp',
    alt: 'Three frozen drinks in strawberry, kiwi and mango held up against a blue sky',
    w: 739,
    h: 655,
  },
];

const clamp = (v) => Math.min(1, Math.max(0, v));

export default function Story() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const n = CHAPTERS.length;

  const onProgress = useCallback(
    (p) => {
      const el = ref.current;
      if (!el) return;
      const seg = p * n;
      el.style.setProperty('--sp', p.toFixed(4));
      // Each new photo wipes up over the previous one around its chapter boundary.
      CHAPTERS.forEach((_, i) => {
        const r = i === 0 ? 1 : clamp((seg - i + 0.3) / 0.6);
        el.style.setProperty(`--r${i}`, r.toFixed(4));
      });
      setActive(Math.min(n - 1, Math.floor(seg + 0.0001)));
    },
    [n]
  );
  useScrollProgress(ref, onProgress, 'pin');

  return (
    <section id="about" className="story" ref={ref} style={{ '--n': n }} aria-labelledby="story-title">
      <h2 id="story-title" className="visually-hidden">About Sukun</h2>
      <div className="story__sticky">
        <div className="story__grid container">
          <div className="story__frames">
            {CHAPTERS.map((c, i) => (
              <figure key={c.image} className="story__frame" style={{ '--r': `var(--r${i})`, zIndex: i }}>
                <img src={c.image} alt={c.alt} width={c.w} height={c.h} loading="lazy" />
              </figure>
            ))}
            <div className="story__counter" aria-hidden="true">
              <span>0{active + 1}</span>
              <span className="story__bar">
                <span />
              </span>
              <span>0{n}</span>
            </div>
          </div>

          <div className="story__texts">
            {CHAPTERS.map((c, i) => (
              <article
                key={c.title}
                className={`story__text ${i === active ? 'is-active' : ''}`}
              >
                <p className="eyebrow">{c.kicker}</p>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
