import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { ItemSheetProvider } from './context/ItemSheetContext'
import { LanguageProvider, useLang } from './i18n/LanguageContext'
import BackToTop from './components/BackToTop'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Header from './components/Header'
import TabBar from './components/TabBar'
import About from './pages/About'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'
import OrderConfirmation from './pages/OrderConfirmation'

function useScrollReset(pathname) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}

export default function App() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  )
}

function Shell() {
  const { t } = useLang()
  const { pathname } = useLocation()
  useScrollReset(pathname)
  const focusedFlow = pathname === '/checkout'

  return (
    <CartProvider>
      <ItemSheetProvider>
        <a href="#main" className="skip-link">
          {t('nav.skip')}
        </a>
        <Header />
        <main id="main" key={pathname} className="page" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        {!focusedFlow && <TabBar />}
        <BackToTop />
        <CartDrawer />
      </ItemSheetProvider>
    </CartProvider>
  )
}
