import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion'
import type { MenuItem, OptionGroup } from '../data/types'
import { categories, findItem, isOrderable } from '../data/menu'
import { useLang, fmt } from '../i18n/LanguageProvider'
import { useCart, unitPrice, type Selections } from '../store/cart'
import { useUI } from '../store/ui'
import { useDialog } from '../hooks/useDialog'
import { money } from '../utils/format'
import { flyToCart } from '../utils/flyToCart'
import { whatsappLink } from '../config/restaurant'
import { FoodImage, imageUrl } from './FoodImage'
import { QtyStepper } from './QtyStepper'
import { Icon } from './Icon'
import './ItemDialog.css'

const groupTotal = (s: Selections, g: OptionGroup) => Object.values(s[g.id] ?? {}).reduce((a, b) => a + b, 0)

const groupSatisfied = (s: Selections, g: OptionGroup) => {
  const n = groupTotal(s, g)
  if (g.type === 'single') return !g.required || n === 1
  const min = g.min ?? (g.required ? 1 : 0)
  return n >= min
}

export function ItemDialog() {
  const { dialog, closeItem } = useUI()
  const item = dialog ? findItem(dialog.itemId) : undefined
  return (
    <AnimatePresence>
      {item && <ItemSheet key={dialog!.line?.key ?? item.id} item={item} onClose={closeItem} />}
    </AnimatePresence>
  )
}

