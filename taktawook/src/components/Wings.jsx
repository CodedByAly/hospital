import { useRef } from 'react'
import { flyToCart, useCart } from '../cart.jsx'
import { COMBOS, WHATSAPP, WING_FLAVORS, formatLBP } from '../data/menu.js'

function Combo({ combo, onAdded }) {
  const { dispatch } = useCart()
  const img = useRef(null)
  return (
    <div className="combo">
      <img ref={img} src={`/images/${combo.img}.webp`} alt={`${combo.name}: sandwich, fries and a soft drink`} loading="lazy" />
      <div className="combo__row">
        <div>
          <h3>{combo.name}</h3>
          <p className="combo__price">{formatLBP(combo.price)} LBP</p>
        </div>
        <button
          className="btn btn--small btn--red"
          onClick={() => {
            dispatch({ type: 'add', line: { key: combo.id, name: combo.name, unit: combo.price, img: combo.img } })
            flyToCart(img.current)
            onAdded(combo.name)
          }}
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default function Wings({ onAdded }) {
  const msg = encodeURIComponent('Hi, I would like to book a table for Open Wings.')
  return (
    <section className="wings" id="wings" aria-labelledby="wings-title">
      <div className="wrap wings__grid">
        <div className="poster">
          <div className="poster__copy">
            <h2 id="wings-title">All you can eat wings</h2>
            <p className="poster__prices">
              Open wings <b>$13</b>
              <br />
              Open boneless <b>$15</b>
            </p>
            <ul className="flavors">
              {WING_FLAVORS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="poster__note">Eat as much as you can, with open fries on the side.</p>
            <a className="btn btn--white" href={`https://wa.me/${WHATSAPP}?text=${msg}`} target="_blank" rel="noreferrer">
              Book on WhatsApp
            </a>
            <p className="poster__tag">Sauce. Bite. Repeat.</p>
          </div>
          <img className="poster__img" src="/images/wings-poster.webp" alt="Wings in five flavors with open fries" loading="lazy" />
        </div>

        <div className="combos">
          {COMBOS.map((c) => (
            <Combo key={c.id} combo={c} onAdded={onAdded} />
          ))}
        </div>
      </div>
    </section>
  )
}
