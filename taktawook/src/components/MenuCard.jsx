import { useId, useRef, useState } from 'react'
import { Flame, Plus, ThumbsUp } from 'lucide-react'
import { flyToCart, useCart } from '../cart.jsx'
import { BOOSTABLE, CATEGORIES, MEAL_BOOSTER, formatLBP } from '../data/menu.js'
import { FLYERS } from './FoodIcons.jsx'

const ICON_OF = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.icon]))

export default function MenuCard({ item, onAdded }) {
  const { dispatch } = useCart()
  const sizeNames = item.sizes ? Object.keys(item.sizes) : null
  const [size, setSize] = useState(sizeNames ? sizeNames[sizeNames.length - 1] : null)
  const [extra, setExtra] = useState(false)
  const [boost, setBoost] = useState(false)
  const visual = useRef(null)
  const uid = useId()
  const Icon = FLYERS[ICON_OF[item.cat]]

  const base = sizeNames ? item.sizes[size] : item.price
  const unit = base + (extra ? item.extra.price : 0) + (boost ? MEAL_BOOSTER.price : 0)
  const canBoost = BOOSTABLE.has(item.cat)

  const add = () => {
    const opts = [size, extra && item.extra.label, boost && 'Meal Booster'].filter(Boolean)
    dispatch({
      type: 'add',
      line: { key: `${item.id}|${opts.join('|')}`, name: item.name, opts, unit, icon: ICON_OF[item.cat] },
    })
    flyToCart(visual.current)
    onAdded(item.name)
  }

  return (
    <article className="card" aria-labelledby={`${uid}-name`}>
      <div className="card__top">
        <div ref={visual} className={`card__icon card__icon--${item.cat}`}>
          <Icon width="100%" height="100%" />
        </div>
        <div className="card__tags">
          {item.tags?.includes('fav') && (
            <span className="tag tag--fav">
              <ThumbsUp size={14} aria-hidden="true" /> Favourite
            </span>
          )}
          {item.tags?.includes('spicy') && (
            <span className="tag tag--spicy">
              <Flame size={14} aria-hidden="true" /> Spicy
            </span>
          )}
        </div>
      </div>

      <div className="card__body">
        <h3 id={`${uid}-name`}>{item.name}</h3>
        <p>{item.desc}</p>

        {sizeNames && (
          <fieldset className="seg">
            <legend className="sr-only">Size</legend>
            {sizeNames.map((s) => (
              <label key={s} className={size === s ? 'is-on' : ''}>
                <input type="radio" name={`${uid}-size`} value={s} checked={size === s} onChange={() => setSize(s)} />
                {s}
              </label>
            ))}
          </fieldset>
        )}

        {(item.extra || canBoost) && (
          <div className="card__opts">
            {item.extra && (
              <label className="check">
                <input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} />
                <span>
                  {item.extra.label} <small>+{item.extra.price.toLocaleString('en-US')}</small>
                </span>
              </label>
            )}
            {canBoost && (
              <label className="check">
                <input type="checkbox" checked={boost} onChange={(e) => setBoost(e.target.checked)} />
                <span>
                  Meal Booster <small>+{MEAL_BOOSTER.price.toLocaleString('en-US')}</small>
                </span>
              </label>
            )}
          </div>
        )}

        <div className="card__foot">
          <strong className="price">{formatLBP(unit)}</strong>
          <button className="add-btn" onClick={add} aria-label={`Add ${item.name} to bag`}>
            <Plus size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