function ItemSheet({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { t, l, lang } = useLang()
  const { add, replace } = useCart()
  const { dialog } = useUI()
  const editing = dialog?.line
  const reduce = useReducedMotion()
  const ref = useDialog<HTMLDivElement>(true, onClose)
  const mediaRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 759px)').matches)

  const [qty, setQty] = useState(editing?.qty ?? 1)
  const [selections, setSelections] = useState<Selections>(editing?.selections ?? {})
  const [removed, setRemoved] = useState<string[]>(editing?.removed ?? [])
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 759px)')
    const on = () => setIsMobile(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const orderable = isOrderable(item)
  const price = useMemo(() => unitPrice(item, selections), [item, selections])
  const missing = (item.options ?? []).filter((g) => !groupSatisfied(selections, g))
  const category = categories.find((c) => c.id === item.category)

  const setChoice = (g: OptionGroup, choiceId: string, units: number) => {
    setSelections((prev) => {
      const current = { ...prev[g.id] }
      if (g.type === 'single') {
        return { ...prev, [g.id]: { [choiceId]: 1 } }
      }
      if (units <= 0) delete current[choiceId]
      else current[choiceId] = units
      const next = { ...prev, [g.id]: current }
      if (!Object.keys(current).length) delete next[g.id]
      return next
    })
  }

  const submit = () => {
    if (missing.length) {
      setShowErrors(true)
      ref.current?.querySelector(`[data-group="${missing[0].id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const payload = { itemId: item.id, qty, selections, removed, notes: notes.trim() }
    if (editing) {
      replace({ ...payload, key: editing.key })
    } else {
      const rect = mediaRef.current?.getBoundingClientRect()
      if (rect) flyToCart(rect, item.image ? imageUrl(item.image, true) : undefined)
      add(payload)
    }
    onClose()
  }

  const sheetMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isMobile
      ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
      : {
          initial: { opacity: 0, y: 40, rotateX: 14, scale: 0.94 },
          animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
          exit: { opacity: 0, y: 30, rotateX: 8, scale: 0.96 },
        }

  return (
    <div className="item-dialog" role="presentation">
      <motion.div className="item-dialog__scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        ref={ref}
        className="item-dialog__sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-dialog-title"
        {...sheetMotion}
        transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.9 }}
        drag={isMobile && !reduce ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        dragListener={false}
        dragControls={dragControls}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose()
        }}
      >
        <button type="button" className="item-dialog__close icon-btn" onClick={onClose} aria-label={t.item.close}>
          <Icon name="close" />
        </button>

        <div className="item-dialog__media" ref={mediaRef} onPointerDown={(e) => isMobile && dragControls.start(e)}>
          <FoodImage image={item.image} alt={item.name} sizes="(max-width: 760px) 100vw, 520px" eager />
          <span className="item-dialog__grab" aria-hidden="true" />
        </div>

        <div className="item-dialog__content">
          <header className="item-dialog__head">
            {category && <p className="eyebrow">{l(category.name)}</p>}
            <h2 id="item-dialog-title">{item.name}</h2>
            {l(item.description) && <p className="item-dialog__desc">{l(item.description)}</p>}
            <p className="item-dialog__price">
              {orderable ? <span className="price">{money(item.price)}</span> : <span>{t.item.unavailable}</span>}
              {item.compareAt && <s>{money(item.compareAt)}</s>}
            </p>
          </header>

          {orderable && (
            <>
              {(item.options ?? []).map((g) => (
                <OptionGroupField
                  key={g.id}
                  group={g}
                  selections={selections}
                  onChange={setChoice}
                  invalid={showErrors && !groupSatisfied(selections, g)}
                />
              ))}

              {item.removable && item.removable.length > 0 && (
                <fieldset className="opt-group">
                  <legend className="opt-group__head">
                    <span className="opt-group__title">{t.item.remove}</span>
                    <span className="opt-group__tag">{t.item.optional}</span>
                  </legend>
                  <div className="chips">
                    {item.removable.map((ing) => {
                      const on = removed.includes(ing.en)
                      return (
                        <label key={ing.en} className={`chip chip--remove ${on ? 'is-on' : ''}`}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => setRemoved((r) => (on ? r.filter((x) => x !== ing.en) : [...r, ing.en]))}
                          />
                          <span>{ing[lang]}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              <div className="field item-dialog__notes">
                <label htmlFor="item-notes">{t.item.notes}</label>
                <textarea
                  id="item-notes"
                  className="textarea"
                  rows={2}
                  maxLength={200}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={item.notesHint ? l(item.notesHint) : t.item.notesPh}
                />
              </div>
            </>
          )}
        </div>

        <footer className="item-dialog__bar">
          {orderable ? (
            <>
              <QtyStepper value={qty} onChange={setQty} min={1} label={t.item.qty} />
              <button type="button" className="btn btn--yellow item-dialog__cta" onClick={submit} data-autofocus>
                <span>{missing.length && showErrors ? t.item.complete : editing ? t.item.update : t.item.addToCart}</span>
                <span className="price">{money(price * qty)}</span>
              </button>
            </>
          ) : (
            <a className="btn btn--wa btn--block" href={whatsappLink(`Hi, how much is the ${item.name}?`)} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" />
              {t.menu.ask}
            </a>
          )}
        </footer>
      </motion.div>
    </div>
  )
}

function OptionGroupField({
  group: g,
  selections,
  onChange,
  invalid,
}: {
  group: OptionGroup
  selections: Selections
  onChange: (g: OptionGroup, choiceId: string, units: number) => void
  invalid: boolean
}) {
  const { t, lang } = useLang()
  const picked = selections[g.id] ?? {}
  const total = groupTotal(selections, g)
  const max = g.max ?? (g.type === 'single' ? 1 : Infinity)
  const tag = g.required
    ? g.type === 'count' && g.min
      ? fmt(t.item.pick, { n: g.min })
      : t.item.required
    : Number.isFinite(max) && g.type !== 'single'
      ? fmt(t.item.upTo, { n: max })
      : t.item.optional

  return (
    <fieldset className={`opt-group ${invalid ? 'is-invalid' : ''}`} data-group={g.id}>
      <legend className="opt-group__head">
        <span className="opt-group__title">{g.label[lang]}</span>
        <span className={`opt-group__tag ${g.required ? 'is-req' : ''}`}>
          {g.type === 'count' && g.required ? `${total}/${g.max}` : tag}
        </span>
      </legend>
      {g.hint && <p className="opt-group__hint">{g.hint[lang]}</p>}

      {g.type === 'count' ? (
        <ul className="count-list">
          {g.choices.map((c) => {
            const n = picked[c.id] ?? 0
            return (
              <li key={c.id} className={n ? 'is-on' : ''}>
                <span className="count-list__name">
                  {c.label[lang]}
                  {c.price ? <small>+{money(c.price)}</small> : null}
                </span>
                <QtyStepper
                  small
                  value={n}
                  min={0}
                  max={n + Math.max(0, max - total)}
                  onChange={(v) => onChange(g, c.id, v)}
                  label={c.label[lang]}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="chips">
          {g.choices.map((c) => {
            const on = !!picked[c.id]
            const disabled = !on && g.type === 'multi' && total >= max
            return (
              <label key={c.id} className={`chip ${on ? 'is-on' : ''} ${disabled ? 'is-disabled' : ''}`}>
                <input
                  type={g.type === 'single' ? 'radio' : 'checkbox'}
                  name={g.id}
                  checked={on}
                  disabled={disabled}
                  onChange={() => onChange(g, c.id, on && g.type === 'multi' ? 0 : 1)}
                />
                <span>{c.label[lang]}</span>
                {c.price ? <small>+{money(c.price)}</small> : null}
              </label>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}
