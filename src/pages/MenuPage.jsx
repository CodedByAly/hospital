import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { itemsByCategory, menuItems, categories } from '../data/menu.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Icon from '../components/Icon.jsx';
import MenuItemCard from '../components/MenuItemCard.jsx';
import './MenuPage.css';

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function matches(item, query) {
  const haystack = normalize(`${item.name} ${item.description} ${categories.find((c) => c.id === item.category)?.name}`);
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export default function MenuPage() {
  useDocumentMeta('Menu', "Zaher's full menu with prices: burgers, chicken and beef sandwiches, tortillas, starters, salads, mashawi, platters and drinks.");

  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim());
  const [active, setActive] = useState(categories[0].id);
  const tabsRef = useRef(null);
  const scrollingTo = useRef(null);
  const scrollTimer = useRef(null);

  const results = useMemo(() => (deferredQuery ? menuItems.filter((item) => matches(item, deferredQuery)) : null), [deferredQuery]);

  // Scroll-spy: highlight the category currently under the sticky bar.
  useEffect(() => {
    if (results) return undefined;
    const sections = categories.map((c) => document.getElementById(c.id)).filter(Boolean);
    const onScroll = () => {
      if (scrollingTo.current) return;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-offset')) || 140;
      let current = sections[0]?.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 8) current = section.id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.at(-1)?.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [results]);

  // Keep the active tab visible inside the horizontally scrolling bar.
  useEffect(() => {
    const tab = tabsRef.current?.querySelector(`[data-cat="${active}"]`);
    const bar = tabsRef.current;
    if (!tab || !bar) return;
    const left = tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2;
    bar.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  const goTo = (id) => (event) => {
    event.preventDefault();
    setQuery('');
    setActive(id);
    scrollingTo.current = id;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => (scrollingTo.current = null), 900);
  };

  return (
    <div className="menu-page">
      <header className="menu-hero">
        <div className="container menu-hero__inner">
          <div>
            <p className="eyebrow">Prices in USD</p>
            <h1 className="page-title">The menu</h1>
          </div>
          <label className="search">
            <Icon name="search" size={20} />
            <span className="visually-hidden">Search the menu</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, wings, avocado…"
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <Icon name="close" size={16} />
              </button>
            )}
          </label>
        </div>
      </header>

      <nav className="cat-bar" aria-label="Menu categories">
        <div className="container">
          <ul className="cat-bar__list" ref={tabsRef}>
            {categories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  data-cat={c.id}
                  className={`cat-bar__tab ${!results && active === c.id ? 'is-active' : ''}`}
                  aria-current={!results && active === c.id ? 'true' : undefined}
                  onClick={goTo(c.id)}
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="container menu-body">
        {results ? (
          <section aria-live="polite" className="menu-results">
            <h2 className="menu-section__title">
              {results.length ? `${results.length} ${results.length === 1 ? 'match' : 'matches'} for “${deferredQuery}”` : `Nothing matches “${deferredQuery}”`}
            </h2>
            {results.length ? (
              <div className="menu-grid">
                {results.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="menu-empty">
                <p>Try a different word, like “chicken”, “cheese” or “spicy”.</p>
                <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>
                  Show the full menu
                </button>
              </div>
            )}
          </section>
        ) : (
          itemsByCategory.map((category) => (
            <section key={category.id} id={category.id} className="menu-section" aria-labelledby={`${category.id}-title`}>
              <div className="menu-section__head">
                <h2 id={`${category.id}-title`} className="menu-section__title">
                  {category.name}
                </h2>
                <span className="menu-section__count">{category.items.length}</span>
              </div>
              <div className="menu-grid">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
