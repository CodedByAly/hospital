import { useEffect } from 'react'
import CartDrawer from './components/CartDrawer.jsx'
import Footer from './components/Footer.jsx'
import Header, { MobileBar } from './components/Header.jsx'
import ItemDialog from './components/ItemDialog.jsx'
import BackToTop from './components/BackToTop.jsx'
import { dismissSplash } from './components/Splash.js'
import Home from './pages/Home.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import NotFound from './pages/NotFound.jsx'
import { usePath } from './lib/router.js'

const routes = {
  '/': Home,
  '/checkout': Checkout,
  '/order-confirmed': Confirmation,
}

export default function App() {
  const path = usePath()
  const Page = routes[path.replace(/\/+$/, '') || '/'] || NotFound
  const isHome = Page === Home

  useEffect(dismissSplash, [])

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header isHome={isHome} />
      <div className="page-fade" key={path}>
        <Page />
      </div>
      <Footer />
      {Page !== Checkout && <MobileBar isHome={isHome} />}
      <BackToTop />
      <CartDrawer />
      <ItemDialog />
    </>
  )
}
