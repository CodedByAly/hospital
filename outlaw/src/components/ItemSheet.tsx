import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getCategory, getItem, type MenuItem } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useItemSheet } from '../context/ItemContext'
import { useScrollLock } from '../hooks/useScrollLock'
import { useTilt } from '../hooks/useTilt'
import { cutoutUrl, photoUrl } from '../lib/asset'
import { unitPrice } from '../lib/cart'
import { formatPrice } from '../lib/format'
import DishImage from './DishImage'
import Qty from './Qty'
import './ItemSheet.css'

function Sheet({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { add, fly } = useCart()
  const [sizeId, setSizeId] = useState<string | null>(item.sizes?.[0].id ?? null)
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const photoRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const tilt = useTilt(9)
  const category = getCategory(item.category)
  const total = unitPrice(item, sizeId) * qty

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = () => {
    add(item.id, sizeId, qty, notes)
    fly(photoRef.current, item.photo ? photoUrl(item.photo, 'sm') : cutoutUrl(item.cutout))
    onClose()
  }

  return (
    <motion.div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <button type="button" className="sheet__scrim" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <motion.div
        className="sheet__panel"
        initial={{ y: 60, rotateX: 8, opacity: 0 }}
        animate={{ y: 0, rotateX: 0, opacity: 1 }}
        exit={{ y: 40, rotateX: 6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <div className="sheet__stage" onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
          <motion.div ref={photoRef} className="sheet__photo" style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}>
            <DishImage item={item} size="lg" eager />
          </motion.div>
          <span className="sheet__shadow" aria-hidden="true" />
        </div>

        <div className="sheet__body">
          <button ref={closeRef} type="button" className="icon-btn sheet__close" onClick={onClose} aria-label="Close">
            <X size={20} aria-hidden="true" />
          </button>
          <p className="mark mark--ember">{category?.name}{category?.pieces ? ` · ${category.pieces}` : ''}</p>
          <h2 id="sheet-title" className="sheet__title">{item.name}</h2>
          {item.description && <p className="sheet__desc">{item.description}</p>}
          {!item.sizes && <p className="sheet__price price">{formatPrice(item.price ?? 0)}</p>}

          {item.sizes && (
            <fieldset className="sheet__sizes">
              <legend className="mark">Size</legend>
              {item.sizes.map((s) => (
                <label key={s.id} className="size-opt">
                  <input type="radio" name="size" value={s.id} checked={sizeId === s.id} onChange={() => setSizeId(s.id)} />
                  <span>{s.label}</span>
                  <span className="price">{formatPrice(s.price)}</span>
                </label>
              ))}
            </fieldset>
          )}

          <label className="field sheet__notes">
            <span className="field__label">Special instructions <span className="field__hint">optional</span></span>
            <textarea id="item-notes" className="input" rows={2} maxLength={160} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="No sesame, sauce on the side, cut in half…" />
          </label>

          <div className="sheet__actions">
            <Qty value={qty} onChange={(n) => setQty(Math.max(1, n))} label={item.name} />
            <button type="button" className="btn btn--ember btn--lg sheet__add" onClick={submit}>
              <span>Add to order</span>
              <span className="price">{formatPrice(total)}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ItemSheet() {
  const { itemId, close } = useItemSheet()
  const item = itemId ? getItem(itemId) : undefined
  useScrollLock(!!item)
  return <AnimatePresence>{item && <Sheet key={item.id} item={item} onClose={close} />}</AnimatePresence>
}
