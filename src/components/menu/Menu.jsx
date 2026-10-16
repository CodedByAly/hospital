import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { allItems, menuGroups } from '../../data/menu';
import { useUI } from '../../context/UIContext';
import { pluralize } from '../../lib/format';
import Icon from '../Icon';
import MenuCard from './MenuCard';
import MenuRow from './MenuRow';
import { useQuickAdd } from './useQuickAdd';
import './Menu.css';

const normalize = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ');

const layoutFor = (category) => {
  const withPhotos = category.items.filter((it) => it.image).length;
  return withPhotos / category.items.length >= 0.5 ? 'grid' : 'list';
};

function CategorySection({ category, onOpen, onAdd }) {
  const layout = layoutFor(category);
  const items = category.items.map((it) => ({ ...it, categoryName: category.name }));
  return (
    <section className={`menu-cat menu-cat--${layout}`} id={`cat-${category.id}`} data-cat={category.id} aria-labelledby={`cat-${category.id}-title`}>
      <header className="menu-cat__head">
        <h3 id={`cat-${category.id}-title`} className="menu-cat__title">
          {category.name}
        </h3>
        <span className="menu-cat__count">{pluralize(category.items.length, 'item')}</span>
      </header>
      {layout === 'grid' ? (
        <div className="menu-grid">
          {items.map((item, i) => (
            <MenuCard key={item.id} item={item} onOpen={onOpen} onAdd={onAdd} index={i} />
          ))}
        </div>
      ) : (
        <ul className="menu-list">
          {items.map((item) => (
            <MenuRow key={item.id} item={item} onOpen={onOpen} onAdd={onAdd} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Menu() {
  const { openItem, searchInput } = useUI();
  const quickAdd = useQuickAdd();
  const [groupId, setGroupId] = useState(menuGroups[0].id);
  const [activeCat, setActiveCat] = useState(menuGroups[0].categories[0].id);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [turn, setTurn] = useState('next');
  const toolbarRef = useRef(null);
  const chipsRef = useRef(null);
  const sectionRef = useRef(null);

  const group = menuGroups.find((g) => g.id === groupId);
  const searching = deferredQuery.trim().length > 0;

  const results = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    // Match from the start of words, so "latte" finds lattes but not "platter".
    return allItems.filter((item) => {
      const words = normalize(`${item.name} ${item.description ?? ''} ${item.categoryName}`).split(/\s+/);
      return terms.every((t) => words.some((w) => w.startsWith(t)));
    });
  }, [deferredQuery]);

  const onOpen = (item) => openItem(item.id);

  // Scroll-spy: highlight the category currently under the toolbar.
  useEffect(() => {
    if (searching) return undefined;
    const sections = [...document.querySelectorAll('.menu-cat[data-cat]')];
    if (!('IntersectionObserver' in window) || sections.length === 0) return undefined;
    const offset = (toolbarRef.current?.getBoundingClientRect().bottom ?? 120) + 8;
    // The observer only reports sections that changed, so remember all of them
    // and pick the first one (in page order) that is currently in the band.
    const inView = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => inView.set(e.target.dataset.cat, e.isIntersecting));
        const first = sections.find((s) => inView.get(s.dataset.cat));
        if (first) setActiveCat(first.dataset.cat);
      },
      { rootMargin: `-${Math.round(offset)}px 0px -55% 0px` }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [groupId, searching]);

  // Keep the active chip visible inside the horizontal chip rail.
  useEffect(() => {
    const rail = chipsRef.current;
    const chip = rail?.querySelector(`[data-chip="${activeCat}"]`);
    if (!rail || !chip) return;
    const left = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [activeCat, groupId]);

  const scrollToMenuTop = (instant = false) => {
    const top = sectionRef.current?.querySelector('.menu__body')?.getBoundingClientRect().top ?? 0;
    const toolbarH = toolbarRef.current?.getBoundingClientRect().height ?? 0;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    if (top < headerH + toolbarH) {
      window.scrollTo({ top: window.scrollY + top - headerH - toolbarH - 8, behavior: instant ? 'instant' : 'smooth' });
    }
  };

  const selectGroup = (id) => {
    if (id === groupId) return;
    const from = menuGroups.findIndex((g) => g.id === groupId);
    const to = menuGroups.findIndex((g) => g.id === id);
    setTurn(to > from ? 'next' : 'prev');
    setGroupId(id);
    setActiveCat(menuGroups[to].categories[0].id);
    setQuery('');
    scrollToMenuTop();
  };

  const goToCategory = (catId) => {
    const el = document.getElementById(`cat-${catId}`);
    if (!el) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 60;
    const toolbarH = toolbarRef.current?.getBoundingClientRect().height ?? 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH - toolbarH - 4, behavior: 'smooth' });
    setActiveCat(catId);
  };

  return (
    <section className="menu section" id="menu" ref={sectionRef} aria-labelledby="menu-title">
      <div className="container">
        <header className="menu__intro">
          <p className="eyebrow">The menu</p>
          <h2 id="menu-title" className="section-title">
            From the kitchen <em>and the bar.</em>
          </h2>
          <p className="lede">
            Prices are in US dollars. Tap a dish to see it up close, then add it to your table&rsquo;s order.
          </p>
        </header>
      </div>

      <div className="menu__toolbar" ref={toolbarRef}>
        <div className="container">
          <div className="menu__toolbar-row">
            <div className="menu__groups" role="tablist" aria-label="Menu sections">
              {menuGroups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={!searching && g.id === groupId}
                  aria-controls="menu-panel"
                  className={`menu__group ${!searching && g.id === groupId ? 'is-active' : ''}`}
                  onClick={() => selectGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="menu__search">
              <Icon name="search" size={18} />
              <label htmlFor="menu-search" className="visually-hidden">
                Search the menu
              </label>
              <input
                id="menu-search"
                ref={searchInput}
                type="search"
                placeholder="Search dishes and drinks"
                value={query}
                onChange={(e) => {
                  const next = e.target.value;
                  // Results are shorter than a full menu page: keep the toolbar in view
                  // instead of letting the browser drop the guest at the footer.
                  if (!query.trim() !== !next.trim()) scrollToMenuTop(true);
                  setQuery(next);
                }}
                autoComplete="off"
                enterKeyHint="search"
              />
              {query && (
                <button
                  type="button"
                  className="menu__search-clear"
                  onClick={() => {
                    scrollToMenuTop(true);
                    setQuery('');
                    searchInput.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>

          {!searching && group.categories.length > 1 && (
            <div className="menu__chips" ref={chipsRef} aria-label={`${group.label} categories`}>
              {group.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-chip={c.id}
                  className={`menu__chip ${c.id === activeCat ? 'is-active' : ''}`}
                  aria-current={c.id === activeCat ? 'true' : undefined}
                  onClick={() => goToCategory(c.id)}
                >
                  {c.short || c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container menu__body" id="menu-panel" role="tabpanel" aria-label={searching ? 'Search results' : group.label}>
        {searching ? (
          <div className="menu__results" aria-live="polite">
            <p className="menu__results-count">
              {results.length > 0
                ? `${pluralize(results.length, 'match', 'matches')} for “${deferredQuery.trim()}”`
                : ''}
            </p>
            {results.length > 0 ? (
              <ul className="menu-list menu-list--results">
                {results.map((item) => (
                  <MenuRow key={item.id} item={item} onOpen={onOpen} onAdd={quickAdd} showCategory />
                ))}
              </ul>
            ) : (
              <div className="menu__empty">
                <p className="menu__empty-title">Nothing on the menu matches &ldquo;{deferredQuery.trim()}&rdquo;.</p>
                <p>Try a shorter word, like &ldquo;latte&rdquo;, &ldquo;cheese&rdquo; or &ldquo;mojito&rdquo;.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setQuery('')}>
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`menu__page menu__page--${turn}`} key={groupId}>
            {group.categories.map((c) => (
              <CategorySection key={c.id} category={c} onOpen={onOpen} onAdd={quickAdd} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
