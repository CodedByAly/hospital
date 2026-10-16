import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { img } from '../data/menu';
import { BoxBunLogo } from './Logo';
import Icon from './Icon';
import './Menu.css';

const money = (v) => `${Number.isInteger(v) ? v : v.toFixed(1).replace(/\.0$/, '')}$`;
const normalize = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ');

function Price({ item }) {
  if (item.sizes) {
    return (
      <span className="row__price">
        <span>
          <span className="dot dot--s" aria-hidden="true" />
          <span className="visually-hidden">Small </span>
          {money(item.sizes[0])}
        </span>
        <span>
          <span className="dot dot--l" aria-hidden="true" />
          <span className="visually-hidden">Large </span>
          {money(item.sizes[1])}
        </span>
      </span>
    );
  }
  return <span className="row__price">{money(item.price)}</span>;
}

function Row({ item, category }) {
  return (
    <li className="row">
      <div className="row__head">
        <span className="row__name">{item.name}</span>
        <span className="row__leader" aria-hidden="true" />
        <Price item={item} />
      </div>
      {category && <p className="row__cat">{category}</p>}
      {item.note && <p className="row__note">{item.note}</p>}
      {item.lines && (
        <ul className="row__lines">
          {item.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

function GroupMark({ group }) {
  if (group.logo === 'boxbun') return <BoxBunLogo className="group-mark group-mark--bun" title="Box Bun" />;
  if (group.logo === 'cooked-creme') return <img className="group-mark" src={img('cooked-creme')} alt="Cooked Crème Crêpes" width="174" height="211" />;
  return null;
}

export default function Menu({ groups, request }) {
  const [groupId, setGroupId] = useState(groups[0].id);
  const [activeCat, setActiveCat] = useState(groups[0].categories[0].id);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const [turn, setTurn] = useState(0);
  const toolbarRef = useRef(null);
  const chipsRef = useRef(null);
  const bodyRef = useRef(null);
  const spyLock = useRef(0);

  const group = groups.find((g) => g.id === groupId) ?? groups[0];
  const searching = deferred.trim().length > 0;

  // the branch can change which groups exist (Box Bun is Zaarour only)
  useEffect(() => {
    if (!groups.some((g) => g.id === groupId)) {
      setGroupId(groups[0].id);
      setActiveCat(groups[0].categories[0].id);
    }
  }, [groups, groupId]);

  const results = useMemo(() => {
    const terms = normalize(deferred).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const out = [];
    groups.forEach((g) =>
      g.categories.forEach((c) =>
        c.items.forEach((item) => {
          const words = normalize(`${item.name} ${item.note ?? ''} ${(item.lines ?? []).join(' ')} ${c.name}`).split(/\s+/);
          if (terms.every((t) => words.some((w) => w.startsWith(t)))) out.push({ item, category: c.name, key: `${c.id}-${item.name}` });
        })
      )
    );
    return out;
  }, [deferred, groups]);

  const headerH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;

  const scrollToBodyTop = (instant) => {
    const top = bodyRef.current?.getBoundingClientRect().top ?? 0;
    const offset = headerH() + (toolbarRef.current?.offsetHeight ?? 0);
    if (top < offset || instant === 'force') {
      window.scrollTo({ top: window.scrollY + top - offset - 4, behavior: instant ? 'instant' : 'smooth' });
    }
  };

  // Layout position, ignoring any transform the page-turn animation is applying.
  const pageTop = (el) => {
    let y = 0;
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  };

  const goToCategory = (catId, behavior = 'smooth') => {
    const el = document.getElementById(`cat-${catId}`);
    if (!el) return;
    const offset = headerH() + (toolbarRef.current?.offsetHeight ?? 0);
    window.scrollTo({ top: pageTop(el) - offset - 4, behavior });
    // keep the chosen chip lit while the page scrolls past its neighbours
    spyLock.current = Date.now() + 1200;
    setActiveCat(catId);
  };

  const selectGroup = (id, then) => {
    if (id !== groupId) {
      setTurn((t) => t + 1);
      setGroupId(id);
      const g = groups.find((x) => x.id === id);
      setActiveCat(g.categories[0].id);
    }
    setQuery('');
    if (then) requestAnimationFrame(() => requestAnimationFrame(then));
    else scrollToBodyTop();
  };

  // jump requests from the 3D shelf
  useEffect(() => {
    if (!request) return;
    const g = groups.find((x) => x.categories.some((c) => c.id === request.category));
    if (!g) return;
    selectGroup(g.id, () => goToCategory(request.category));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  // scroll-spy for the category chips
  useEffect(() => {
    if (searching) return undefined;
    const sections = [...document.querySelectorAll('.cat[data-cat]')];
    if (!sections.length || !('IntersectionObserver' in window)) return undefined;
    const offset = headerH() + (toolbarRef.current?.offsetHeight ?? 100) + 8;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.dataset.cat, e.isIntersecting));
        const first = sections.find((s) => seen.get(s.dataset.cat));
        if (first && Date.now() > spyLock.current) setActiveCat(first.dataset.cat);
      },
      { rootMargin: `-${Math.round(offset)}px 0px -55% 0px` }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [groupId, searching]);

  useEffect(() => {
    const rail = chipsRef.current;
    const chip = rail?.querySelector(`[data-chip="${activeCat}"]`);
    if (rail && chip) rail.scrollTo({ left: Math.max(0, chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2), behavior: 'smooth' });
  }, [activeCat, groupId]);

  return (
    <section className="menu" id="menu" aria-label="Menu">
      <div className="menu__toolbar" ref={toolbarRef}>
        <div className="wrap">
          <div className="menu__top">
            <div className="menu__tabs" role="tablist" aria-label="Menu sections">
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={!searching && g.id === groupId}
                  className={`menu__tab ${!searching && g.id === groupId ? 'is-active' : ''} ${g.id === 'boxbun' ? 'menu__tab--bun' : ''}`}
                  onClick={() => selectGroup(g.id)}
                >
                  {g.short}
                </button>
              ))}
            </div>
            <label className="menu__search">
              <Icon name="search" size={18} />
              <span className="visually-hidden">Search the menu</span>
              <input
                id="menu-search"
                type="search"
                placeholder="Search the menu"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  const next = e.target.value;
                  if (!query.trim() !== !next.trim()) scrollToBodyTop(true);
                  setQuery(next);
                }}
              />
              {query && (
                <button type="button" className="menu__clear" onClick={() => setQuery('')} aria-label="Clear search">
                  <Icon name="close" size={16} />
                </button>
              )}
            </label>
          </div>
          {!searching && group.categories.length > 1 && (
            <div className="menu__chips" ref={chipsRef}>
              {group.categories.map((c) => (
                <button key={c.id} type="button" data-chip={c.id} className={`menu__chip ${c.id === activeCat ? 'is-active' : ''}`} onClick={() => goToCategory(c.id)}>
                  {c.short || c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="wrap menu__body" ref={bodyRef}>
        {searching ? (
          <div className="menu__results" aria-live="polite">
            {results.length ? (
              <>
                <p className="menu__count">
                  {results.length} {results.length === 1 ? 'match' : 'matches'} for &ldquo;{deferred.trim()}&rdquo;
                </p>
                <ul className="rows">
                  {results.map((r) => (
                    <Row key={r.key} item={r.item} category={r.category} />
                  ))}
                </ul>
              </>
            ) : (
              <div className="menu__empty">
                <p className="menu__empty-title">Nothing matches &ldquo;{deferred.trim()}&rdquo;</p>
                <p>Try &ldquo;latte&rdquo;, &ldquo;lotus&rdquo; or &ldquo;crepe&rdquo;.</p>
              </div>
            )}
          </div>
        ) : (
          <div className={`menu__page ${group.id === 'boxbun' ? 'menu__page--bun' : ''}`} key={`${group.id}-${turn}`}>
            <header className="menu__group-head">
              <GroupMark group={group} />
              <h2 className="menu__group-title">{group.label}</h2>
              {group.categories.some((c) => c.items.some((i) => i.sizes)) && (
                <p className="menu__legend">
                  <span>
                    <span className="dot dot--s" aria-hidden="true" />
                    Small
                  </span>
                  <span>
                    <span className="dot dot--l" aria-hidden="true" />
                    Large
                  </span>
                </p>
              )}
            </header>
            <div className="cats">
              {group.categories.map((c) => (
                <section key={c.id} className={`cat ${c.image ? 'cat--pic' : ''}`} id={`cat-${c.id}`} data-cat={c.id} aria-labelledby={`h-${c.id}`}>
                  <div className="cat__head">
                    <h3 id={`h-${c.id}`} className="cat__title brush">
                      {c.name}
                    </h3>
                    {c.image && <img className="cat__img" src={img(c.image)} alt="" loading="lazy" />}
                  </div>
                  {c.note && <p className="cat__note">{c.note}</p>}
                  <ul className="rows">
                    {c.items.map((item) => (
                      <Row key={item.name} item={item} />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            {group.footnote && (
              <aside className="menu__foot">
                <h3>{group.footnote.title}</h3>
                <p>{group.footnote.text}</p>
              </aside>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
