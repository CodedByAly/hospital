import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus } from 'lucide-react'
import { flyToCart, useCart } from '../cart.jsx'
import { BOOSTER_SECTIONS, MEAL_BOOSTER, SECTIONS, formatLBP } from '../data/menu.js'
import Footprints from './Footprints.jsx'

gsap.registerPlugin(ScrollTrigger)

// An add button showing the price. Each tap adds that exact item and size;
// the little bubble shows how many are already in the order.
function Price({ value, label, size, line, photo, onAdded }) {
  const { lines, dispatch } = useCart()
  const self = useRef(null)
  if (value == null) return <span className="price price--empty" aria-hidden="true" />
  const qty = lines.find((l) => l.key === line.key)?.qty ?? 0
  return (
    <button
      ref={self}
      className={`price ${qty ? 'is-in' : ''}`}
      aria-label={`Add ${line.name}${size ? `, ${size}` : ''}, ${formatLBP(value)} pounds${qty ? `, ${qty} in your order` : ''}`}
      onClick={() => {
        dispatch({ type: 'add', line: { ...line, unit: value } })
        // Throw the section photo if it's on screen, otherwise the button itself
        const img = photo?.current
        const box = img?.getBoundingClientRect()
        flyToCart(box && box.bottom > 0 && box.top < window.innerHeight ? img : self.current)
        onAdded(line.name)
      }}
    >
      <Plus className="price__plus" size={16} strokeWidth={3} aria-hidden="true" />
      <span className="price__amount">
        {label && <small>{label}</small>}
        {formatLBP(value)}
      </span>
      {qty > 0 && (
        <span className="qty" aria-hidden="true">
          {qty}
        </span>
      )}
    </button>
  )
}

function Row({ item, sizes, photo, onAdded }) {
  const rowSizes = item.sizes ?? sizes
  return (
    <li className="row">
      <div className="row__top">
        <span className="row__name">
          {item.name}
          {item.fav && <em className="mark mark--fav">fan favourite</em>}
          {item.spicy && <em className="mark mark--hot">spicy</em>}
        </span>
        <div className="row__prices">
          {item.prices ? (
            item.prices.map((p, i) => (
              <Price
                key={rowSizes[i]}
                value={p}
                label={rowSizes[i]}
                size={rowSizes[i]}
                line={{ key: `${item.id}|${rowSizes[i]}`, name: item.name, opts: [rowSizes[i]] }}
                photo={photo}
                onAdded={onAdded}
              />
            ))
          ) : (
            <Price value={item.price} line={{ key: item.id, name: item.name }} photo={photo} onAdded={onAdded} />
          )}
        </div>
      </div>
      {item.note && <p className="row__note">{item.note}</p>}
      {item.desc && <p className="row__desc">{item.desc}</p>}
      {item.addon && (
        <div className="row__addon">
          <span>+ {item.addon.name}</span>
          <Price
            value={item.addon.price}
            line={{ key: `${item.id}+addon`, name: `${item.addon.name} (add-on)` }}
            onAdded={onAdded}
          />
        </div>
      )}
    </li>
  )
}

function Booster({ onAdded }) {
  const { lines, dispatch } = useCart()
  const self = useRef(null)
  const qty = lines.find((l) => l.key === MEAL_BOOSTER.id)?.qty ?? 0
  return (
    <button
      ref={self}
      className="booster"
      aria-label={`Add a Meal Booster, fries and a soft drink, ${formatLBP(MEAL_BOOSTER.price)} pounds${qty ? `, ${qty} in your order` : ''}`}
      onClick={() => {
        dispatch({ type: 'add', line: { key: MEAL_BOOSTER.id, name: MEAL_BOOSTER.name, unit: MEAL_BOOSTER.price } })
        flyToCart(self.current)
        onAdded('Meal Booster')
      }}
    >
      <strong>Meal booster</strong>
      <span>add fries &amp; soft drink</span>
      <b>
        <Plus size={18} strokeWidth={3} aria-hidden="true" /> {formatLBP(MEAL_BOOSTER.price)}
      </b>
      {qty > 0 && (
        <span className="qty" aria-hidden="true">
          {qty}
        </span>
      )}
    </button>
  )
}

function Section({ section, onAdded }) {
  const root = useRef(null)
  const photo = useRef(null)
  const [first, ...rest] = section.title.split(' & ')

  // Photos are thrown onto the page as the section scrolls in
  useLayoutEffect(() => {
    if (!section.photos) return undefined
    const mm = gsap.matchMedia(root)
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.stack .sticker', {
        x: 260,
        y: 60,
        rotation: (i) => (i % 2 ? -40 : 40),
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      })
    })
    return () => mm.revert()
  }, [section.photos])

  return (
    <section
      ref={root}
      className={`band band--${section.tone}`}
      id={section.id}
      aria-labelledby={`${section.id}-t`}
    >
      <div className={`wrap msec ${section.photos ? '' : 'msec--solo'}`}>
        <div className="msec__lists">
          <h3 className="msec__title" id={`${section.id}-t`}>
            {first}
            {rest.length > 0 && (
              <>
                {' '}<span className="amp">&amp;</span> {rest.join(' & ')}
              </>
            )}
          </h3>
          {section.groups.map((g, gi) => (
            <div className="group" key={g.title ?? gi}>
              {g.title && <h4 className="group__title">{g.title}</h4>}
              <ul className="rows">
                {g.items.map((item) => (
                  <Row key={item.id} item={item} sizes={g.sizes} photo={photo} onAdded={onAdded} />
                ))}
              </ul>
            </div>
          ))}
          {BOOSTER_SECTIONS.includes(section.id) && <Booster onAdded={onAdded} />}
        </div>

        {section.photos && (
          <div className="stack">
            {section.photos.map((src, i) => (
              <img
                key={src}
                ref={i === 0 ? photo : undefined}
                className={`sticker sticker--${i % 3}`}
                src={`/images/${src}.webp`}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Menu({ onAdded }) {
  const [active, setActive] = useState(SECTIONS[0].id)

  // Highlight the section you're reading in the sticky bar
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
      <div className="wrap menu__head">
        <h2 id="menu-title">The menu</h2>
        <p>Tap <span className="hint-plus" aria-hidden="true">+</span> to add to your order. Prices in Lebanese pounds.</p>
      </div>

      <nav className="cats" aria-label="Menu sections">
        <div className="wrap cats__inner">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={active === s.id ? 'is-on' : ''}
              aria-current={active === s.id ? 'true' : undefined}
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {SECTIONS.map((s) => (
        <Section key={s.id} section={s} onAdded={onAdded} />
      ))}
      <Footprints className="menu__prints" steps={18} wave={30} />
    </section>
  )
}
