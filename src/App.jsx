import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { I18nProvider, useI18n } from './i18n/I18nProvider'
import { CartProvider } from './context/CartContext'
import { UIProvider, useUI } from './context/UIContext'
import Header, { TabBar } from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ItemModal from './components/ItemModal'
import Splash from './components/Splash'
import Home from './pages/Home'
import Menu from './pages/Menu'

const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const NotFound = lazy(() => import('./pages/NotFound'))

const titles = {
  '/menu': 'nav.menu',
  '/about': 'nav.about',
  '/contact': 'nav.contact',
  '/checkout': 'checkout.title',
}

/** Page title per route, scroll to top on navigation, close overlays. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const { t } = useI18n()
  const { closeCart, closeItem } = useUI()

  useEffect(() => {
    const key = titles[pathname] ?? (pathname.startsWith('/order/') ? 'confirm.number' : null)
    document.title = key ? `${t(key)} | Moods Burger` : t('meta.title')
  }, [pathname, t])

  useEffect(() => {
    closeCart()
    closeItem()
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function Layout() {
  const { t } = useI18n()
  const location = useLocation()

  return (
    <>
      <a href="#main" className="skip-link">
        {t('nav.skip')}
      </a>
      <Header />
      <main id="main" className="route-enter" key={location.pathname} tabIndex={-1}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" aria-label={t('common.loading')} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <TabBar />
      <CartDrawer />
      <ItemModal />
      <RouteEffects />
      <Splash />
    </>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <CartProvider>
        <UIProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </UIProvider>
      </CartProvider>
    </I18nProvider>
  )
}
