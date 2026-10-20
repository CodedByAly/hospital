import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import BottomBar from './components/BottomBar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ItemSheet from './components/ItemSheet'
import Notice from './components/Notice'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import NotFound from './pages/NotFound'
import { CartProvider } from './context/CartContext'
import { UIProvider } from './context/UIContext'

// Scrolls to #hash targets (accounting for the sticky header via CSS
// scroll-margin) or to the top on page changes.
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    const isFirst = first.current
    first.current = false
    if (hash && hash !== '#top') {
      // Wait a frame so the target exists after a route change.
      const id = requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(id)
    }
    // On first load leave the browser's own scroll restoration alone.
    if (!isFirst) window.scrollTo({ top: 0, behavior: hash === '#top' ? 'smooth' : 'auto' })
  }, [pathname, hash, key])
  return null
}

// Which homepage section is on screen, for the nav highlight.
function useActiveSection() {
  const { pathname } = useLocation()
  const [active, setActive] = useState('top')
  useEffect(() => {
    if (pathname !== '/') return
    const ids = ['top', 'menu', 'about', 'contact']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])
  return active
}

function Shell() {
  const active = useActiveSection()
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Header activeSection={active} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <BottomBar activeSection={active} />
      <BackToTop />
      <CartDrawer />
      <ItemSheet />
      <Notice />
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <UIProvider>
        <Shell />
      </UIProvider>
    </CartProvider>
  )
}
