// Base styles first so component styles can override them.
import './styles/base.css'
import './styles/extras.css'
import { CartProvider } from './cart/CartContext'
import Splash from './components/Splash'
import Header from './components/Header'
import Hero from './components/Hero'
import Menu from './components/menu/Menu'
import About from './components/About'
import Contact from './components/Contact'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import OrderBar from './components/OrderBar'
import CartDrawer from './components/CartDrawer'
import ItemSheet from './components/ItemSheet'
import Confirmation from './components/Confirmation'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <CartProvider>
      <Splash />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Menu />
        <About />
        <Contact />
        <Feedback />
      </main>
      <Footer />
      <BackToTop />
      <OrderBar />
      {/* Order matters: later dialogs stack on top (editing an item from the cart) */}
      <CartDrawer />
      <ItemSheet />
      <Confirmation />
    </CartProvider>
  )
}
