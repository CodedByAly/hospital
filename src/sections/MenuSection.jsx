import { useEffect, useMemo, useRef, useState } from 'react'
import MenuItemCard from '../components/MenuItemCard'
import Icon from '../components/Icon'
import { categories, menu } from '../data/menu'

const normalise = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and')

export default function MenuSection() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(categories[0].id)
  const tabsRef = useRef(null)
  const lockSpy = useRef(false)

  const q = normalise(query.trim())
  const groups = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: menu.filter(
          (item) =>
            item.category === cat.id &&
            (!q || normalise(`${item.name} ${item.fullName || ''} ${item.description || ''} ${cat.name}`).includes(q)),
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [q])
  const resultCount = groups.reduce((n, g) => n + g.items.length, 0)

  // Highlight the category currently under the sticky bar.
  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-category]')]
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        if (lockSpy.current) return
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.dataset.category)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [groups])

  // Keep the active tab in view inside the horizontal tab strip.
  useEffect(() => {
    const strip = tabsRef.current
    const tab = strip?.querySelector(`[data-tab="${active}"]`)
    if (!strip || !tab) return
    const left = tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2
    strip.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  function jumpTo(id) {
    setActive(id)
    lockSpy.current = true
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => (lockSpy.current = false), 800)
  }

  return (
    <section id="menu" className="menu section" aria-labelledby="menu-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Order for pickup or delivery</p>
          <h2 id="menu-title" className="display">The Menu</h2>
          <p className="section-head__lead">Prices in US dollars. Tap any dish to choose options, leave things out or add a side.</p>
          <label className="menu__search">
            <Icon name="search" size={18} />
            <span className="sr-only">Search the menu</span>
            <input type="search" placeholder="Search shrimp, chicken, fries..." value={query} onChange={(e) => setQuery(e.target.value)} />
            {query && (
              <button type="button" className="menu__search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                <Icon name="close" size={15} />
              </button>
            )}
          </label>
        </header>
      </div>

      <div className="menu__bar">
        <div className="container menu__bar-inner">
          <nav className="menu__tabs" ref={tabsRef} aria-label="Menu categories">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                data-tab={g.id}
                aria-current={active === g.id ? 'true' : undefined}
                className="menu__tab"
                onClick={() => jumpTo(g.id)}
              >
                {g.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container">
        {q && (
          <p className="menu__results" role="status">
            {resultCount ? `${resultCount} ${resultCount === 1 ? 'dish' : 'dishes'} found for “${query.trim()}”` : ''}
          </p>
        )}

        {groups.length === 0 ? (
          <div className="menu__empty">
            <p className="menu__empty-title">Nothing matches “{query.trim()}”.</p>
            <p>Try shrimp, chicken, crab or fries.</p>
            <button type="button" className="btn btn--ghost" onClick={() => setQuery('')}>
              Show the full menu
            </button>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.id} id={`cat-${g.id}`} data-category={g.id} className="menu__group" aria-labelledby={`cat-title-${g.id}`}>
              <div className="menu__group-head">
                <h3 id={`cat-title-${g.id}`} className="menu__group-title">{g.name}</h3>
                {g.blurb && <p className="menu__group-blurb">{g.blurb}</p>}
              </div>
              <div className="menu__grid">
                {g.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} hideDescription={item.description === g.blurb} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </section>
  )
}
