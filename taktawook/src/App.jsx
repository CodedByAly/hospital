import { useCallback, useEffect, useRef, useState } from 'react'
import { CartProvider, useCart } from './cart.jsx'
import { formatLBP } from './data/menu.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Wings from './components/Wings.jsx'
import Menu from './components/Menu.jsx'
import About from './components/About.jsx'
import Locations from './components/Locations.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'

function OrderBar({ onOpen }) {
  const { count, total } = useCart()
  if (!count) return null
  return (
    <button className="orderbar" onClick={onOpen}>
      <span>View order ({count})</span>
      <strong>{formatLBP(total)} LBP</strong>
    </button>
  )
}

function Site() {
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef(0)

  const onAdded = useCallback((name) => {
    setToast(`Added: ${name}`)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2200)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <>
      <a href="#menu" className="skip">Skip to the menu</a>
      <Nav onOpenCart={() => setOpen(true)} />
      <main>
        <Hero />
        <Wings onAdded={onAdded} />
        <Menu onAdded={onAdded} />
        <About />
        <Locations />
      </main>
      <Footer />
      <OrderBar onOpen={() => setOpen(true)} />
      <CartDrawer open={open} onClose={() => setOpen(false)} />
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
