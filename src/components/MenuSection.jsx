import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { visibleMenu } from '../data/menu.js';
import { restaurant } from '../data/restaurant.js';
import { CloseIcon, SearchIcon } from './Icons.jsx';

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const formatPrice = (n) => n.toFixed(2);
const totalItems = visibleMenu.reduce((n, c) => n + c.items.length, 0);

function Highlight({ text, query }) {
  if (!query) return text;
  const i = normalize(text).indexOf(query);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export default function MenuSection() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const q = normalize(deferred.trim());
  const [active, setActive] = useState(visibleMenu[0]?.id);
  const chipsRef = useRef(null);
  const toolsRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const categories = useMemo(() => {
    if (!q) return visibleMenu;
    return visibleMenu
      .map((cat) => {
        const catHit = normalize(cat.name).includes(q);
        const items = catHit
          ? cat.items
          : cat.items.filter((it) => normalize(`${it.name} ${it.note ?? ''}`).includes(q));
        return { ...cat, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [q]);

  const total = categories.reduce((n, c) => n + c.items.length, 0);

  // While searching from further down the page, bring the results up under the search bar.
  useEffect(() => {
    const list = listRef.current;
    const tools = toolsRef.current;
    if (!q || !list || !tools) return;
    const stuckAt = parseFloat(getComputedStyle(tools).top) || 0;
    const target = window.scrollY + list.getBoundingClientRect().top - stuckAt - tools.offsetHeight - 8;
    if (window.scrollY > target) window.scrollTo({ top: target, behavior: 'instant' });
  }, [q]);

  // Scrollspy: the category crossing the middle of the screen is the active one.
  useEffect(() => {
    const sections = document.querySelectorAll('.menu-cat');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.cat));
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [categories]);

  // Keep the active chip visible inside the horizontal bar without moving the page.
  useEffect(() => {
    const bar = chipsRef.current;
    const chip = bar?.querySelector(`[data-chip="${active}"]`);
    if (!bar || !chip) return;
    const offset = chip.getBoundingClientRect().left - bar.getBoundingClientRect().left + bar.scrollLeft;
    bar.scrollTo({ left: offset - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' });
  }, [active]);

  // "/" jumps to search.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.target.closest('input, textarea, select')) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const jumpTo = (id) => {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="menu" className="menu" aria-labelledby="menu-title">
      <div className="container">
        <header className="menu__head">
          <div data-reveal>
            <p className="eyebrow">The menu</p>
            <h2 id="menu-title" className="section-title">
              From a Lebanese coffee <em>to a protein shake.</em>
            </h2>
          </div>
          <p className="menu__note" data-reveal>
            {totalItems} drinks across {visibleMenu.length} sections. All prices in US dollars.
          </p>
        </header>
      </div>

      <div className="menu__tools" ref={toolsRef}>
        <div className="container menu__tools-inner">
          <label className="menu-search">
            <SearchIcon />
            <span className="visually-hidden">Search the menu</span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search drinks, e.g. latte, matcha, mango"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="menu-search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <CloseIcon width={16} height={16} />
              </button>
            )}
          </label>
          <nav className="menu-chips" ref={chipsRef} aria-label="Menu sections">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                data-chip={c.id}
                className={`menu-chip ${active === c.id ? 'is-active' : ''}`}
                aria-current={active === c.id ? 'true' : undefined}
                onClick={() => jumpTo(c.id)}
              >
                {c.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container" ref={listRef}>
        <p className="menu__status" role="status" aria-live="polite">
          {q && total ? `${total} ${total === 1 ? 'drink matches' : 'drinks match'} "${deferred.trim()}"` : ''}
        </p>

        {categories.length === 0 ? (
          <div className="menu__empty">
            <p className="menu__empty-title">Nothing on the menu matches &ldquo;{deferred.trim()}&rdquo;.</p>
            <p>Try another word, or ask us at the bar.</p>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
              Show the full menu
            </button>
          </div>
        ) : (
          <div className="menu__list">
            {categories.map((cat) => (
              <section
                key={cat.id}
                id={`cat-${cat.id}`}
                data-cat={cat.id}
                className="menu-cat"
                data-reveal
                aria-labelledby={`cat-title-${cat.id}`}
              >
                <div className="menu-cat__aside">
                  <span className="menu-cat__index">
                    {String(visibleMenu.findIndex((c) => c.id === cat.id) + 1).padStart(2, '0')}
                  </span>
                  <h3 id={`cat-title-${cat.id}`} className="menu-cat__title">
                    {cat.name}
                  </h3>
                  <span className="menu-cat__count">
                    {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <ul className="menu-cat__items">
                  {cat.items.map((item, i) => (
                    <li key={`${item.name}-${item.note ?? ''}`} className="menu-item" style={{ '--i': i }}>
                      <span className="menu-item__name">
                        <Highlight text={item.name} query={q} />
                        {item.note && (
                          <span className="menu-item__note">
                            <Highlight text={item.note} query={q} />
                          </span>
                        )}
                      </span>
                      <span className="menu-item__dots" aria-hidden="true" />
                      <span className="menu-item__price">
                        <span className="visually-hidden">Price: </span>
                        {formatPrice(item.price)}
                        <span className="menu-item__cur">{restaurant.currency}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
