import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { itemsByCategory, hasPriceRange } from '../data/menu';
import restaurant from '../config/restaurant';
import { formatPrice, normalize } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import FoodImage, { menuSrc } from '../components/FoodImage';
import Icon from '../components/Icon';

const searchText = (item) =>
  normalize([item.name, item.description, ...(item.variants || []).map((v) => `${v.label} ${v.description}`)].filter(Boolean).join(' '));

export default function Menu() {
  useDocumentMeta('Menu', 'The full Khalifa Bites menu with prices: appetizers, wings & strips, beef and chicken burgers, subs, plates, hot dogs, shawarma, salads and drinks.');
  const { count, subtotal } = useCart();
  const { openCart } = useUI();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const q = normalize(deferred);

  const sections = useMemo(() => {
    if (!q) return itemsByCategory;
    const words = q.split(/\s+/).filter(Boolean);
    return itemsByCategory
      .map((c) => ({ ...c, items: c.items.filter((i) => words.every((w) => searchText(i).includes(w))) }))
      .filter((c) => c.items.length);
  }, [q]);
  const resultCount = sections.reduce((n, c) => n + c.items.length, 0);
  const active = useScrollSpy(sections.map((s) => s.id));

  return (
    <div className="menu-page">
      <MenuSchema />
      <header className="menu-hero">
        <div className="container menu-hero__inner">
          <div>
            <h1 className="menu-hero__title">Menu</h1>
            <p className="menu-hero__lead">Tap any item to choose sauces, remove ingredients or add a note.</p>
          </div>
          <div className="search" role="search">
            <label htmlFor="menu-search" className="sr-only">Search the menu</label>
            <Icon name="search" size={20} className="search__icon" />
            <input
              id="menu-search"
              type="search"
              className="search__input"
              placeholder="Search burgers, wings, shawarma…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <CategoryTabs sections={sections} active={active} />

      <div className="container menu-body">
        {q && (
          <p className="menu-results" role="status">
            {resultCount ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'} for “${deferred}”` : ''}
          </p>
        )}

        {sections.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true"><Icon name="search" size={36} /></span>
            <p className="empty-state__title">Nothing on the menu matches “{deferred}”.</p>
            <p>Try another word — “chicken”, “cheddar”, “markook”…</p>
            <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>Clear search</button>
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.id} id={section.id} className="menu-section" aria-labelledby={`h-${section.id}`}>
              <h2 id={`h-${section.id}`} className="menu-section__title">
                {section.name}
                <span className="menu-section__count">{section.items.length}</span>
              </h2>
              <ul className={section.id === 'drinks' ? 'drink-list' : 'menu-grid'}>
                {section.items.map((item) => (section.id === 'drinks' ? <DrinkRow key={item.id} item={item} /> : <MenuCard key={item.id} item={item} />))}
              </ul>
            </section>
          ))
        )}
      </div>

      {count > 0 && (
        <button type="button" className="cart-bar" onClick={openCart}>
          <span className="cart-bar__count">{count}</span>
          <span className="cart-bar__label">View cart</span>
          <span className="cart-bar__total">{formatPrice(subtotal)}</span>
        </button>
      )}
    </div>
  );
}

/** Adds straight to the cart unless the item needs a decision first (size or sauce). */
function useQuickAdd(item, sourceRef) {
  const { add } = useCart();
  const { openItem } = useUI();
  return () => {
    if (item.variants || item.choice) return openItem(item.id);
    add({ itemId: item.id, qty: 1 });
    const img = sourceRef.current?.querySelector('img');
    flyToCart((img || sourceRef.current)?.getBoundingClientRect(), item.image ? menuSrc(item.image) : null);
  };
}

