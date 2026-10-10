import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useRef } from 'react'
import type { MenuItem } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useItemSheet } from '../context/ItemContext'
import { useTilt } from '../hooks/useTilt'
import { cutoutUrl, photoUrl } from '../lib/asset'
import { basePrice } from '../data/menu'
import { formatPrice } from '../lib/format'
import DishImage from './DishImage'
import './DishRow.css'

/**
 * One line of the menu: the plate lifts toward the pointer, the name opens
 * the full detail, and + adds a single portion straight away (items with
 * sizes open the detail so a size can be chosen).
 */
export default function DishRow({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const { open } = useItemSheet()
  const { add, fly } = useCart()
  const tilt = useTilt(12)
  const plate = useRef<HTMLDivElement>(null)

  const quickAdd = () => {
    if (item.sizes) return open(item.id)
    add(item.id, null, 1, '')
    fly(plate.current, item.photo ? photoUrl(item.photo, 'sm') : cutoutUrl(item.cutout))
  }

  return (
    <motion.li
      className="dish"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.035, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <button type="button" className="dish__open" onClick={() => open(item.id)} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
        <span className="dish__plate-wrap">
          <motion.div ref={plate} className="dish__plate" style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}>
            <DishImage item={item} />
          </motion.div>
        </span>
        <span className="dish__text">
          <span className="dish__name">{item.name}</span>
          {item.description && <span className="dish__desc">{item.description}</span>}
          {item.sizes && <span className="dish__sizes">{item.sizes.map((s) => s.label).join(' · ')}</span>}
        </span>
      </button>
      <div className="dish__end">
        <span className="price">{item.sizes ? `from ${formatPrice(basePrice(item))}` : formatPrice(item.price ?? 0)}</span>
        <button type="button" className="dish__add" onClick={quickAdd} aria-label={item.sizes ? `Choose a size for ${item.name}` : `Add ${item.name} to your order`}>
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  )
}
