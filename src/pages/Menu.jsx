import { useEffect, useMemo, useRef, useState } from 'react'
import { categories, fullMenuOffer, menuItems } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { t } from '../content/text'
import { formatPrice, toCents } from '../lib/price'
import { flyToCart } from '../lib/flyToCart'
import MenuRow from '../components/MenuRow'
import Icon from '../components/Icon'
import './Menu.css'

const normalize = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const searchIndex = menuItems.map((item) => ({
  item,
  text: normalize(
    [item.name, item.description, ...(item.groups ?? []).flatMap((g) => g.options.map((o) => o.name))].join(' '),
  ),
}))

export default function Menu() {
  const { mode, setMode, canOrder, openCart } = useUI()
  const cart = useCart()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(categories[0].id)
  const tabsRef = useRef(null)
  const sectionsRef = useRef({})

  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const results = useMemo(() => {
    if (!terms.length) return menuItems
    return searchIndex.filter(({ text }) => terms.every((term) => text.includes(term))).map(({ item }) => item)
  }, [terms.join(' ')])

  const visibleCategories = categories.filter((c) => results.some((item) => item.category === c.id))

  // Highlight the category currently in view.
  useEffect(() => {
    const sections = visibleCategories.map((c) => sectionsRef.current[c.id]).filter(Boolean)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.dataset.category)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [visibleCategories.map((c) => c.id).join()])

  // Keep the active tab visible in the horizontal strip on small screens.
  useEffect(() => {
    const strip = tabsRef.current
    const tab = strip?.querySelector(`[data-tab="${active}"]`)
    if (!strip || !tab || strip.scrollWidth <= strip.clientWidth) return
    const offset = tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2
    strip.scrollTo({ left: offset, behavior: 'smooth' })
  }, [active])

  const jumpTo = (id) => {
    setActive(id)
    sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const offerRef = useRef(null)
  const addOffer = () => {
    cart.add(fullMenuOffer.id, {}, 1)
    flyToCart(offerRef.current, null)
  }

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <div className="container menu-hero__inner">
          <div>
            <h1>{t('menu.title')}</h1>
            <p className="menu-hero__lead">{t('menu.lead')}</p>
          </div>
          <div className="menu-hero__tools">
            <div className="mode-toggle" role="radiogroup" aria-label={t('menu.modeLabel')}>
              {[
                ['delivery', t('menu.delivery'), 'scooter'],
                ['dine-in', t('menu.dineIn'), 'pin'],
              ].map(([value, label, icon]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={mode === value}
                  className={mode === value ? 'is-active' : ''}
                  onClick={() => setMode(value)}
                >
                  <Icon name={icon} size={18} /> {label}
                </button>
              ))}
            </div>
            <label className="menu-search">
              <span className="visually-hidden">{t('menu.searchLabel')}</span>
              <Icon name="search" size={19} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('menu.searchPlaceholder')}
                enterKeyHint="search"
                autoComplete="off"
              />
              {query && (
                <button type="button" className="menu-search__clear" onClick={() => setQuery('')} aria-label={t('menu.clearSearch')}>
                  <Icon name="close" size={16} />
                </button>
              )}
            </label>
          </div>
        </div>
      </section>

      <div className="menu-tabs" ref={tabsRef}>
        <nav className="container menu-tabs__inner" aria-label={t('menu.categories')}>
          {visibleCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              data-tab={c.id}
              className={active === c.id ? 'is-active' : ''}
              aria-current={active === c.id ? 'true' : undefined}
              onClick={() => jumpTo(c.id)}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="container menu-body">
        {!canOrder && (
          <p className="menu-dinein">
            <Icon name="info" size={18} /> {t('menu.dineInNote')}
          </p>
        )}

        {terms.length > 0 && (
          <p className="menu-results" role="status">
            {results.length === 1
              ? t('menu.result', { query: query.trim() })
              : results.length > 1
                ? t('menu.results', { count: results.length, query: query.trim() })
                : ''}
          </p>
        )}

        {results.length === 0 && (
          <div className="menu-empty" role="status">
            <Icon name="search" size={28} />
            <h2>{t('menu.noResults', { query: query.trim() })}</h2>
            <p>{t('menu.noResultsHint')}</p>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
              {t('menu.clearSearch')}
            </button>
          </div>
        )}

        {visibleCategories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            data-category={category.id}
            className="menu-section"
            ref={(el) => (sectionsRef.current[category.id] = el)}
            aria-labelledby={`cat-${category.id}`}
          >
            <header className="menu-section__head">
              <h2 id={`cat-${category.id}`}>
                {category.name}
                {category.by && (
                  <span className="menu-section__by">
                    {t('menu.by')} {category.by}
                  </span>
                )}
              </h2>
              {category.note && <p className="menu-section__note">{category.note}</p>}
            </header>
            <div className={`menu-grid menu-grid--${category.id}`}>
              {results
                .filter((item) => item.category === category.id)
                .map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
            </div>
          </section>
        ))}

        {!terms.length && (
          <aside className="menu-offer" aria-labelledby="offer-title">
            <p className="menu-offer__tag">{t('menu.offerTag')}</p>
            <h2 id="offer-title">
              {t('home.offerTitle')} <span className="num">{formatPrice(toCents(fullMenuOffer.price))}</span>
            </h2>
            <p>{fullMenuOffer.description}</p>
            {canOrder && (
              <button type="button" className="btn btn--primary" onClick={addOffer} ref={offerRef}>
                <Icon name="plus" size={18} /> {t('home.offerCta')}
              </button>
            )}
          </aside>
        )}
      </div>

      {canOrder && cart.count > 0 && (
        <div className="order-bar">
          <button type="button" className="order-bar__btn" onClick={openCart}>
            <span className="order-bar__count num">{cart.count}</span>
            <span>{t('cart.view')}</span>
            <span className="num">{formatPrice(cart.subtotalCents)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
