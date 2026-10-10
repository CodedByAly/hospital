import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag } from 'lucide-react'
import { CartProvider, useCart } from './cart.jsx'
import { formatLBP } from './data/menu.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Offers from './components/Offers.jsx'
import MenuSection from './components/MenuSection.jsx'
import Story from './components/Story.jsx'
import Gallery from './components/Gallery.jsx'
import Locations from './components/Locations.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'

gsap.registerPlugin(ScrollTrigger)

function BagBar({ onOpen }) {
  const { count, total } = useCart()
  if (!count) return null
  return (
    <button className="bagbar" onClick={onOpen}>
      <ShoppingBag size={20} aria-hidden="true" />
      <span>View bag · {count}</span>
      <strong>{formatLBP(total)}</strong>
    </button>
  )
}

function Site() {
  const [bagOpen, setBagOpen] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef(0)

  const onAdded = useCallback((name) => {
    setToast(`${name} added to your bag`)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2400)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  // Generic scroll reveal for anything tagged .reveal
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' }),
      })
      gsap.set('.reveal', { opacity: 0 })
    })
    return () => mm.revert()
  }, [])

  return (
    <>
      <a href="#menu" className="skip">Skip to menu</a>
      <Nav onOpenCart={() => setBagOpen(true)} />
      <main>
        <Hero />
        <Marquee />
        <Offers />
        <MenuSection onAdded={onAdded} />
        <Marquee tilt={2} tone="teal" />
        <Story />
        <Gallery />
        <Locations />
      </main>
      <Footer />
      <BagBar onOpen={() => setBagOpen(true)} />
      <CartDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
      <div className={`toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Site />
    </CartProvider>
  )
}
