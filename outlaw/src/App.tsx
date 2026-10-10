import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ItemProvider } from './context/ItemContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ItemSheet from './components/ItemSheet'
import Home from './pages/Home'
import Menu from './pages/Menu'

const Checkout = lazy(() => import('./pages/Checkout'))
const Confirmation = lazy(() => import('./pages/Confirmation'))
const VisitPage = lazy(() => import('./pages/VisitPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Hosts that can't rewrite URLs (a single-file preview) can build with VITE_ROUTER=memory.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

function Pages() {
  const location = useLocation()
  // switching menu sections animates inside the menu, not as a page change
  const section = location.pathname.split('/')[1] || 'home'

  useEffect(() => {
    if (section !== 'menu') window.scrollTo({ top: 0 })
  }, [location.pathname, section])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        id="main"
        key={section}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<div className="page-top container" style={{ minHeight: '60vh' }} />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:categoryId" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<Confirmation />} />
            <Route path="/visit" element={<VisitPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    const splash = document.getElementById('splash')
    if (!splash) return
    const shown = Number(splash.dataset.start || 0)
    const wait = Math.max(0, 900 - (performance.now() - shown))
    const t = window.setTimeout(() => {
      splash.classList.add('splash--out')
      window.setTimeout(() => splash.remove(), 500)
    }, wait)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <CartProvider>
          <ItemProvider>
            <Header />
            <Pages />
            <Footer />
            <ItemSheet />
            <CartDrawer />
          </ItemProvider>
        </CartProvider>
      </Router>
    </MotionConfig>
  )
}
