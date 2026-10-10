import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CartProvider } from './context/CartContext'
import { FlyProvider } from './context/FlyContext'
import { ItemProvider } from './context/ItemContext'
import Header from './components/Header'
import TabBar from './components/TabBar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'

const Menu = lazy(() => import('./pages/Menu'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Confirmation = lazy(() => import('./pages/Confirmation'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** New page → start at the top (unless jumping to a #section). */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function PageLoader() {
  return <div className="page-loader" role="status" aria-label="Loading"><span /></div>
}

function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollManager />
      <Header />
      <main id="main" className="page" key={pathname} tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
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
      <TabBar />
      <CartDrawer />
      <BackToTop />
    </>
  )
}

// Hosts without URL rewriting (e.g. a single-file preview) can build with VITE_ROUTER=memory.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <CartProvider>
          <FlyProvider>
            <ItemProvider>
              <Layout />
            </ItemProvider>
          </FlyProvider>
        </CartProvider>
      </LanguageProvider>
    </Router>
  )
}
