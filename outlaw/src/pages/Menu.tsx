import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { categories, getCategory, itemsIn } from '../data/menu'
import { useMeta } from '../hooks/useMeta'
import { searchMenu } from '../lib/search'
import DishRow from '../components/DishRow'
import './Menu.css'

export default function Menu() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const current = getCategory(categoryId ?? '') ?? categories[0]
  const index = categories.findIndex((c) => c.id === current.id)
  const [query, setQuery] = useState('')
  const prevIndex = useRef(index)
  const direction = index >= prevIndex.current ? 1 : -1
  const rail = useRef<HTMLDivElement>(null)
  const stageTop = useRef<HTMLDivElement>(null)
  // swiping between sections is for touch screens; on desktop a drag would fight text selection
  const [touch] = useState(() => window.matchMedia?.('(hover: none)').matches ?? false)

  useMeta({
    title: `${current.name} — Menu — Outlaw Sushi Bar`,
    description: `Outlaw Sushi Bar menu: ${current.name}. ${itemsIn(current.id).length} items with prices, order on WhatsApp.`,
    path: `/menu/${current.id}`,
  })

  useEffect(() => {
    prevIndex.current = index
    // keep the active chip in view on the phone rail
    rail.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [index])

  const results = useMemo(() => searchMenu(query), [query])
  const go = (i: number) => {
    const next = categories[(i + categories.length) % categories.length]
    navigate(`/menu/${next.id}`)
    if (stageTop.current && stageTop.current.getBoundingClientRect().top < 0) stageTop.current.scrollIntoView({ behavior: 'smooth' })
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) return
    if (info.offset.x < -80) go(index + 1)
    else if (info.offset.x > 80) go(index - 1)
  }
  const items = itemsIn(current.id)
  const prev = categories[(index - 1 + categories.length) % categories.length]
  const next = categories[(index + 1) % categories.length]

  return (
    <div className="menu container">
      <header className="menu__head">
        <div>
          <p className="mark mark--ember">Outlaw Sushi Bar</p>
          <h1 className="menu__title">The menu</h1>
          <p className="muted">All prices in US dollars. Tap a dish for the full photo and to add notes.</p>
        </div>
        <label className="menu__search">
          <Search size={18} aria-hidden="true" />
          <span className="visually-hidden">Search the menu</span>
          <input id="menu-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search salmon, tempura, crab…" autoComplete="off" />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} aria-hidden="true" /></button>
          )}
        </label>
      </header>

      <div className="menu__layout">
        <nav className="menu__index" aria-label="Menu sections">
          <div className="menu__rail" ref={rail}>
            {categories.map((c, i) => (
              <Link key={c.id} to={`/menu/${c.id}`} className="menu__cat" aria-current={c.id === current.id && !query ? 'page' : undefined} onClick={() => setQuery('')}>
                <span className="menu__cat-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="menu__cat-name">{c.name}</span>
                <span className="menu__cat-count">{itemsIn(c.id).length}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="menu__stage" ref={stageTop}>
          {query ? (
            <section aria-live="polite" aria-label="Search results">
              <h2 className="menu__cat-title menu__cat-title--sm">
                {results.length ? `${results.length} ${results.length === 1 ? 'dish' : 'dishes'} for “${query}”` : `Nothing matches “${query}”`}
              </h2>
              {results.length === 0 && <p className="muted">Try “salmon”, “crispy”, “tempura” or “cake”.</p>}
              <ul className="menu__list">
                {results.map((item, i) => <DishRow key={item.id} item={item} index={i} />)}
              </ul>
            </section>
          ) : (
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.section
                key={current.id}
                className="menu__panel"
                aria-labelledby="cat-title"
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, rotateY: d * -24, x: d * 70, z: -120 }),
                  center: { opacity: 1, rotateY: 0, x: 0, z: 0 },
                  exit: (d: number) => ({ opacity: 0, rotateY: d * 24, x: d * -70, z: -120 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: direction > 0 ? '0% 50%' : '100% 50%' }}
                drag={touch ? 'x' : false}
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={onDragEnd}
              >
                <header className="menu__cat-head">
                  <p className="mark">{String(index + 1).padStart(2, '0')} / {categories.length}{current.pieces ? ` · ${current.pieces} per order` : ''}</p>
                  <h2 id="cat-title" className="menu__cat-title">{current.name}</h2>
                  {current.blurb && <p className="menu__blurb">{current.blurb}</p>}
                </header>
                <ul className="menu__list">
                  {items.map((item, i) => <DishRow key={item.id} item={item} index={i} />)}
                </ul>
                <div className="menu__pager">
                  <button type="button" onClick={() => go(index - 1)} className="menu__pager-btn">
                    <ArrowLeft size={18} aria-hidden="true" />
                    <span><small className="mark">Previous</small>{prev.name}</span>
                  </button>
                  <button type="button" onClick={() => go(index + 1)} className="menu__pager-btn menu__pager-btn--next">
                    <span><small className="mark">Next</small>{next.name}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </motion.section>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
