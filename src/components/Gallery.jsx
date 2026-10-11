import { useCallback, useRef } from 'react';
import Logo from './Logo.jsx';
import { ArrowUpRight } from './Icons.jsx';
import { restaurant } from '../data/restaurant.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';

const POSTS = [
  {
    src: '/images/tiramisu.webp',
    alt: 'Iced Tiramisu in a tall glass topped with cocoa and a ladyfinger, on a sunlit wooden table',
    caption: 'Iced Tiramisu',
    w: 739,
    h: 918,
  },
  {
    src: '/images/cozy-break.webp',
    alt: 'A croissant dipped into a foamy coffee in a Sukun cup',
    caption: 'Your cozy break starts here',
    w: 549,
    h: 886,
  },
  {
    src: '/images/kiwi-lychee.webp',
    alt: 'Two friends holding a kiwi basil smoothie and a lychee lemonade',
    caption: 'Kiwi basil & lychee lemonade',
    w: 739,
    h: 745,
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const onProgress = useCallback((p) => ref.current?.style.setProperty('--gp', p.toFixed(4)), []);
  useScrollProgress(ref, onProgress, 'pass');
  const ig = restaurant.social.instagram;

  return (
    <section className="gallery" ref={ref} aria-labelledby="gallery-title">
      <div className="container">
        <header className="gallery__head" data-reveal>
          <div>
            <p className="eyebrow">On Instagram</p>
            <h2 id="gallery-title" className="section-title">
              A few cups from <em>{ig.handle}</em>
            </h2>
          </div>
          <a className="link-arrow" href={ig.url} target="_blank" rel="noreferrer">
            Follow along <ArrowUpRight width={18} height={18} />
          </a>
        </header>

        <div className="gallery__grid">
          {POSTS.map((post, i) => (
            <a
              key={post.src}
              className="gallery__item"
              href={ig.url}
              target="_blank"
              rel="noreferrer"
              style={{ '--i': i }}
              data-reveal
            >
              <figure>
                <div className="gallery__img">
                  <img src={post.src} alt={post.alt} width={post.w} height={post.h} loading="lazy" />
                </div>
                <figcaption>
                  <span>{post.caption}</span>
                  <ArrowUpRight width={16} height={16} />
                </figcaption>
              </figure>
            </a>
          ))}
          <a className="gallery__follow" href={ig.url} target="_blank" rel="noreferrer" style={{ '--i': 3 }} data-reveal>
            <Logo />
            <span className="gallery__follow-handle">{ig.handle}</span>
            <span className="gallery__follow-cta">
              See more on Instagram <ArrowUpRight width={16} height={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
