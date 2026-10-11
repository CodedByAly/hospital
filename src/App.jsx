import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useLanguage } from './i18n/LanguageContext';
import Header from './components/Header';
import MobileBar from './components/MobileBar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ItemSheet from './components/ItemSheet';
import Toast from './components/Toast';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <>
      <a href="#main" className="skip-link">{t.common.skip}</a>
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1} className="page-enter" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBar />
      <CartDrawer />
      <ItemSheet />
      <Toast />
    </>
  );
}
