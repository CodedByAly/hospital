import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { CloseIcon, PlusIcon, SearchIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { categories } from '../data/menu';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { money } from '../lib/format';
import './Menu.css';

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function filterMenu(query) {
  const q = normalize(query.trim());
  if (!q) return categories;
  const terms = q.split(/\s+/);
  return categories
    .map((cat) => {
      const catMatch = terms.every((t) => normalize(cat.name).includes(t));
      const items = catMatch
        ? cat.items
        : cat.items.filter((item) => {
            const hay = normalize(`${item.name} ${item.description}`);
            return terms.every((t) => hay.includes(t));
          });
      return { ...cat, items };
    })
    .filter((cat) => cat.items.length > 0);
}

export default function Menu() {
  useDocumentMeta(
    'Menu',
    'The full Chicago Burgers menu with prices: appetizers, loaded fries, chicken burgers, signature and flame-grilled beef burgers, sandwiches and drinks.',
  );
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => filterMenu(deferredQuery), [deferredQuery]);
  const resultCount = results.reduce((n, c) => n + c.items.length, 0);
  const searching = deferredQuery.trim().length > 0;
  const [active, setActive] = useState(results[0]?.id);
  const tabsRef = useRef(null);
  const inputRef = useRef(null);
  const lockSpy = useRef(false);

  // Scroll-spy: the active tab is the last section whose top has passed the sticky bar.
  useEffect(() => {
    const onScroll = () => {
      if (lockSpy.current) return;
      const offset = (tabsRef.current?.getBoundingClientRect().bottom ?? 120) + 24;
      let current = results[0]?.id;
      for (const cat of results) {
        const el = document.getElementById(cat.id);
        if (el && el.getBoundingClientRect().top <= offset) current = cat.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [results]);

  // Keep the active tab visible in the horizontal rail.
  useEffect(() => {
    const rail = tabsRef.current?.querySelector('.menu-tabs__rail');
    const tab = rail?.querySelector(`[data-tab="${active}"]`);
    if (!rail || !tab) return;
    const left = tab.offsetLeft - rail.clientWidth / 2 + tab.clientWidth / 2;
    rail.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  const jumpTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    lockSpy.current = true;
    const top = el.getBoundingClientRect().top + window.scrollY - (tabsRef.current?.offsetHeight ?? 0) - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) - 8;
    window.scrollTo({ top, behavior: 'smooth' });
    window.setTimeout(() => (lockSpy.current = false), 700);
    history.replaceState(null, '', `#${id}`);
  }, []);

  return (
    <div className="menu-page">
      <header className="menu-hero on-dark">
        <div className="container">
          <p className="eyebrow">Menu 2026</p>
          <h1 className="display h1">The menu</h1>
          <p className="lede">Prices in US dollars. Tap anything to choose a size, leave out ingredients, and add it to your order.</p>
        </div>
      </header>

      <div className="menu-tabs" ref={tabsRef}>
        <div className="container menu-tabs__inner">
          <div className="menu-search">
            <SearchIcon size={18} />
            <label htmlFor="menu-search" className="visually-hidden">
              Search the menu
            </label>
            <input
              ref={inputRef}
              id="menu-search"
              type="search"
              className="menu-search__input"
              placeholder="Search the menu"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // If the reader is deep in the menu, bring the results into view.
                const body = document.querySelector('.menu-body');
                const top = body ? body.getBoundingClientRect().top + window.scrollY - (tabsRef.current?.getBoundingClientRect().bottom ?? 0) : 0;
                if (window.scrollY > top) window.scrollTo({ top });
              }}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button
                type="button"
                className="menu-search__clear"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <CloseIcon size={16} />
              </button>
            )}
          </div>
          <nav className="menu-tabs__rail" aria-label="Menu categories">
            {results.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                data-tab={cat.id}
                className={`menu-tab ${active === cat.id ? 'is-active' : ''}`}
                aria-current={active === cat.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo(cat.id);
                }}
              >
                {cat.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="menu-body container">
        <p className="visually-hidden" role="status" aria-live="polite">
          {searching ? `${resultCount} ${resultCount === 1 ? 'item' : 'items'} found` : ''}
        </p>

        {results.length === 0 ? (
          <div className="menu-empty">
            <p className="display menu-empty__title">Nothing called “{deferredQuery.trim()}”</p>
            <p>Try a different word, like “chicken”, “cheddar” or “fries”.</p>
            <button type="button" className="btn btn--dark" onClick={() => setQuery('')}>
              Show the full menu
            </button>
          </div>
        ) : (
          results.map((cat) => <MenuSection key={cat.id} category={cat} />)
        )}
      </div>
    </div>
  );
}

function MenuSection({ category }) {
  const { openItem } = useCart();
  const full = categories.find((c) => c.id === category.id);
  const [loaded, setLoaded] = useState(false);

  return (
    <section id={category.id} className="menu-section" aria-labelledby={`${category.id}-title`}>
      <div className={`menu-banner menu-banner--${category.tone} ${category.image ? `has-img is-${category.image.shape}` : 'no-img'}`}>
        <div className="menu-banner__text">
          <h2 id={`${category.id}-title`} className="display menu-banner__title">
            {category.name}
          </h2>
          <p className="menu-banner__meta">
            {full.items.length} items{category.note ? ` · ${category.note}` : ''}
          </p>
        </div>
        {category.image ? (
          <img
            src={category.image.src}
            srcSet={`${category.image.thumb} 560w, ${category.image.src} 1100w`}
            sizes="(min-width: 900px) 520px, 60vw"
            alt={category.image.alt}
            loading="lazy"
            decoding="async"
            className={`menu-banner__img img-fade ${loaded ? 'is-loaded' : ''}`}
            style={{ objectPosition: category.image.focus, objectFit: category.image.fit }}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <span className="menu-banner__word" aria-hidden="true">
            {category.name}
          </span>
        )}
      </div>

      <ul className="menu-items">
        {category.items.map((item) => (
          <li key={item.id}>
            <button type="button" className="menu-item" onClick={() => openItem(item.id)} aria-haspopup="dialog">
              <span className="menu-item__text">
                <span className="menu-item__name">{item.name}</span>
                {item.description && <span className="menu-item__desc">{item.description}</span>}
                <span className="menu-item__prices">
                  {item.options ? (
                    item.options.choices.map((c) => (
                      <span key={c.id} className="price-tag">
                        <small>{c.name.charAt(0)}</small>
                        {money(c.price)}
                        <span className="visually-hidden"> {c.name}</span>
                      </span>
                    ))
                  ) : (
                    <span className="price-tag">{money(item.price)}</span>
                  )}
                </span>
              </span>
              <span className="menu-item__add" aria-hidden="true">
                <PlusIcon size={18} />
              </span>
              <span className="visually-hidden">. Open to add to order</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
