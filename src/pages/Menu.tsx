import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { categories, menu } from '../data/menu'
import type { MenuItem } from '../data/types'
import { num } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { MenuCard } from '../components/MenuCard'
import { Icon } from '../components/Icon'
import './Menu.css'

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ْ]/g, '') // Arabic diacritics
    .replace(/['’]/g, '')

export default function Menu() {
  const { t, l, lang } = useLang()
  usePageMeta(t.menu.title, 'Kuku Chix Joint menu: bundles, Nashville chix, strips, wings, mac n cheese, loaded fries, burgers, sauces and drinks — with prices.')
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const [active, setActive] = useState<string>(categories[0].id)
  const barRef = useRef<HTMLDivElement>(null)
  const clickLock = useRef(0)
  const { hash } = useLocation()

  const results = useMemo(() => {
    const q = normalize(deferred.trim())
    if (!q) return null
    return menu.filter((m) => {
      const cat = categories.find((c) => c.id === m.category)
      const hay = normalize([m.name, m.description.en, m.description.ar, cat?.name.en, cat?.name.ar].join(' '))
      return q.split(/\s+/).every((w) => hay.includes(w))
    })
  }, [deferred])

  // Scroll-spy: the active section is the last one whose top has passed the sticky bar.
  useEffect(() => {
    if (results) return
    let frame = 0
    const update = () => {
      frame = 0
      if (Date.now() < clickLock.current) return
      const line = (barRef.current?.getBoundingClientRect().bottom ?? 140) + 64
      let current = categories[0].id
      for (const c of categories) {
        const el = document.getElementById(c.id)
        if (el && el.getBoundingClientRect().top <= line) current = c.id
      }
      setActive(current)
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
  }, [results])

  // Keep the active chip visible inside the horizontal bar.
  useEffect(() => {
    // Scroll only the bar (scrollIntoView would also interrupt the page's smooth scroll).
    const scroller = barRef.current?.querySelector<HTMLElement>('.cat-bar__scroll')
    const chip = scroller?.querySelector<HTMLElement>(`[data-cat="${active}"]`)
    if (!scroller || !chip) return
    const sr = scroller.getBoundingClientRect()
    const cr = chip.getBoundingClientRect()
    scroller.scrollBy({ left: cr.left - sr.left - (sr.width - cr.width) / 2, behavior: 'smooth' })
  }, [active])

  // Deep links like /menu#mac-mania
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => {
      clickLock.current = Date.now() + 1200
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (categories.some((c) => c.id === id)) setActive(id)
    }, 120)
    return () => window.clearTimeout(t)
  }, [hash])

  const jump = (id: string) => {
    setQuery('')
    setActive(id)
    clickLock.current = Date.now() + 900
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <div className="menu-page">
      <header className="menu-hero">
        <div className="container menu-hero__inner">
          <div>
            <h1>{t.menu.title}</h1>
            <p>{t.menu.sub}</p>
          </div>
          <label className="menu-search">
            <Icon name="search" />
            <span className="sr-only">{t.menu.search}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.menu.search}
              enterKeyHint="search"
              autoComplete="off"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label={t.menu.searchClear}>
                <Icon name="close" />
              </button>
            )}
          </label>
        </div>
      </header>

      <div className="cat-bar" ref={barRef}>
        <div className="container">
          <nav className="cat-bar__scroll" aria-label={t.menu.title}>
            {categories.map((c) => {
              const on = !results && active === c.id
              return (
                <button key={c.id} type="button" data-cat={c.id} className={`cat-chip ${on ? 'is-active' : ''}`} onClick={() => jump(c.id)} aria-current={on ? 'true' : undefined}>
                  {on && <motion.span layoutId="cat-pill" className="cat-chip__pill" transition={{ type: 'spring', stiffness: 450, damping: 36 }} />}
                  <span>{l(c.name)}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="container menu-body">
        <AnimatePresence mode="wait" initial={false}>
          {results ? (
            <motion.section key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="menu-results" aria-live="polite">
              {results.length ? (
                <>
                  <p className="menu-results__count">{results.length === 1 ? t.menu.item : fmt(t.menu.items, { n: num(results.length, lang) })}</p>
                  <Grid items={results} />
                </>
              ) : (
                <div className="menu-empty">
                  <Icon name="search" />
                  <h2>{fmt(t.menu.noResults, { q: query })}</h2>
                  <p>{t.menu.noResultsHint}</p>
                </div>
              )}
            </motion.section>
          ) : (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {categories.map((c) => {
                const items = menu.filter((m) => m.category === c.id)
                if (!items.length) return null
                return (
                  <section key={c.id} id={c.id} className="menu-section" aria-labelledby={`h-${c.id}`}>
                    <div className="menu-section__head">
                      <h2 id={`h-${c.id}`}>{l(c.name)}</h2>
                      <span>{items.length === 1 ? t.menu.item : fmt(t.menu.items, { n: num(items.length, lang) })}</span>
                    </div>
                    {c.blurb && <p className="menu-section__blurb">{l(c.blurb)}</p>}
                    <Grid items={items} />
                  </section>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Grid({ items }: { items: MenuItem[] }) {
  return (
    <ul className="menu-grid">
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, y: 24, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '0px 0px -40px 0px' }}
          transition={{ duration: 0.55, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 900 }}
        >
          <MenuCard item={item} />
        </motion.li>
      ))}
    </ul>
  )
}
