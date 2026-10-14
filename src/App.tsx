import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { copy as t } from './content/copy'
import { CartProvider } from './store/cart'
import { UIProvider } from './store/ui'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { ItemDialog } from './components/ItemDialog'
import { Splash } from './components/Splash'
import Home from './pages/Home'
import Menu from './pages/Menu'

// Less-visited pages load on demand.
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Confirmation = lazy(() => import('./pages/Confirmation'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function PageFallback() {
  return <div className="page-loading" aria-busy="true" />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<Confirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

function Shell() {
  return (
    <>
      <a href="#main" className="skip-link">{t.nav.skip}</a>
      <Splash />
      <Header />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
      <CartDrawer />
      <ItemDialog />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
        <CartProvider>
          <BrowserRouter>
            <UIProvider>
              <ScrollManager />
              <Shell />
            </UIProvider>
          </BrowserRouter>
        </CartProvider>
    </MotionConfig>
  )
}
