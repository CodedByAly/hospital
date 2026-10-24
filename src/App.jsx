import { Route, Routes, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Header from './components/Header';
import ItemSheet from './components/ItemSheet';
import ScrollManager from './components/ScrollManager';
import TabBar from './components/TabBar';
import { CartProvider } from './context/CartContext';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Menu from './pages/Menu';
import NotFound from './pages/NotFound';

export default function App() {
  const { pathname } = useLocation();
  return (
    <CartProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Header />
      <main id="main" key={pathname} className="page-enter" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:number" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <TabBar />
      <BackToTop />
      <CartDrawer />
      <ItemSheet />
    </CartProvider>
  );
}