function MenuCard({ item }) {
  const { openItem } = useUI();
  const mediaRef = useRef(null);
  const quickAdd = useQuickAdd(item, mediaRef);
  const needsChoice = Boolean(item.variants || item.choice);

  return (
    <li className="menu-card">
      <button type="button" className="menu-card__open" onClick={() => openItem(item.id)}>
        <span className="menu-card__media" ref={mediaRef}>
          <FoodImage name={item.image} alt={item.name} sizes="(min-width: 960px) 300px, 40vw" />
        </span>
        <span className="menu-card__body">
          <span className="menu-card__name">{item.name}</span>
          <span className="menu-card__desc">{item.variants ? item.variants.map((v) => v.label.replace(' Shawarma', '')).join(' · ') : item.description}</span>
          <span className="menu-card__foot">
            <span className="price-tag">
              {hasPriceRange(item) && <small>from</small>}
              {formatPrice(item.price)}
            </span>
          </span>
        </span>
      </button>
      <button
        type="button"
        className="menu-card__add"
        onClick={quickAdd}
        aria-label={needsChoice ? `Choose options for ${item.name}` : `Add ${item.name} to cart`}
      >
        <Icon name="plus" size={20} strokeWidth={2.2} />
      </button>
    </li>
  );
}

function DrinkRow({ item }) {
  const ref = useRef(null);
  const quickAdd = useQuickAdd(item, ref);
  return (
    <li className="drink">
      <span className="drink__name">{item.name}</span>
      <span className="price-tag">{formatPrice(item.price)}</span>
      <button type="button" className="drink__add" onClick={quickAdd} ref={ref} aria-label={`Add ${item.name} to cart`}>
        <Icon name="plus" size={18} strokeWidth={2.2} />
      </button>
    </li>
  );
}

function CategoryTabs({ sections, active }) {
  const listRef = useRef(null);
  const [bar, setBar] = useState(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  // Show fades/arrows only on the side where more tabs are hidden.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const update = () => {
      const max = list.scrollWidth - list.clientWidth;
      setEdges({ start: list.scrollLeft > 4, end: list.scrollLeft < max - 4 });
    };
    update();
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      list.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [sections.length]);

  const nudge = (dir) => listRef.current?.scrollBy({ left: dir * listRef.current.clientWidth * 0.6, behavior: 'smooth' });

  useLayoutEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector(`[data-id="${active}"]`);
    if (!list || !el) return setBar(null);
    setBar({ x: el.offsetLeft, w: el.offsetWidth });
    // Keep the active tab in view on narrow screens.
    list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [active, sections.length]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    if (!import.meta.env.VITE_HASH_ROUTER) window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav className="cat-tabs" aria-label="Menu sections">
      <div className={`container cat-tabs__wrap ${edges.start ? 'has-start' : ''} ${edges.end ? 'has-end' : ''}`}>
        <button type="button" className="cat-tabs__arrow cat-tabs__arrow--start" onClick={() => nudge(-1)} tabIndex={-1} aria-hidden="true">
          <Icon name="chevron" size={18} style={{ transform: 'scaleX(-1)' }} />
        </button>
        <ul className="cat-tabs__list" ref={listRef}>
          {sections.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                data-id={s.id}
                className={`cat-tabs__tab ${active === s.id ? 'is-active' : ''}`}
                aria-current={active === s.id ? 'true' : undefined}
                onClick={() => go(s.id)}
              >
                {s.name}
              </button>
            </li>
          ))}
          {bar && <li className="cat-tabs__bar" aria-hidden="true" style={{ '--x': `${bar.x}px`, '--w': `${bar.w}px` }} />}
        </ul>
        <button type="button" className="cat-tabs__arrow cat-tabs__arrow--end" onClick={() => nudge(1)} tabIndex={-1} aria-hidden="true">
          <Icon name="chevron" size={18} />
        </button>
      </div>
    </nav>
  );
}

/** Id of the section currently under the sticky tabs. */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');
  useEffect(() => {
    const update = () => {
      const offset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-offset')) || 130) + 24;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
      setActive(current);
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

/** schema.org Menu so search engines can read dishes and prices. */
function MenuSchema() {
  const data = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: `${restaurant.name} Menu`,
      hasMenuSection: itemsByCategory.map((c) => ({
        '@type': 'MenuSection',
        name: c.name,
        hasMenuItem: c.items.flatMap((i) =>
          (i.variants || [null]).map((v) => ({
            '@type': 'MenuItem',
            name: v ? `${i.name} (${v.label})` : i.name,
            ...((v?.description || i.description) ? { description: v?.description || i.description } : {}),
            offers: { '@type': 'Offer', price: (v?.price ?? i.price).toFixed(2), priceCurrency: 'USD' },
          })),
        ),
      })),
    }),
    [],
  );
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
