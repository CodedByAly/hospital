import { useRef } from 'react'
import { Flame, Plus, Sparkles } from 'lucide-react'
import { flyToCart, useCart } from '../cart.jsx'
import { MEAL_BOOSTER, WHATSAPP, WING_FLAVORS, formatLBP } from '../data/menu.js'
import FlyingItems from './FlyingItems.jsx'

const COMBOS = [
  { id: 'combo-bbq', name: 'BBQ Burger Combo', desc: 'Barbecue burger, fries and a cold soft drink.', price: 700000, img: 'bbq-combo' },
  { id: 'combo-crispy', name: 'Crispy Sandwich Combo', desc: 'Crispy sub, fries and a cold soft drink.', price: 700000, img: 'crispy-combo' },
]

const FLYERS = [
  { type: 'Chili', x: '92%', y: '4%', size: 70, depth: 2, rotate: 30 },
  { type: 'Drumstick', x: '-2%', y: '46%', size: 90, depth: 3, rotate: -30, hideMobile: true },
]

function ComboCard({ combo }) {
  const { dispatch } = useCart()
  const img = useRef(null)
  const add = () => {
    dispatch({ type: 'add', line: { key: combo.id, name: combo.name, unit: combo.price, img: combo.img } })
    flyToCart(img.current)
  }
  return (
    <article className="combo reveal">
      <img ref={img} src={`/images/${combo.img}.webp`} alt={combo.name} loading="lazy" width="739" height="421" />
      <div className="combo__body">
        <h3>{combo.name}</h3>
        <p>{combo.desc}</p>
        <div className="combo__foot">
          <strong>{formatLBP(combo.price)}</strong>
          <button className="btn btn--small btn--primary" onClick={add}>
            <Plus size={18} aria-hidden="true" /> Add to bag
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Offers() {
  const msg = encodeURIComponent("Hi Taktawook! I'd like to book a table for Open Wings.")
  return (
    <section className="offers section" id="offers" aria-labelledby="offers-title">
      <FlyingItems items={FLYERS} mouse={false} />
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Hot right now</p>
          <h2 id="offers-title">Deals worth the drive</h2>
        </header>

        <div className="offers__grid">
          <article className="wings reveal">
            <div className="wings__copy">
              <span className="pill pill--hot">
                <Flame size={16} aria-hidden="true" /> All you can eat
              </span>
              <h3>
                Open Wings <em>$13</em>
                <br />
                Open Boneless <em>$15</em>
              </h3>
              <p>Five flavors. Unlimited refills. Open fries on the side. All the fun.</p>
              <ul className="flavors" aria-label="Wing flavors">
                {WING_FLAVORS.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                className="btn btn--light"
                href={`https://wa.me/${WHATSAPP}?text=${msg}`}
                target="_blank"
                rel="noreferrer"
              >
                Reserve on WhatsApp
              </a>
            </div>
            <img
              src="/images/wings-poster.webp"
              alt="Five baskets of wings in Sweet & Chili, Plain, Grilled, Buffalo and BBQ flavors with open fries"
              loading="lazy"
              width="552"
              height="782"
            />
          </article>

          <div className="offers__stack">
            {COMBOS.map((c) => (
              <ComboCard key={c.id} combo={c} />
            ))}
            <div className="booster reveal">
              <Sparkles size={28} aria-hidden="true" />
              <div>
                <strong>Meal Booster</strong>
                <span>Add fries &amp; a soft drink to any sandwich or burger for {formatLBP(MEAL_BOOSTER.price)}.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
