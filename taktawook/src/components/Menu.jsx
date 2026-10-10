import { useEffect, useRef, useState } from 'react'
import { flyToCart, useCart } from '../cart.jsx'
import { MEAL_BOOSTER, SECTIONS, formatLBP } from '../data/menu.js'
import Footprints from './Footprints.jsx'

// One price button. Tapping a price adds that exact item and size to the order.
function Price({ value, label, size, line, photo, onAdded }) {
  const { dispatch } = useCart()
  const self = useRef(null)
  if (value == null) return <span className="price price--empty" aria-hidden="true" />
  return (
    <button
      ref={self}
      className="price"
      aria-label={`Add ${line.name}${size ? `, ${size}` : ''}, ${formatLBP(value)} pounds`}
      onClick={() => {
        dispatch({ type: 'add', line: { ...line, unit: value } })
        // Throw the section photo if it's on screen, otherwise the price itself
        const img = photo?.current
        const visible = img && img.getBoundingClientRect().bottom > 0 && img.getBoundingClientRect().top < window.innerHeight
        flyToCart(visible ? img : self.current)
        onAdded(line.name)
      }}
    >
      {label && <small>{label}</small>}
      {formatLBP(value)}
    </button>
  )
}

function Row({ item, sizes, photo, onAdded }) {
  const rowSizes = item.sizes ?? sizes
  return (
    <li className="row">
      <div className="row__name">
        <span>
          {item.name}
          {item.fav && <em className="mark mark--fav">fan favourite</em>}
          {item.spicy && <em className="mark mark--hot">spicy</em>}
        </span>
        {item.note && <small>{item.note}</small>}
        {item.addon && (
          <span className="row__addon">
            + {item.addon.name}
            <Price
              value={item.addon.price}
              line={{ key: `${item.id}+addon`, name: `${item.addon.name} (add-on)` }}
              onAdded={onAdded}
            />
          </span>
        )}
      </div>
      <span className="row__dots" aria-hidden="true" />
      <div className="row__prices">
        {item.prices
          ? item.prices.map((p, i) => (
              <Price
                key={rowSizes[i]}
                value={p}
                label={item.sizes ? rowSizes[i] : undefined}
                size={rowSizes[i]}
                line={{ key: `${item.id}|${rowSizes[i]}`, name: item.name, opts: [rowSizes[i]] }}
                photo={photo}
                onAdded={onAdded}
              />
            ))
          : <Price value={item.price} line={{ key: item.id, name: item.name }} photo={photo} onAdded={onAdded} />}
      </div>
    </li>
  )
}

function Section({ section, onAdded }) {
  const photo = useRef(null)
  const [first, ...rest] = section.title.split(' & ')
  return (
    <section className={`msec msec--${section.id}`} id={section.id} aria-labelledby={`${section.id}-t`}>
      <div className="msec__lists">
        <h3 className="msec__title" id={`${section.id}-t`}>
          {rest.length ? (
            <>
              {first} <span className="amp">&amp;</span> {rest.join(' & ')}
            </>
          ) : (
            section.title
          )}
        </h3>
        {section.groups.map((g, gi) => (
          <div className="group" key={g.title ?? gi}>
            {(g.title || g.sizes) && (
              <div className="group__head">
                {g.title && <h4>{g.title}</h4>}
                {g.sizes && (
                  <div className="group__sizes" aria-hidden="true">
                    {g.sizes.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            <ul className={`rows ${g.sizes ? 'rows--sized' : ''}`}>
              {g.items.map((item) => (
                <Row key={item.id} item={item} sizes={g.sizes} photo={photo} onAdded={onAdded} />
              ))}
            </ul>
          </div>
        ))}
        {['sandwiches', 'burgers'].includes(section.id) && <Booster onAdded={onAdded} />}
      </div>
      {section.img && (
        <div className="msec__photo">
          <img ref={photo} src={`/images/${section.img}.webp`} alt="" loading="lazy" />
        </div>
      )}
    </section>
  )
}

function Booster({ onAdded }) {
  const { dispatch } = useCart()
  const self = useRef(null)
  return (
    <button
      ref={self}
      className="booster"
      onClick={() => {
        dispatch({ type: 'add', line: { key: MEAL_BOOSTER.id, name: MEAL_BOOSTER.name, unit: MEAL_BOOSTER.price } })
        flyToCart(self.current)
        onAdded('Meal Booster')
      }}
    >
      <strong>Meal booster</strong>
      <span>add fries &amp; soft drink</span>
      <b>{formatLBP(MEAL_BOOSTER.price)}</b>
    </button>
  )
}

export default function Menu({ onAdded }) {
  const [active, setActive] = useState(SECTIONS[0].id)

  // Highlight the category you're reading in the sticky bar
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SECTIONS.forEach((s) => io.observe(document.getElementById(s.id)))
    return () => io.disconnect()
  }, [])

  return (
    <section className="menu" id="menu" aria-labelledby="menu-title">
      <div className="wrap">
        <div className="menu__head">
          <h2 id="menu-title">The menu</h2>
          <p>Tap a price to add it to your order. Prices in Lebanese pounds.</p>
        </div>

        <nav className="cats" aria-label="Menu sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-on' : ''} aria-current={active === s.id ? 'true' : undefined}>
              {s.title}
            </a>
          ))}
        </nav>

        {SECTIONS.map((s, i) => (
          <div key={s.id}>
            <Section section={s} onAdded={onAdded} />
            {i < SECTIONS.length - 1 && <Footprints className="menu__prints" steps={18} wave={30} />}
          </div>
        ))}
      </div>
    </section>
  )
}
