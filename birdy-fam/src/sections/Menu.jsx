import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { categories, menuItems } from '../data/menu.js'
import { useShop } from '../context/ShopContext.jsx'
import FoodImage from '../components/FoodImage.jsx'
import Icon from '../components/Icon.jsx'
import { useToast } from '../components/Toast.jsx'
import { flyToCart } from '../lib/flyToCart.js'
import { formatPrice } from '../lib/format.js'

const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

function MenuRow({ item }) {
  const { openItem, addLine } = useShop()
  const toast = useToast()
  const thumb = useRef(null)
  const needsChoice = item.options.some((g) => g.required)

  const quickAdd = (e) => {
    e.stopPropagation()
    if (needsChoice) return openItem(item.id)
    flyToCart(thumb.current?.firstElementChild)
    addLine({ itemId: item.id, qty: 1, options: {}, addOns: [], removed: [] })
    toast(`${item.name} added to your bag`)
  }

  return (
    <li className="menu-row">
      <button type="button" className="menu-row__open" onClick={() => openItem(item.id)} aria-label={`${item.name}, ${formatPrice(item.price)}. View details`} />
      <div className="menu-row__text">
        <h4 className="menu-row__name">{item.name}</h4>
        {item.description && <p className="menu-row__desc">{item.description}</p>}
        {item.options.length > 0 && (
          <p className="menu-row__opts">{item.options[0].choices.map((c) => c.name).join(' · ')}</p>
        )}
        <p className="menu-row__price">{formatPrice(item.price)}</p>
      </div>
      <div className="menu-row__media" ref={thumb}>
        <FoodImage item={item} className="food-img--row" />
        <button type="button" className="menu-row__add" onClick={quickAdd} aria-label={needsChoice ? `Choose options for ${item.name}` : `Add ${item.name} to bag`}>
          <Icon name="plus" size={18} strokeWidth={2.2} />
        </button>
      </div>
    </li>
  )
}

export default function Menu() {
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const [active, setActive] = useState(categories[0].id)
  const tabsRef = useRef(null)
  const clicking = useRef(false)

  const groups = useMemo(() => {
    const q = normalize(deferred.trim())
    return categories
      .map((c) => ({
        ...c,
        items: menuItems.filter(
          (i) => i.category === c.id && (!q || normalize(`${i.name} ${i.description} ${c.name}`).includes(q)),
        ),
      }))
      .filter((g) => g.items.length)
  }, [deferred])

  const resultCount = groups.reduce((n, g) => n + g.items.length, 0)

  // Scroll-spy: highlight the category currently at the top of the viewport.
  useEffect(() => {
    const onScroll = () => {
      if (clicking.current) return
      const line = 170
      let current = groups[0]?.id
      for (const g of groups) {
        const el = document.getElementById(`cat-${g.id}`)
        if (el && el.getBoundingClientRect().top - line <= 0) current = g.id
      }
      if (current) setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [groups])

  // Keep the active tab visible inside the horizontally scrolling bar.
  useEffect(() => {
    const bar = tabsRef.current
    const tab = bar?.querySelector(`[data-cat="${active}"]`)
    if (!bar || !tab) return
    const left = tab.offsetLeft - bar.clientWidth / 2 + tab.clientWidth / 2
    bar.scrollTo({ left, behavior: 'smooth' })
  }, [active])

  const jump = (id) => {
    setActive(id)
    clicking.current = true
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => (clicking.current = false), 700)
  }

  return (
    <section className="menu section" id="menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="menu__head">
          <div>
            <p className="eyebrow">Order for pickup or delivery</p>
            <h2 id="menu-title" className="section-title">The menu</h2>
          </div>
          <div className="search">
            <Icon name="search" size={18} className="search__icon" />
            <label htmlFor="menu-search" className="visually-hidden">Search the menu</label>
            <input
              id="menu-search"
              type="search"
              placeholder="Search strips, sliders, Cregg..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Clear search">
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="cat-bar">
        <div className="container">
          <nav ref={tabsRef} className="cat-bar__scroll" aria-label="Menu categories">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                data-cat={g.id}
                className={`cat-tab ${active === g.id ? 'is-active' : ''}`}
                aria-current={active === g.id ? 'true' : undefined}
                onClick={() => jump(g.id)}
              >
                {g.name}
                <span className="cat-tab__count">{g.items.length}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container">
        <p className="visually-hidden" aria-live="polite">
          {deferred ? `${resultCount} item${resultCount === 1 ? '' : 's'} found` : ''}
        </p>

        {groups.length === 0 ? (
          <div className="menu__empty">
            <p className="menu__empty-title">Nothing matches "{query}"</p>
            <p className="muted">Try another word, or browse the full menu.</p>
            <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>Show everything</button>
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.id} id={`cat-${g.id}`} className="menu-cat">
              <h3 className="menu-cat__title">{g.name}</h3>
              <ul className="menu-cat__list">
                {g.items.map((item) => <MenuRow key={item.id} item={item} />)}
              </ul>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
