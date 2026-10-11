import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { itemsByCategory, menuItems } from '../data/menu';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { localized } from '../lib/format';
import MenuCard, { PromoCard } from '../components/MenuCard';
import Icon from '../components/Icon';

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ًͯ-ٟ']/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

function CategoryNav({ active, onSelect }) {
  const { t, lang } = useLanguage();
  const listRef = useRef(null);

  // Keep the active chip in view while the page scrolls.
  useEffect(() => {
    const list = listRef.current;
    const chip = list?.querySelector(`[data-cat="${active}"]`);
    if (!list || !chip) return;
    const listBox = list.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < listBox.left + 16 || chipBox.right > listBox.right - 16) {
      list.scrollBy({ left: chipBox.left - listBox.left - listBox.width / 2 + chipBox.width / 2, behavior: 'smooth' });
    }
  }, [active]);

  return (
    <nav className="cat-nav" aria-label={t.menu.categories}>
      <div className="container">
        <ul ref={listRef} className="cat-nav__list">
          {itemsByCategory.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                data-cat={c.id}
                className={`cat-nav__chip ${active === c.id ? 'is-active' : ''}`}
                aria-current={active === c.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(c.id);
                }}
              >
                {localized(c.name, lang)}
                <span className="cat-nav__count">{c.items.length}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function scrollToSection(id, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'instant', block: 'start' });
}

export default function Menu() {
  const { t, lang } = useLanguage();
  usePageMeta(t.menu.title);
  const location = useLocation();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const ids = useMemo(() => itemsByCategory.map((c) => c.id), []);
  const active = useScrollSpy(ids, 150);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return;
    // Jump now, then again once web fonts have settled the layout.
    requestAnimationFrame(() => scrollToSection(id, false));
    document.fonts?.ready.then(() => scrollToSection(id, false));
  }, [location.hash]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const q = normalize(deferred.trim());
  const results = useMemo(() => {
    if (!q) return null;
    return menuItems.filter((item) =>
      [item.name.en, item.name.ar, item.description?.en, item.description?.ar]
        .filter(Boolean)
        .some((s) => normalize(s).includes(q)),
    );
  }, [q]);

  const select = (id) => {
    setQuery('');
    window.history.replaceState(null, '', `#${id}`);
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <div className="menu-page">
      <header className="page-head page-head--menu">
        <div className="container page-head__inner">
          <div>
            <h1 className="page-title">{t.menu.title}</h1>
            <p className="page-lead">{t.menu.intro}</p>
          </div>
          <div className="search" role="search">
            <Icon name="search" size={20} className="search__icon" />
            <input
              type="search"
              className="search__input"
              placeholder={t.menu.searchPlaceholder}
              aria-label={t.menu.searchLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
              autoComplete="off"
            />
            {query ? (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label={t.menu.clearSearch}>
                <Icon name="close" size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {results ? (
        <section className="container menu-results" aria-live="polite">
          <p className="menu-results__count">{t.menu.results(results.length)}</p>
          {results.length ? (
            <div className="menu-grid">
              {results.map((item) => (item.promo ? <PromoCard key={item.id} item={item} /> : <MenuCard key={item.id} item={item} />))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="search" size={36} strokeWidth={1.3} />
              <p className="empty-state__title">{t.menu.noResults(deferred.trim())}</p>
              <p>{t.menu.noResultsHint}</p>
            </div>
          )}
        </section>
      ) : (
        <>
          <CategoryNav active={active} onSelect={select} />
          <div className="container menu-sections">
            {itemsByCategory.map((c) => {
              const orderable = c.items.filter((i) => !i.promo);
              const promos = c.items.filter((i) => i.promo);
              return (
                <section key={c.id} id={c.id} className="menu-section" aria-labelledby={`${c.id}-title`}>
                  <div className="menu-section__head">
                    <h2 id={`${c.id}-title`} className="menu-section__title">{localized(c.name, lang)}</h2>
                    <span className="menu-section__count">{t.home.itemsCount(c.items.length)}</span>
                  </div>
                  <div className="menu-grid">
                    {orderable.map((item) => (
                      <MenuCard key={item.id} item={item} />
                    ))}
                  </div>
                  {promos.length ? (
                    <div className="promo-row promo-row--menu">
                      {promos.map((item) => (
                        <PromoCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </>
      )}

      <button
        type="button"
        className={`to-top ${showTop ? 'is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t.menu.backToTop}
        tabIndex={showTop ? 0 : -1}
      >
        <Icon name="arrowUp" size={20} />
      </button>
    </div>
  );
}
