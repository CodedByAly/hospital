import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { itemsByCategory, ADDONS } from '../data/menu';
import restaurant from '../config/restaurant';
import { formatPrice, formatTotals, normalize } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import ItemName from '../components/ItemName';
import Icon from '../components/Icon';

const searchText = (item) => normalize([item.name, item.description].filter(Boolean).join(' '));

export default function Menu() {
  useDocumentMeta('Menu', 'The Grillz menu with prices: beef burgers, chicken burgers, specials, kids menu, wraps & quesadilla, appetizers and add-ons.');
  const { count, totals } = useCart();
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
            <p className="menu-hero__lead">Prices in Lebanese pounds. Tap any item to remove ingredients or add extra cheese, sauce or a fries + Pepsi combo.</p>
          </div>
          <div className="search" role="search">
            <label htmlFor="menu-search" className="sr-only">Search the menu</label>
            <Icon name="search" size={20} className="search__icon" />
            <input id="menu-search" type="search" className="search__input" placeholder="Search: mushroom, jalapeños, wrap…" value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" enterKeyHint="search" />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={18} /></button>
            )}
          </div>
        </div>
      </header>

      <CategoryTabs sections={sections} active={active} />

      <div className="container menu-body">
        {q && <p className="menu-results" role="status">{resultCount ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'} for “${deferred}”` : ''}</p>}

        {sections.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon" aria-hidden="true"><Icon name="search" size={36} /></span>
            <p className="empty-state__title">Nothing on the menu matches “{deferred}”.</p>
            <p>Try “chicken”, “cheddar” or “fries”.</p>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>Clear search</button>
          </div>
        ) : (
          <div className="menu-sections">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="menu-section" aria-labelledby={`h-${section.id}`}>
                <h2 id={`h-${section.id}`} className="tape menu-section__title">{section.name}</h2>
                {section.note && <p className="menu-section__note">{section.note}</p>}
                <ul className="menu-list">
                  {section.items.map((item) => <MenuRow key={item.id} item={item} />)}
                </ul>
              </section>
            ))}
          </div>
        )}

        {!q && (
          <aside className="addons-strip" aria-labelledby="addons-title">
            <h2 id="addons-title" className="tape">Add-ons</h2>
            <ul>
              {ADDONS.map((a) => (
                <li key={a.id}><span>{a.name}</span><strong>{formatPrice(a.price)}</strong></li>
              ))}
            </ul>
            <p>Add them to any burger, wrap or quesadilla from its options.</p>
          </aside>
        )}
      </div>

      {count > 0 && (
        <button type="button" className="cart-bar" onClick={openCart}>
          <span className="cart-bar__count">{count}</span>
          <span className="cart-bar__label">View cart</span>
          <span className="cart-bar__total">{formatTotals(totals)}</span>
        </button>
      )}
    </div>
  );
}

function MenuRow({ item }) {
  const { openItem } = useUI();
  const { add } = useCart();
  const addRef = useRef(null);
  const quickAdd = () => {
    add({ itemId: item.id, qty: 1 });
    flyToCart(addRef.current?.getBoundingClientRect(), null);
  };
  return (
    <li className="menu-row">
      <button type="button" className="menu-row__open" onClick={() => openItem(item.id)}>
        <span className="menu-row__line">
          <span className="menu-row__name">
            <ItemName item={item} />
            {item.spicy && <Icon name="flame" size={16} className="menu-row__hot" aria-label="spicy" />}
            {item.pieces && <span className="pcs">{item.pieces} pcs</span>}
          </span>
          <span className="menu-row__dots" aria-hidden="true" />
          <span className="menu-row__price">{formatPrice(item.price)}</span>
        </span>
        {item.description && <span className="menu-row__desc">{item.description}</span>}
      </button>
      <button type="button" className="menu-row__add" onClick={quickAdd} ref={addRef} aria-label={`Add ${item.name} to cart`}>
        <Icon name="plus" size={20} strokeWidth={2.2} />
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
        hasMenuItem: c.items.map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          ...(i.description ? { description: i.description } : {}),
          offers: { '@type': 'Offer', price: String(i.price), priceCurrency: 'LBP' },
        })),
      })),
    }),
    [],
  );
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
