import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { categories, menuItems } from '../data/menu'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLang } from '../i18n/LanguageContext'
import { normalizeArabic } from '../lib/text'
import MenuCard from '../components/MenuCard'
import { CloseIcon, SearchIcon } from '../components/Icons'

const HEADER_OFFSET = 150

export default function Menu() {
  const { t, pick } = useLang()
  usePageMeta(t('menu.title'), t('menu.meta'))
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [active, setActive] = useState(categories[0].id)
  const chipsRef = useRef(null)
  const lockSpy = useRef(false)

  const groups = useMemo(
    () => categories.map((c) => ({ ...c, items: menuItems.filter((i) => i.category === c.id) })).filter((g) => g.items.length),
    [],
  )

  // Searches both languages, so "chicken" and "دجاج" both work in either mode.
  const results = useMemo(() => {
    const q = normalizeArabic(query)
    if (!q) return null
    return menuItems.filter((item) => {
      const text = [item.name.en, item.name.ar, item.note?.en, item.note?.ar, ...(item.contents ?? []).flatMap((c) => [c.en, c.ar])]
      return normalizeArabic(text.filter(Boolean).join(' ')).includes(q)
    })
  }, [query])

  const setQuery = (value) => setParams(value ? { q: value } : {}, { replace: true })

  const jumpTo = (id, smooth = true) => {
    setActive(id)
    lockSpy.current = true
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 24
      window.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' })
    }
    setTimeout(() => (lockSpy.current = false), 700)
  }

  // Deep links from the home page: /menu#cat-wraps
  useEffect(() => {
    const id = location.hash.replace('#cat-', '')
    if (id && groups.some((g) => g.id === id)) requestAnimationFrame(() => jumpTo(id, false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash])

  // Highlight the category whose section is under the sticky bar.
  useEffect(() => {
    if (results) return
    const onScroll = () => {
      if (lockSpy.current) return
      let current = groups[0].id
      for (const g of groups) {
        const el = document.getElementById(`cat-${g.id}`)
        if (el && el.getBoundingClientRect().top - HEADER_OFFSET <= 0) current = g.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [groups, results])

  // Keep the active chip visible in the horizontal bar.
  useEffect(() => {
    const chip = chipsRef.current?.querySelector(`[data-cat="${active}"]`)
    chip?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [active])

  return (
    <div className="menu-page">
      <header className="page-hero page-hero--menu">
        <div className="container">
          <p className="eyebrow eyebrow--gold">{t('menu.kicker')}</p>
          <h1 className="page-title">{t('menu.title')}</h1>
          <p className="page-lead">{t('menu.lead')}</p>
        </div>
      </header>

      <div className="menu-toolbar">
        <div className="container menu-toolbar__inner">
          <div className="search">
            <SearchIcon size={20} className="search__icon" />
            <label htmlFor="menu-search" className="sr-only">
              {t('menu.search')}
            </label>
            <input
              id="menu-search"
              type="search"
              className="search__input"
              placeholder={t('menu.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label={t('menu.clear')}>
                <CloseIcon size={18} />
              </button>
            )}
          </div>

          {!results && (
            <nav className="chips" ref={chipsRef} aria-label={t('menu.sections')}>
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-current={active === g.id ? 'true' : undefined}
                  data-cat={g.id}
                  className={`chip ${active === g.id ? 'is-active' : ''}`}
                  onClick={() => jumpTo(g.id)}
                >
                  {pick(g.name)}
                  <span className="chip__count">{g.items.length}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="container menu-body">
        {results ? (
          <section aria-live="polite" className="menu-section">
            <h2 className="menu-section__title menu-section__title--small">
              {results.length ? t('menu.results', { count: results.length, q: query }) : t('menu.noResults', { q: query })}
            </h2>
            {results.length ? (
              <div className="card-grid">
                {results.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>{t('menu.noResultsHint')}</p>
                <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>
                  {t('menu.showAll')}
                </button>
              </div>
            )}
          </section>
        ) : (
          groups.map((g) => (
            <section key={g.id} id={`cat-${g.id}`} className="menu-section" aria-labelledby={`cat-title-${g.id}`}>
              <h2 id={`cat-title-${g.id}`} className="menu-section__title">
                {pick(g.name)}
              </h2>
              <div className={`card-grid ${g.id === 'sauces' || g.id === 'drinks' ? 'card-grid--compact' : ''}`}>
                {g.items.map((item) => (
                  <MenuCard key={item.id} item={item} size={g.id === 'sauces' || g.id === 'drinks' ? 'sm' : 'md'} />
                ))}
              </div>
            </section>
          ))
        )}
        <p className="menu-body__note">{t('menu.prices')}</p>
      </div>
    </div>
  )
}
