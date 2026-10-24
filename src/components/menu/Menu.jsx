import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import MenuCategory from './MenuCategory'
import Specials from './Specials'
import { filterMenu } from './search'
import { CloseIcon, SearchIcon } from '../Icons'
import { groups, menu } from '../../data/menu'
import './Menu.css'

// useLayoutEffect warns during server rendering; fall back to useEffect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export default function Menu() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(menu[0].id)
  const [searchOpen, setSearchOpen] = useState(false)
  const chipsRef = useRef(null)
  const barRef = useRef(null)
  const inputRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  const visible = useMemo(() => filterMenu(menu, query), [query])
  const specials = visible.find((c) => c.group === null)
  const matchCount = query ? visible.reduce((n, c) => n + c.items.length, 0) : null

  // Scroll spy: the active category is the last one whose top has passed under the sticky bar.
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

  // Slide the underline to the active chip and keep that chip in view horizontally.
  const placeIndicator = useCallback(() => {
    const scroller = chipsRef.current
    const chip = scroller?.querySelector(`[data-chip="${active}"]`)
    if (!chip) return setIndicator(null)
    // Underline the label only, not the chip's padding
    const cs = getComputedStyle(chip)
    const pl = parseFloat(cs.paddingLeft)
    const pr = parseFloat(cs.paddingRight)
    setIndicator({ x: chip.offsetLeft + pl, w: chip.offsetWidth - pl - pr })
    const target = chip.offsetLeft - scroller.clientWidth / 2 + chip.offsetWidth / 2
    scroller.scrollTo({ left: target, behavior: 'smooth' })
  }, [active])

  useIsoLayoutEffect(placeIndicator, [placeIndicator, visible])

  useEffect(() => {
    window.addEventListener('resize', placeIndicator)
    return () => window.removeEventListener('resize', placeIndicator)
  }, [placeIndicator])

  // "/" jumps to search, like most sites with a search box.
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setSearchOpen(true)
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // After the list changes, make sure the top of the results sits right under the bar.
  // Done after render, because a short result list changes the page height.
  useEffect(() => {
    if (!query) return
    const list = document.getElementById('menu-list')
    const bar = barRef.current
    if (!list || !bar) return
    const headerH = parseFloat(getComputedStyle(bar).top) || 0
    const target = list.getBoundingClientRect().top + window.scrollY - headerH - bar.offsetHeight - 8
    if (window.scrollY > target) window.scrollTo({ top: target, behavior: 'instant' })
  }, [query])

  const clearSearch = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const closeSearch = () => {
    setQuery('')
    setSearchOpen(false)
  }

  return (
    <section className="menu" id="menu" aria-labelledby="menu-title">
      <div className="menu__intro wrap">
        <p className="eyebrow" data-reveal>
          Dine-in menu
        </p>
        <h2 id="menu-title" className="display section-title" data-reveal>
          The menu
        </h2>
        <p className="lede" data-reveal>
          Coffee first, then teas, shakes and juices, then something to eat. Every coffee can be made
          decaf. Prices are in US dollars.
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
              placeholder="Search the menu"
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
            onClick={() => {
              if (searchOpen) closeSearch()
              else {
                setSearchOpen(true)
                requestAnimationFrame(() => inputRef.current?.focus())
              }
            }}
            aria-label={searchOpen ? 'Close search' : 'Search the menu'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>
      </div>

      <div className="menu__list wrap" id="menu-list">
        <p className="menu__status" aria-live="polite">
          {query &&
            (matchCount
              ? `${matchCount} ${matchCount === 1 ? 'match' : 'matches'} for “${query}”`
              : '')}
        </p>

        {visible.length === 0 && (
          <div className="menu__empty">
            <p className="display">Nothing by that name.</p>
            <p>
              We couldn’t find “{query}” on the menu. Try another word, or just ask us at the café.
            </p>
            <button type="button" className="btn btn--ghost" onClick={clearSearch}>
              Show the full menu
            </button>
          </div>
        )}

        {specials && <Specials category={specials} query={query} />}

        {groups.map((g, gi) => {
          const cats = visible.filter((c) => c.group === g.id)
          if (!cats.length) return null
          return (
            <div className="group" key={g.id}>
              <h3 className="group__title">
                <span className="group__num">{String(gi + 1).padStart(2, '0')}</span>
                {g.title}
              </h3>
              <div className="group__cats">
                {cats.map((c) => (
                  <MenuCategory key={c.id} category={c} query={query} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
