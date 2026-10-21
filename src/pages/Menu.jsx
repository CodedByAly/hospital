import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { IconClose, IconPlus, IconSearch } from '../components/Icons.jsx'
import { useCart } from '../context/CartContext.jsx'
import { categories } from '../data/menu.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { flyToCart } from '../lib/fly.js'
import { formatPrice } from '../lib/format.js'
import { defaultSelections, missingGroups } from '../lib/pricing.js'

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '')

export default function Menu() {
  usePageMeta('Menu', 'The full Jungs menu with prices: appetizers, beef subs, burgers, chicken burgers, salads, chicken sandwiches, meal offers and drinks.')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(categories[0].id)
  const tabsRef = useRef(null)
  const location = useLocation()

  const results = useMemo(() => {
    const q = normalize(query.trim())
    const withTone = categories.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i, tone: c.tone, categoryId: c.id })) }))
    if (!q) return withTone
    return withTone
      .map((c) => ({
        ...c,
        items: normalize(c.name).includes(q)
          ? c.items
          : c.items.filter((i) => normalize(`${i.name} ${i.description ?? ''}`).includes(q)),
      }))
      .filter((c) => c.items.length)
  }, [query])

  const resultCount = results.reduce((n, c) => n + c.items.length, 0)

  // Jump to a section when arriving with /menu#section.
  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id) return
    const el = document.getElementById(id)
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
  }, [location.hash])

  // Highlight the section currently under the sticky bar.
  useEffect(() => {
    const sections = [...document.querySelectorAll('.menu-section')]
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [results])

  // Keep the active tab in view inside the horizontal tab strip.
  useEffect(() => {
    const strip = tabsRef.current
    const tab = strip?.querySelector(`[data-tab="${active}"]`)
    if (!strip || !tab) return
    const left = tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2
    strip.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="menu-page">
      <header className="menu-hero">
        <div className="container menu-hero__inner">
          <div>
            <h1 className="menu-hero__title">The menu</h1>
          </div>
          <div className="search">
            <IconSearch size={18} className="search__icon" />
            <label htmlFor="menu-search" className="visually-hidden">
              Search the menu
            </label>
            <input
              id="menu-search"
              type="search"
              placeholder="Search burgers, salads, fries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <IconClose size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="menu-tabs" aria-label="Menu sections">
        <div className="container">
          <ul ref={tabsRef} className="menu-tabs__strip">
            {results.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  data-tab={c.id}
                  className={`menu-tab ${active === c.id ? 'is-active' : ''}`}
                  aria-current={active === c.id ? 'true' : undefined}
                  onClick={() => jumpTo(c.id)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="container menu-body">
        <p className="visually-hidden" aria-live="polite">
          {query ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'} for ${query}` : ''}
        </p>

        {results.length === 0 ? (
          <div className="menu-empty">
            <p className="menu-empty__title">Nothing matches &ldquo;{query}&rdquo;</p>
            <p>Try another word, like &ldquo;chicken&rdquo; or &ldquo;fries&rdquo;.</p>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
              Show the full menu
            </button>
          </div>
        ) : (
          results.map((c) => <MenuSection key={c.id} category={c} />)
        )}
      </div>
    </div>
  )
}

function MenuSection({ category }) {
  return (
    <section id={category.id} className={`menu-section tone-${category.tone}`} aria-labelledby={`${category.id}-title`}>
      <header className="menu-section__head">
        <h2 id={`${category.id}-title`} className="menu-section__title">
          {category.name}
        </h2>
        {category.note && <p className="menu-section__note">{category.note}</p>}
      </header>
      <ul className="menu-list">
        {category.items.map((item) => (
          <MenuRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}

function MenuRow({ item }) {
  const { add, openItem } = useCart()
  const needsChoice = missingGroups(item, defaultSelections(item)).length > 0

  const quickAdd = (e) => {
    if (needsChoice) {
      openItem(item.id)
      return
    }
    add({ itemId: item.id, qty: 1, selections: defaultSelections(item), removed: [] })
    flyToCart(e.currentTarget)
  }

  return (
    <li className="menu-row">
      <button type="button" className="menu-row__open" onClick={() => openItem(item.id)}>
        <span className="menu-row__name">
          {item.name}
          {item.portion && <span className="menu-row__portion">{item.portion}</span>}
        </span>
        {item.description && <span className="menu-row__desc">{item.description}</span>}
        {item.calories && <span className="menu-row__kcal">{item.calories}</span>}
      </button>
      <span className="menu-row__price">{formatPrice(item.price)}</span>
      <button
        type="button"
        className="menu-row__add"
        onClick={quickAdd}
        aria-label={needsChoice ? `Choose options for ${item.name}` : `Add ${item.name} to order`}
      >
        <IconPlus size={18} />
      </button>
    </li>
  )
}
