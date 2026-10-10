import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { getCategory, getItem, houseRolls } from '../data/menu'
import { useItemSheet } from '../context/ItemContext'
import { formatPrice } from '../lib/format'
import DishImage from '../components/DishImage'
import './HouseRolls.css'

/**
 * The Dragon Makis and the rolls named after the house, on a turning 3D
 * stage. Drag or swipe, use the arrows, or the keyboard.
 */
export default function HouseRolls() {
  const items = houseRolls.map((id) => getItem(id)!).filter(Boolean)
  const [index, setIndex] = useState(0)
  const { open } = useItemSheet()
  const go = (n: number) => setIndex((i) => (i + n + items.length) % items.length)
  const active = items[index]

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 50 || info.velocity.x > 400) go(-1)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  return (
    <section className="rolls" aria-labelledby="rolls-title">
      <div className="container rolls__head">
        <div>
          <p className="mark mark--ember">Dragon maki &amp; house rolls</p>
          <h2 id="rolls-title" className="rolls__title">The ones with our name on them.</h2>
        </div>
        <div className="rolls__nav">
          <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous roll"><ArrowLeft size={20} aria-hidden="true" /></button>
          <span className="rolls__count" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next roll"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>

      <motion.div className="rolls__stage" tabIndex={0} role="group" aria-roledescription="carousel" aria-label="House rolls" onKeyDown={onKey}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} onDragEnd={onDragEnd}>
        {items.map((item, i) => {
          let offset = i - index
          if (offset > items.length / 2) offset -= items.length
          if (offset < -items.length / 2) offset += items.length
          const abs = Math.abs(offset)
          return (
            <motion.button
              key={item.id}
              type="button"
              className="rolls__card"
              aria-hidden={abs > 2}
              tabIndex={offset === 0 ? 0 : -1}
              onClick={() => (offset === 0 ? open(item.id) : setIndex(i))}
              animate={{
                x: `${offset * 62}%`,
                rotateY: offset * -38,
                z: -abs * 140,
                scale: offset === 0 ? 1 : 0.86,
                opacity: abs > 2 ? 0 : 1 - abs * 0.22,
              }}
              transition={{ type: 'spring', stiffness: 170, damping: 24 }}
              style={{ zIndex: 10 - abs, pointerEvents: abs > 2 ? 'none' : 'auto' }}
            >
              <DishImage item={item} size="lg" />
              <span className="rolls__glare" aria-hidden="true" />
            </motion.button>
          )
        })}
      </motion.div>

      <div className="container rolls__info">
        <AnimatePresence mode="wait">
          <motion.div key={active.id} className="rolls__detail" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <p className="mark">{getCategory(active.category)?.name}</p>
            <h3>{active.name}</h3>
            {active.description && <p className="rolls__desc">{active.description}</p>}
          </motion.div>
        </AnimatePresence>
        <button type="button" className="btn btn--ember btn--lg rolls__add" onClick={() => open(active.id)}>
          <Plus size={18} aria-hidden="true" /> Add · <span className="price">{formatPrice(active.price ?? 0)}</span>
        </button>
      </div>
    </section>
  )
}
