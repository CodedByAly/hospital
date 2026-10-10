import { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Flame, Search, ThumbsUp, X } from 'lucide-react'
import { CATEGORIES, MENU } from '../data/menu.js'
import MenuCard from './MenuCard.jsx'
import FlyingItems from './FlyingItems.jsx'
import { Soda } from './FoodIcons.jsx'

const FLYERS = [
  { type: 'Fries', x: '93%', y: '2%', size: 84, depth: 2, rotate: 14, hideMobile: true },
  { type: 'Burger', x: '-3%', y: '30%', size: 96, depth: 3, rotate: -16, hideMobile: true },
  { type: 'Soda', x: '95%', y: '60%', size: 76, depth: 1, rotate: 10, hideMobile: true },
]

export default function MenuSection({ onAdded }) {
  const [cat, setCat] = useState('wraps')
  const [query, setQuery] = useState('')
  const [fav, setFav] = useState(false)
  const [spicy, setSpicy] = useState(false)
  const q = useDeferredValue(query.trim().toLowerCase())
  const grid = useRef(null)

  // A search looks across the whole menu; otherwise show the active tab
  const items = useMemo(
    () =>
      MENU.filter((m) => (q ? true : m.cat === cat))
        .filter((m) => !q || `${m.name} ${m.desc}`.toLowerCase().includes(q))
        .filter((m) => !fav || m.tags?.includes('fav'))
        .filter((m) => !spicy || m.tags?.includes('spicy')),
    [cat, q, fav, spicy],
  )
  const active = CATEGORIES.find((c) => c.id === cat)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(grid.current.children, {
        opacity: 0, y: 40, scale: 0.94, duration: 0.5, stagger: 0.05, ease: 'back.out(1.4)',
      })
    })
    return () => mm.revert()
  }, [items])

  const reset = () => {
    setQuery('')
    setFav(false)
    setSpicy(false)
  }

  return (
    <section className="menu section" id="menu" aria-labelledby="menu-title">
      <FlyingItems items={FLYERS} mouse={false} />
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">The menu</p>
          <h2 id="menu-title">Pick your bite</h2>
          <p className="section__lead">Choose a size, add a Meal Booster and build your order. We'll send it over WhatsApp.</p>
        </header>

        <div className="menu__bar">
          <div className="tabs" role="tablist" aria-label="Menu categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={!q && cat === c.id}
                className={!q && cat === c.id ? 'is-on' : ''}
                onClick={() => {
                  setCat(c.id)
                  setQuery('')
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="menu__tools">
            <label className="search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Search the menu</span>
              <input
                type="search"
                placeholder="Search tawook, burger, fries…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </label>
            <button className={`chip ${fav ? 'is-on' : ''}`} aria-pressed={fav} onClick={() => setFav((v) => !v)}>
              <ThumbsUp size={16} aria-hidden="true" /> Favourites
            </button>
            <button className={`chip ${spicy ? 'is-on' : ''}`} aria-pressed={spicy} onClick={() => setSpicy((v) => !v)}>
              <Flame size={16} aria-hidden="true" /> Spicy
            </button>
          </div>
        </div>

        <p className={`menu__status ${q ? '' : 'sr-only'}`} aria-live="polite">
          {q ? `${items.length} result${items.length === 1 ? '' : 's'} for “${query.trim()}”` : `Showing ${active.label}`}
        </p>

        <div className="menu__grid" ref={grid}>
          {!q && (
            <div className="cat-banner" key={`banner-${cat}`}>
              <div className="cat-banner__text">
                <h3>{active.label}</h3>
                <p>{active.blurb}</p>
              </div>
              {active.img ? (
                <img src={`/images/${active.img}.webp`} alt="" />
              ) : (
                <Soda className="cat-banner__art" />
              )}
            </div>
          )}
          {items.map((item) => (
            <MenuCard key={item.id} item={item} onAdded={onAdded} />
          ))}
        </div>

        {items.length === 0 && (
          <div className="empty">
            <p>Nothing matches that yet. Try “tawook”, “burger” or “fries”, or clear your filters.</p>
            <button className="btn btn--primary btn--small" onClick={reset}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
