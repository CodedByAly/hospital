import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { itemsByCategory, SAUCE_PRICE } from '../data/menu';
import restaurant from '../config/restaurant';
import { formatPrice, normalize, tr } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import { foodSrc } from '../components/FoodImage';
import Price from '../components/Price';
import Icon from '../components/Icon';

function searchText(item) {
  const parts = [item.name.en, item.name.ar, item.note?.en, item.note?.ar];
  for (const i of item.ingredients || item.contents || []) parts.push(i.en, i.ar);
  return normalize(parts.filter(Boolean).join(' '));
}

export default function Menu() {
  const { t, lang } = useLanguage();
  const { count, subtotal } = useCart();
  const { openCart } = useUI();
  useDocumentMeta(t.meta.menu, t.meta.menuDescription);

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
            <h1 className="menu-hero__title">{t.menu.title}</h1>
            <p className="menu-hero__lead">{t.menu.lead}</p>
          </div>
          <div className="search" role="search">
            <label htmlFor="menu-search" className="sr-only">
              {t.menu.search}
            </label>
            <Icon name="search" size={20} className="search__icon" />
            <input
              id="menu-search"
              type="search"
              className="search__input"
              placeholder={t.menu.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label={t.menu.clearSearch}>
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
            {resultCount ? t.menu.results(resultCount) : ''}
          </p>
        )}

        {sections.length === 0 ? (
          <div className="menu-empty">
            <img src="/images/logo-shrimp.svg" alt="" />
            <p className="menu-empty__title">{t.menu.noResults(deferred)}</p>
            <p>{t.menu.noResultsHint}</p>
            <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>
              {t.menu.clearSearch}
            </button>
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.id} id={section.id} className="menu-section" aria-labelledby={`h-${section.id}`}>
              <h2 id={`h-${section.id}`} className="menu-section__title">
                {tr(section.name, lang)}
              </h2>
              {section.id === 'sauces' && (
                <p className="menu-section__note">
                  {t.menu.addSauceNote} · <span dir="ltr">{formatPrice(SAUCE_PRICE, lang)}</span>
                </p>
              )}
              <ul className="menu-list">
                {section.items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      {count > 0 && (
        <button type="button" className="cart-bar" onClick={openCart}>
          <span className="cart-bar__count">{count}</span>
          <span className="cart-bar__label">{t.cart.view}</span>
          <Price value={subtotal} className="cart-bar__total" />
        </button>
      )}
    </div>
  );
}

function MenuRow({ item }) {
  const { t, lang } = useLanguage();
  const { openItem } = useUI();
  const { add } = useCart();
  const addRef = useRef(null);
  const name = tr(item.name, lang);
  const description = item.ingredients || item.contents;

  const quickAdd = () => {
    if (item.includedSauces) return openItem(item.id);
    add({ itemId: item.id, qty: 1 });
    flyToCart(addRef.current.getBoundingClientRect(), item.image ? foodSrc(item.image) : null);
  };

  return (
    <li className="menu-row">
      <button type="button" className="menu-row__open" onClick={() => openItem(item.id)}>
        <span className="menu-row__line">
          <span className="menu-row__name">
            {name}
            {item.note && <span className="menu-row__note"> ({tr(item.note, lang)})</span>}
          </span>
          <Price value={item.price} className="menu-row__price" />
        </span>
        {description && (
          <span className="menu-row__desc">{description.map((d) => tr(d, lang)).join(lang === 'ar' ? '، ' : ', ')}</span>
        )}
      </button>
      <button type="button" className="menu-row__add" onClick={quickAdd} ref={addRef} aria-label={t.menu.quickAdd(name)}>
        <Icon name="plus" size={20} strokeWidth={2} />
      </button>
    </li>
  );
}

function CategoryTabs({ sections, active }) {
  const { t, lang } = useLanguage();
  const listRef = useRef(null);
  const [bar, setBar] = useState(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector(`[data-id="${active}"]`);
    if (!list || !el) return setBar(null);
    setBar({ x: el.offsetLeft, w: el.offsetWidth });
    // Keep the active tab visible on narrow screens.
    const target = el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2;
    list.scrollTo({ left: target, behavior: 'smooth' });
  }, [active, lang, sections.length]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav className="cat-tabs" aria-label={t.menu.categories}>
      <div className="container">
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
                {tr(s.name, lang)}
              </button>
            </li>
          ))}
          {bar && <li className="cat-tabs__bar" aria-hidden="true" style={{ '--x': `${bar.x}px`, '--w': `${bar.w}px` }} />}
        </ul>
      </div>
    </nav>
  );
}

/** Returns the id of the section currently under the sticky tabs. */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join(',');

  useEffect(() => {
    const update = () => {
      const offset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sticky-offset')) || 120) + 24;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      // At the very bottom, the last section is active even if it's short.
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

/** schema.org Menu markup so search engines can read dishes and prices. */
function MenuSchema() {
  const data = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Menu',
      name: `${restaurant.name} Menu`,
      inLanguage: ['en', 'ar'],
      hasMenuSection: itemsByCategory.map((c) => ({
        '@type': 'MenuSection',
        name: c.name.en,
        hasMenuItem: c.items.map((i) => ({
          '@type': 'MenuItem',
          name: i.name.en,
          ...(i.ingredients || i.contents ? { description: (i.ingredients || i.contents).map((d) => d.en).join(', ') } : {}),
          offers: { '@type': 'Offer', price: i.price, priceCurrency: 'LBP' },
        })),
      })),
    }),
    [],
  );
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
