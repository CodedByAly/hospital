import { useCallback, useEffect, useRef, useState } from 'react';
import { itemsById, showcaseIds } from '../data/menu';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice, localized } from '../lib/format';
import Steam from './Steam';
import Icon from './Icon';

const INTERVAL = 4800;
const dishes = showcaseIds.map((id) => itemsById[id]).filter((d) => d?.cutout);

/**
 * Signature dishes on a lit counter: each one is set down, floats gently with
 * steam rising off it, then makes way for the next. Pauses on hover and focus.
 */
export default function HeroShowcase() {
  const { t, lang } = useLanguage();
  const { openItem } = useUI();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const go = useCallback(
    (next) => {
      if (next === index) return;
      setPrev(index);
      setIndex(next);
    },
    [index],
  );

  useEffect(() => {
    if (paused || reduced.current) return undefined;
    const timer = setTimeout(() => go((index + 1) % dishes.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [index, paused, go]);

  // Subtle 3D tilt that follows the pointer (mouse and pen only).
  const onPointerMove = (e) => {
    if (e.pointerType === 'touch' || reduced.current) return;
    const box = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    stageRef.current.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
    stageRef.current.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`);
    stageRef.current.style.setProperty('--shift-x', `${(x * 14).toFixed(1)}px`);
  };
  const resetTilt = () => {
    const el = stageRef.current;
    el?.style.setProperty('--tilt-x', '0deg');
    el?.style.setProperty('--tilt-y', '0deg');
    el?.style.setProperty('--shift-x', '0px');
  };

  if (!dishes.length) return null;
  const dish = dishes[index];
  const name = localized(dish.name, lang);

  return (
    <div
      className="showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        resetTilt();
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div ref={stageRef} className="showcase__stage" onPointerMove={onPointerMove}>
        <div className="showcase__glow" aria-hidden="true" />
        <div className="showcase__counter" aria-hidden="true" />
        {dishes.map((d, i) => (
          <button
            key={d.id}
            type="button"
            className="showcase__dish"
            data-state={i === index ? 'in' : i === prev ? 'out' : 'idle'}
            onClick={() => openItem(d.id)}
            tabIndex={i === index ? 0 : -1}
            aria-hidden={i === index ? undefined : true}
            aria-label={t.home.showcaseOpen(localized(d.name, lang))}
          >
            <span className="showcase__shadow" />
            <span className="showcase__float">
              <img src={d.cutout} alt="" draggable="false" decoding="async" fetchpriority={i === 0 ? 'high' : undefined} />
            </span>
          </button>
        ))}
        <Steam className="showcase__steam" origin={{ x: 0.5, y: 0.4, spread: 0.3 }} />
      </div>

      <div className="showcase__bar">
        <div className="showcase__caption" aria-live="polite" key={dish.id}>
          <p className="showcase__name">{name}</p>
          <p className="showcase__price">{formatPrice(dish.price, lang)}</p>
        </div>
        <button type="button" className="btn btn--primary showcase__cta" onClick={() => openItem(dish.id)}>
          <Icon name="plus" size={18} strokeWidth={2} />
          {t.home.showcaseAdd}
        </button>
      </div>

      <div className="showcase__picker" role="group" aria-label={t.home.showcasePicker}>
        {dishes.map((d, i) => (
          <button
            key={d.id}
            type="button"
            className={`showcase__thumb ${i === index ? 'is-active' : ''} ${paused ? 'is-paused' : ''}`}
            onClick={() => go(i)}
            aria-pressed={i === index}
            aria-label={localized(d.name, lang)}
            style={{ '--interval': `${INTERVAL}ms` }}
          >
            <img src={d.cutout} alt="" loading="lazy" decoding="async" />
            <span className="showcase__progress" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
