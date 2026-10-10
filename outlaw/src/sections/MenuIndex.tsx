import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { basePrice, categories, itemsIn } from '../data/menu'
import { cutoutUrl, photoUrl } from '../lib/asset'
import { formatPrice } from '../lib/format'
import './MenuIndex.css'

const coverOf = (categoryId: string) => {
  const first = itemsIn(categoryId).find((i) => i.photo || i.cutout)
  return first?.photo ? photoUrl(first.photo, 'sm') : cutoutUrl(first?.cutout)
}

/**
 * The whole menu as a table of contents. On desktop the pointer carries a
 * photo of the section it is over; tapping a line opens that section.
 */
export default function MenuIndex() {
  const [hover, setHover] = useState<string | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 26 })
  const sy = useSpring(y, { stiffness: 260, damping: 26 })

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section className="index" aria-labelledby="index-title">
      <div className="container">
        <div className="index__head">
          <p className="mark mark--ember">The menu</p>
          <h2 id="index-title" className="index__title">{categories.length} sections. Pick a door.</h2>
        </div>
        <ol className="index__list" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {categories.map((c, i) => {
            const count = itemsIn(c.id)
            const from = Math.min(...count.map(basePrice))
            return (
              <li key={c.id} onPointerEnter={() => setHover(c.id)}>
                <Link to={`/menu/${c.id}`} className="index__row">
                  <span className="index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="index__name">{c.name}</span>
                  <span className="index__meta">
                    {c.pieces && <span>{c.pieces}</span>}
                    <span>{count.length} {count.length === 1 ? 'item' : 'items'}</span>
                    <span>from {formatPrice(from)}</span>
                  </span>
                  <ArrowUpRight className="index__arrow" size={22} aria-hidden="true" />
                </Link>
              </li>
            )
          })}
          <AnimatePresence>
            {hover && (
              <motion.span
                key="peek"
                className="index__peek"
                style={{ x: sx, y: sy }}
                initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                aria-hidden="true"
              >
                <AnimatePresence mode="popLayout">
                  <motion.img key={hover} src={coverOf(hover)} alt="" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
                </AnimatePresence>
              </motion.span>
            )}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  )
}
