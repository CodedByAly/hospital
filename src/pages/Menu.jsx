import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, menuItems } from '../data/menu'
import { usePageMeta } from '../hooks/usePageMeta'
import { normalizeArabic } from '../lib/text'
import { MenuRow } from '../components/MenuRow'
import { CloseIcon, SearchIcon } from '../components/Icons'

const HEADER_OFFSET = 150

export default function Menu() {
  usePageMeta('المنيو', 'منيو عل منقل بالأسعار: ساندويشات شقف وكباب وطاووق وسجق ومقانق، وجبة، جاط عائلي وبوكس الجوانح. اطلب توصيل أو استلام.')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [active, setActive] = useState(categories[0].id)
  const chipsRef = useRef(null)
  const lockSpy = useRef(false)

  const groups = useMemo(
    () => categories.map((c) => ({ ...c, items: menuItems.filter((i) => i.category === c.id) })).filter((g) => g.items.length),
    [],
  )

  const results = useMemo(() => {
    const q = normalizeArabic(query)
    if (!q) return null
    return menuItems.filter((item) => normalizeArabic([item.name, ...(item.contents ?? []), item.description ?? ''].join(' ')).includes(q))
  }, [query])

  const setQuery = (value) => setParams(value ? { q: value } : {}, { replace: true })

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

  const jumpTo = (id) => {
    setActive(id)
    lockSpy.current = true
    const el = document.getElementById(`cat-${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 24
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setTimeout(() => (lockSpy.current = false), 700)
  }

  return (
    <div className="menu-page">
      <header className="page-hero page-hero--menu">
        <div className="container">
          <p className="eyebrow eyebrow--ember">اطلب أونلاين</p>
          <h1 className="page-title">المنيو</h1>
          <p className="page-lead">كبوس عالصنف لتشوف التفاصيل، أو زيده عالسلة دغري بكبسة +</p>
        </div>
      </header>

      <div className="menu-toolbar">
        <div className="container menu-toolbar__inner">
          <div className="search">
            <SearchIcon size={20} className="search__icon" />
            <label htmlFor="menu-search" className="sr-only">
              ابحث بالمنيو
            </label>
            <input
              id="menu-search"
              type="search"
              className="search__input"
              placeholder="ابحث: كباب، طاووق، جاط…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="مسح البحث">
                <CloseIcon size={18} />
              </button>
            )}
          </div>

          {!results && (
            <nav className="chips" ref={chipsRef} aria-label="أقسام المنيو">
              {groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-current={active === g.id ? 'true' : undefined}
                  data-cat={g.id}
                  className={`chip ${active === g.id ? 'is-active' : ''}`}
                  onClick={() => jumpTo(g.id)}
                >
                  {g.name}
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
            <h2 className="menu-section__title">
              {results.length ? `${results.length} نتيجة لـ «${query}»` : `ما في نتائج لـ «${query}»`}
            </h2>
            {results.length ? (
              <ul className="menu-list">
                {results.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>جرّب كلمة تانية، أو تصفّح الأقسام.</p>
                <button type="button" className="btn btn--outline" onClick={() => setQuery('')}>
                  عرض كل المنيو
                </button>
              </div>
            )}
          </section>
        ) : (
          groups.map((g) => (
            <section key={g.id} id={`cat-${g.id}`} className="menu-section" aria-labelledby={`cat-title-${g.id}`}>
              <h2 id={`cat-title-${g.id}`} className="menu-section__title">
                {g.name}
              </h2>
              <ul className="menu-list">
                {g.items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
