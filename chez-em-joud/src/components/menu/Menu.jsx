import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Dish from './Dish'
import { filterMenu } from './search'
import { CloseIcon, SearchIcon } from '../Icons'
import { categories } from '../../data/menu'
import './Menu.css'

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function Menu() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(categories[0].id)
  const [searchOpen, setSearchOpen] = useState(false)
  const [indicator, setIndicator] = useState(null)
  const chipsRef = useRef(null)
  const barRef = useRef(null)
  const inputRef = useRef(null)

  const visible = useMemo(() => filterMenu(categories, query), [query])
  const matchCount = query ? visible.reduce((n, c) => n + c.items.length, 0) : 0

  // Active category = the last one whose top has passed under the sticky bar.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const bar = barRef.current
      if (!bar) return
      const line = bar.getBoundingClientRect().bottom + 24
      const sections = document.querySelectorAll('.menu [data-cat]')
      let current = sections[0]?.dataset.cat
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= line) current = s.dataset.cat
      })
      if (current) setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [visible])

  const placeIndicator = useCallback(() => {
    const scroller = chipsRef.current
    const chip = scroller?.querySelector(`[data-chip="${active}"]`)
    if (!chip) return setIndicator(null)
    setIndicator({ x: chip.offsetLeft, w: chip.offsetWidth })
    scroller.scrollTo({ left: chip.offsetLeft - scroller.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' })
  }, [active])

  useIsoLayoutEffect(placeIndicator, [placeIndicator, visible])

  useEffect(() => {
    window.addEventListener('resize', placeIndicator)
    return () => window.removeEventListener('resize', placeIndicator)
  }, [placeIndicator])

  // Keep the first result right under the bar after the list changes height.
  useEffect(() => {
    if (!query) return
    const list = document.getElementById('menu-list')
    const bar = barRef.current
    if (!list || !bar) return
    const stickyTop = parseFloat(getComputedStyle(bar).top) || 0
    const target = list.getBoundingClientRect().top + window.scrollY - stickyTop - bar.offsetHeight - 8
    if (window.scrollY > target) window.scrollTo({ top: target, behavior: 'instant' })
  }, [query])

  const openSearch = () => {
    setSearchOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const closeSearch = () => {
    setQuery('')
    setSearchOpen(false)
  }

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <section className="menu" id="menu" aria-labelledby="menu-title">
      <div className="menu__intro wrap">
        <p className="eyebrow" data-reveal>
          Delivery &amp; pickup
        </p>
        <h2 id="menu-title" className="display section-title" data-reveal>
          The menu
        </h2>
        <p className="lede" data-reveal>
          Tap a dish to see what’s in it or leave something out, or hit the plus to add it straight
          to your order.
        </p>
      </div>

      <div className={`menu__bar${searchOpen ? ' is-searching' : ''}`} ref={barRef}>
        <div className="menu__bar-inner wrap">
          <nav className="chips" aria-label="Menu categories">
            <div className="chips__scroller" ref={chipsRef}>
              {visible.map((c) => (
                <a
                  key={c.id}
                  href={`#menu-${c.id}`}
                  className={`chip${active === c.id ? ' is-active' : ''}`}
                  aria-current={active === c.id ? 'true' : undefined}
                  data-chip={c.id}
                >
                  {c.title}
                </a>
              ))}
              {indicator && (
                <span
                  className="chips__indicator"
                  aria-hidden="true"
                  style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
                />
              )}
            </div>
          </nav>

          <div className="search" role="search">
            <label htmlFor="menu-search" className="sr-only">
              Search the menu
            </label>
            <SearchIcon className="search__icon" />
            <input
              ref={inputRef}
              id="menu-search"
              type="search"
              className="search__input"
              placeholder="Search dishes or ingredients"
              autoComplete="off"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && (query ? clearSearch() : closeSearch())}
            />
            {query && (
              <button type="button" className="search__clear" onClick={clearSearch} aria-label="Clear search">
                <CloseIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            className="search-toggle"
            onClick={searchOpen ? closeSearch : openSearch}
            aria-label={searchOpen ? 'Close search' : 'Search the menu'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>
      </div>

      <div className="menu__list wrap" id="menu-list">
        <p className="menu__status" aria-live="polite">
          {query && matchCount ? `${matchCount} ${matchCount === 1 ? 'dish' : 'dishes'} for “${query}”` : ''}
        </p>

        {visible.length === 0 && (
          <div className="menu__empty">
            <p className="display">Nothing by that name.</p>
            <p>We couldn’t find “{query}” on the menu. Try another word, like chicken or beef.</p>
            <button type="button" className="btn btn--ghost" onClick={clearSearch}>
              Show the full menu
            </button>
          </div>
        )}

        {visible.map((c) => (
          <section className="cat" key={c.id} id={`menu-${c.id}`} data-cat={c.id} aria-labelledby={`menu-${c.id}-title`}>
            <header className="cat__head">
              <h3 id={`menu-${c.id}-title`} className="cat__title">
                {c.title}
              </h3>
              <div className="rule" aria-hidden="true" />
            </header>
            <ul className="cat__items">
              {c.items.map((item) => (
                <Dish key={item.id} item={item} query={query} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
