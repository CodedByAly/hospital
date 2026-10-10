import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { categories, menu } from '../data/menu'
import { searchMenu } from '../lib/search'
import { useLanguage } from '../context/LanguageContext'
import { useItemDialog } from '../context/ItemContext'
import { useMeta } from '../hooks/useMeta'
import { useScrollSpy } from '../hooks/useScrollSpy'
import MenuCard from '../components/MenuCard'
import Icon from '../components/Icon'
import './Menu.css'

const scrollToSection = (id, behavior = 'smooth') => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : behavior, block: 'start' })
}

export default function Menu() {
  const { t, pick } = useLanguage()
  const { openItem } = useItemDialog()
  const { hash } = useLocation()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  useMeta({ title: t('meta.menuTitle'), description: t('meta.menuDescription'), path: '/menu' })

  const results = useMemo(() => searchMenu(menu, categories, query), [query])
  const visibleCats = categories.filter((c) => results.some((i) => i.category === c.id))
  const barRef = useRef(null)
  const active = useScrollSpy(visibleCats.map((c) => c.id), () => (barRef.current?.getBoundingClientRect().bottom ?? 140) + 12)

  // expose the sticky bar height so section anchors land just below it
  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const set = () => document.documentElement.style.setProperty('--menubar-h', `${bar.offsetHeight}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [])
  const searching = query.trim().length > 0

  // deep links: /menu#crepe and /menu?item=cappuccino
  useLayoutEffect(() => {
    if (hash) scrollToSection(decodeURIComponent(hash.slice(1)), 'auto')
  }, [hash])
  useEffect(() => {
    const itemId = params.get('item')
    if (itemId && menu.some((i) => i.id === itemId)) {
      openItem(itemId)
      const next = new URLSearchParams(params)
      next.delete('item')
      setParams(next, { replace: true })
    }
  }, [params, openItem, setParams])

  // keep ?q= in the URL so a search can be shared or survives a refresh
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams(params)
      if (query.trim()) next.set('q', query.trim())
      else next.delete('q')
      if (next.toString() !== params.toString()) setParams(next, { replace: true })
    }, 300)
    return () => clearTimeout(id)
  }, [query, params, setParams])

  return (
    <div className="menu-page">
      <header className="menu-page__head container">
        <h1 className="menu-page__title">{t('menu.title')}</h1>
        <p className="menu-page__intro">{t('menu.intro')}</p>
      </header>

      <div className="menu-bar" ref={barRef}>
        <div className="container menu-bar__inner">
          <div className="search">
            <label htmlFor="menu-search" className="visually-hidden">{t('menu.search')}</label>
            <Icon name="search" size={18} className="search__icon" />
            <input
              id="menu-search"
              type="search"
              className="search__input"
              placeholder={t('menu.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
              autoComplete="off"
              enterKeyHint="search"
            />
            {searching && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label={t('menu.clear')}>
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
          <CategoryNav cats={visibleCats} active={active} />
        </div>
      </div>

      <div className="container menu-page__body">
        {searching && (
          <p className="menu-page__count" role="status">
            {results.length === 0
              ? ''
              : results.length === 1
                ? t('menu.result', { query: query.trim() })
                : t('menu.results', { count: results.length, query: query.trim() })}
          </p>
        )}

        {results.length === 0 ? (
          <div className="menu-empty" role="status">
            <Icon name="search" size={28} />
            <p className="menu-empty__title">{t('menu.empty', { query: query.trim() })}</p>
            <p className="muted">{t('menu.emptyHint')}</p>
            <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>{t('menu.clear')}</button>
          </div>
        ) : (
          visibleCats.map((cat) => {
            const items = results.filter((i) => i.category === cat.id)
            return (
              <section key={cat.id} id={cat.id} className="menu-section" aria-labelledby={`${cat.id}-title`}>
                <div className="menu-section__head">
                  <h2 id={`${cat.id}-title`}>{pick(cat.name)}</h2>
                  <span className="muted">{t('menu.items', { count: items.length })}</span>
                </div>
                <div className="menu-section__grid">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}

function CategoryNav({ cats, active }) {
  const { t, pick, isRTL } = useLanguage()
  const listRef = useRef(null)
  const [indicator, setIndicator] = useState(null)

  // slide the underline under the active tab and keep that tab in view
  useLayoutEffect(() => {
    const list = listRef.current
    const el = list?.querySelector(`[data-id="${active}"]`)
    if (!el) return setIndicator(null)
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    const target = el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2
    list.scrollTo({ left: target, behavior: 'smooth' })
  }, [active, cats.length, isRTL])

  return (
    <nav className="cat-nav" aria-label={t('menu.categories')}>
      <ul ref={listRef} className="cat-nav__list">
        {cats.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              data-id={c.id}
              className="cat-nav__link"
              aria-current={active === c.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(c.id)
                history.replaceState(null, '', `#${c.id}`)
              }}
            >
              {pick(c.name)}
            </a>
          </li>
        ))}
        {indicator && <li className="cat-nav__indicator" aria-hidden="true" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />}
      </ul>
    </nav>
  )
}
