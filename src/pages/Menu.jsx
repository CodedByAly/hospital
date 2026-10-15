import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { useUI } from '../context/UIContext';
import { addonGroups, ingredients, itemsById, itemsByCategory } from '../data/menu';
import { platDuJour } from '../data/highlights';
import { whatsappLink } from '../lib/whatsapp';
import usePageMeta from '../lib/usePageMeta';
import DishRow from '../components/DishRow';
import Icon from '../components/Icon';
import LeafPattern from '../components/LeafPattern';
import Price from '../components/Price';
import './Menu.css';

const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ًͯ-ْ]/g, '') // Latin accents + Arabic diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

const searchIndex = itemsByCategory.flatMap((category) =>
  category.items.map((item) => ({
    item,
    text: normalize(
      [
        item.name.en,
        item.name.ar,
        item.description?.en,
        item.description?.ar,
        category.name.en,
        category.name.ar,
        ...(item.removable || []).flatMap((id) => [ingredients[id].en, ingredients[id].ar]),
      ].join(' '),
    ),
  })),
);

function Extras() {
  const { t, pick } = useI18n();
  return (
    <aside className="menu-extras" aria-labelledby="extras-title">
      <div className="menu-extras__box">
        <h2 id="extras-title" className="menu-extras__title">{t('menu.extrasTitle')}</h2>
        <p className="menu-extras__text">{t('menu.extrasText')}</p>
        <div className="menu-extras__groups">
          {Object.values(addonGroups).map((group) => (
            <div key={group.id}>
              <h3>{pick(group.name)}</h3>
              <ul>
                {group.options.map((option) => (
                  <li key={option.id}>
                    <span>{pick(option.name)}</span>
                    <Price value={option.price} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="menu-plat">
        <LeafPattern className="menu-plat__pattern" />
        <h2>{pick(platDuJour.title)}</h2>
        <p>{pick(platDuJour.text)}</p>
        <a className="btn btn--light btn--sm" href={whatsappLink(`Hi Life Kitchen, what's today's plat du jour?`)} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={18} /> {t('home.askOnWhatsapp')}
        </a>
      </div>
    </aside>
  );
}

export default function Menu() {
  const { t, pick } = useI18n();
  const { openItem } = useUI();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState(itemsByCategory[0].id);
  const toolbarRef = useRef(null);
  const tabsRef = useRef(null);
  const searchRef = useRef(null);
  const clickScrolling = useRef(false);

  usePageMeta(t('meta.menuTitle'), t('meta.menuDescription'));

  // Deep link: /menu?item=crunch-combo opens that dish.
  useEffect(() => {
    const id = params.get('item');
    if (id && itemsById[id]) {
      openItem(id);
      params.delete('item');
      setParams(params, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const trimmed = query.trim();
  const results = useMemo(() => {
    if (!trimmed) return null;
    const terms = normalize(trimmed).split(/\s+/).filter(Boolean);
    return searchIndex.filter(({ text }) => terms.every((term) => text.includes(term))).map(({ item }) => item);
  }, [trimmed]);

  const toolbarOffset = () => {
    const header = document.querySelector('.site-header');
    return (header?.offsetHeight || 0) + (toolbarRef.current?.offsetHeight || 0) + 4;
  };

  const scrollToCategory = useCallback((id, smooth = true) => {
    const section = document.getElementById(id);
    if (!section) return;
    clickScrolling.current = true;
    setActive(id);
    const top = section.getBoundingClientRect().top + window.scrollY - toolbarOffset();
    window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
    window.setTimeout(() => {
      clickScrolling.current = false;
    }, 700);
    navigate({ hash: id }, { replace: true });
  }, [navigate]);

  // Land on the right section when arriving with /menu#burgers.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && document.getElementById(id)) {
      requestAnimationFrame(() => scrollToCategory(id, false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scrollspy: highlight the category currently under the toolbar.
  useEffect(() => {
    if (results) return undefined;
    const onScroll = () => {
      if (clickScrolling.current) return;
      const line = toolbarOffset() + 24;
      let current = itemsByCategory[0].id;
      itemsByCategory.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [results]);

  // Keep the active tab visible in the horizontal tab bar.
  useEffect(() => {
    const bar = tabsRef.current;
    const tab = bar?.querySelector(`[data-id="${active}"]`);
    if (!bar || !tab) return;
    const barRect = bar.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    if (tabRect.left < barRect.left + 16 || tabRect.right > barRect.right - 16) {
      bar.scrollBy({ left: tabRect.left - barRect.left - barRect.width / 2 + tabRect.width / 2, behavior: 'smooth' });
    }
  }, [active]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = () => {
    setQuery('');
    setSearchOpen(false);
  };

  return (
    <>
      <header className="page-hero menu-hero">
        <div className="container">
          <span className="eyebrow">Life Kitchen</span>
          <h1>{t('menu.title')}</h1>
          <p className="lead">{t('menu.lead')}</p>
        </div>
      </header>

      <div className={`menu-toolbar ${searchOpen ? 'is-searching' : ''}`} ref={toolbarRef}>
        <div className="container menu-toolbar__inner">
          <button
            type="button"
            className="menu-toolbar__search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label={t('menu.search')}
            aria-expanded={searchOpen}
          >
            <Icon name="search" size={20} />
          </button>

          <nav className="menu-tabs" aria-label={t('menu.categories')} ref={tabsRef}>
            <ul>
              {itemsByCategory.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    data-id={category.id}
                    className={`menu-tabs__tab ${!results && active === category.id ? 'is-active' : ''}`}
                    aria-current={!results && active === category.id ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (results) setQuery('');
                      requestAnimationFrame(() => scrollToCategory(category.id));
                    }}
                  >
                    {pick(category.name)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-search" role="search">
            <Icon name="search" size={18} className="menu-search__icon" />
            <label htmlFor="menu-search" className="sr-only">{t('menu.search')}</label>
            <input
              ref={searchRef}
              id="menu-search"
              type="search"
              className="menu-search__input"
              placeholder={t('menu.searchPlaceholder')}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) window.scrollTo({ top: Math.min(window.scrollY, document.querySelector('.menu-body')?.offsetTop - toolbarOffset()) });
              }}
              onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
              autoComplete="off"
              enterKeyHint="search"
            />
            {(query || searchOpen) && (
              <button type="button" className="menu-search__clear" onClick={closeSearch} aria-label={t('menu.clearSearch')}>
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="menu-body container">
        {results ? (
          <section className="menu-results" aria-live="polite">
            <p className="menu-results__count">
              {results.length === 1
                ? t('menu.result', { query: trimmed })
                : t('menu.results', { count: results.length, query: trimmed })}
            </p>
            {results.length ? (
              <div className="menu-grid">
                {results.map((item) => <DishRow key={item.id} item={item} headingLevel={2} />)}
              </div>
            ) : (
              <div className="menu-empty">
                <h2>{t('menu.noResults', { query: trimmed })}</h2>
                <p>{t('menu.noResultsHint')}</p>
                <button type="button" className="btn btn--ghost" onClick={closeSearch}>{t('menu.clearSearch')}</button>
              </div>
            )}
          </section>
        ) : (
          itemsByCategory.map((category) => (
            <div key={category.id}>
              {category.id === 'beverages' && <Extras />}
              <section id={category.id} className="menu-section" aria-labelledby={`${category.id}-title`}>
                <h2 id={`${category.id}-title`} className="menu-section__title">{pick(category.name)}</h2>
                <div className="menu-grid">
                  {category.items.map((item) => <DishRow key={item.id} item={item} />)}
                </div>
              </section>
            </div>
          ))
        )}
      </div>
    </>
  );
}
