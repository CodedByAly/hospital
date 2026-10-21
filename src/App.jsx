import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BackToTop } from './components/BackToTop.jsx'
import { CartDrawer } from './components/CartDrawer.jsx'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { ItemModal } from './components/ItemModal.jsx'
import { MobileDock } from './components/MobileDock.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'

// Secondary pages load on demand to keep the first load small.
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const Confirmation = lazy(() => import('./pages/Confirmation.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const inCheckout = pathname === '/checkout'

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" className={`main ${inCheckout ? 'main--checkout' : ''}`} key={pathname}>
        <Suspense fallback={<div className="page-loading" role="status" aria-label="Loading" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<Confirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {!inCheckout && <MobileDock />}
      <BackToTop />
      <ItemModal />
      <CartDrawer />
    </>
  )
}
