import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getCategory, itemsIn } from '../data/menu'
import { useItemSheet } from '../context/ItemContext'
import { photoUrl } from '../lib/asset'
import { formatPrice } from '../lib/format'
import './DealFan.css'

/** The restaurant's own deal posters, fanned like a hand of cards. */
export default function DealFan() {
  const category = getCategory('september-deal')
  const deals = itemsIn('september-deal')
  const { open } = useItemSheet()
  if (!category || !deals.length) return null
  const mid = (deals.length - 1) / 2

  return (
    <section className="deal" aria-labelledby="deal-title">
      <div className="container deal__grid">
        <div className="deal__copy">
          <p className="mark mark--ember">On now</p>
          <h2 id="deal-title" className="deal__title">{category.name}</h2>
          <p className="deal__text">{category.blurb}</p>
          <ul className="deal__list">
            {deals.map((d) => (
              <li key={d.id}>
                <button type="button" onClick={() => open(d.id)}>
                  <span>{d.name}</span>
                  <span className="deal__leader" aria-hidden="true" />
                  <span className="price">{formatPrice(d.price ?? 0)}</span>
                </button>
              </li>
            ))}
          </ul>
          <Link to="/menu/september-deal" className="link-arrow">See the deal in the menu</Link>
        </div>

        <div className="deal__fan">
          {deals.map((d, i) => {
            const o = i - mid
            return (
              <motion.button
                key={d.id}
                type="button"
                className="deal__card"
                onClick={() => open(d.id)}
                aria-label={`${d.name}, ${formatPrice(d.price ?? 0)}`}
                initial={{ rotate: 0, x: 0, y: 40, opacity: 0 }}
                whileInView={{ rotate: o * 8, x: `${o * 34}%`, y: Math.abs(o) * 14, opacity: 1 }}
                whileHover={{ y: -30, rotate: o * 4, scale: 1.05, zIndex: 20 }}
                whileFocus={{ y: -30, rotate: o * 4, scale: 1.05, zIndex: 20 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: 'spring', stiffness: 160, damping: 20, delay: i * 0.06 }}
                style={{ zIndex: 10 - Math.abs(Math.round(o)) }}
              >
                <img src={photoUrl(d.photo, 'sm')} alt="" loading="lazy" width="360" height="275" />
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
