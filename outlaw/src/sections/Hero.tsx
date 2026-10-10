import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { restaurant } from '../config/restaurant'
import { getItem } from '../data/menu'
import { useItemSheet } from '../context/ItemContext'
import { useTilt } from '../hooks/useTilt'
import { asset } from '../lib/asset'
import { formatPrice } from '../lib/format'
import './Hero.css'

/** The salmon-sun from the logo: an orange disc cut by curved lines. */
function Sun() {
  return (
    <svg viewBox="0 0 200 200" className="hero__sun-svg" aria-hidden="true">
      <circle cx="100" cy="100" r="100" fill="var(--ember)" />
      {[46, 72, 98, 124, 150].map((y, i) => (
        <path key={y} d={`M ${18 + i * 2} ${y} Q 100 ${y - 26} ${182 - i * 2} ${y}`} stroke="var(--ink)" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
      ))}
    </svg>
  )
}

export default function Hero() {
  const { open } = useItemSheet()
  const dish = getItem('outlaw-dragon')!
  const stage = useRef<HTMLDivElement>(null)
  const tilt = useTilt(7)
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], [0, -120])
  const sink = useTransform(scrollYProgress, [0, 1], [0, 80])
  // depth layers follow the pointer at different strengths
  const sunX = useTransform(tilt.px, [-0.5, 0.5], [-10, 10])
  const sunY = useTransform(tilt.py, [-0.5, 0.5], [-8, 8])
  const dishX = useTransform(tilt.px, [-0.5, 0.5], [-34, 34])
  const dishPy = useTransform(tilt.py, [-0.5, 0.5], [-22, 22])
  const dishY = useTransform(() => dishPy.get() + lift.get())
  const sunTotalY = useTransform(() => sunY.get() + sink.get())

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__copy">
          <motion.p className="mark mark--ember" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
            {restaurant.locality} · facing the municipality
          </motion.p>
          <h1 id="hero-title" className="hero__title">
            {['Sushi,', 'outside', 'the lines.'].map((w, i) => (
              <span key={w} className="hero__line">
                <motion.span initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ delay: 0.2 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero__lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
            Dragon maki, crispy ura rolls, futo, burritos and platters for the whole table. Dine in, take away or delivery.
          </motion.p>
          <motion.div className="hero__ctas" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
            <Link to="/menu" className="btn btn--ember btn--lg">
              Open the menu <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <button type="button" className="btn btn--line btn--lg" onClick={() => open(dish.id)}>
              {dish.name} · {formatPrice(dish.price ?? 0)}
            </button>
          </motion.div>
        </div>

        <div ref={stage} className="hero__stage" onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
          <motion.div className="hero__sun" style={{ x: sunX, y: sunTotalY }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
            <Sun />
          </motion.div>
          <span className="hero__stick hero__stick--a" aria-hidden="true" />
          <span className="hero__stick hero__stick--b" aria-hidden="true" />
          <motion.button
            type="button"
            className="hero__dish"
            style={{ x: dishX, y: dishY, rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
            initial={{ opacity: 0, rotateZ: -14, scale: 0.86 }}
            animate={{ opacity: 1, rotateZ: -8, scale: 1 }}
            transition={{ delay: 0.45, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => open(dish.id)}
            aria-label={`${dish.name}, ${formatPrice(dish.price ?? 0)}. Open details`}
          >
            <img src={asset('img/cut/outlaw-dragon.webp')} alt="" width="876" height="599" fetchPriority="high" />
          </motion.button>
          <motion.p className="hero__caption" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
            <span className="mark">On the plate</span>
            <strong>{dish.name}</strong>
            <span>Shrimp tempura, avocado, salmon, black tobiko</span>
          </motion.p>
        </div>
      </div>
      <ul className="hero__services container" aria-label="Services">
        {restaurant.services.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </section>
  )
}
