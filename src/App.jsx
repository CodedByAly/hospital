import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useI18n } from './i18n/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CartBar from './components/CartBar';
import ItemSheet from './components/ItemSheet';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Menu from './pages/Menu';

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function PageFallback() {
  const { t } = useI18n();
  return (
    <div className="page-loading" role="status">
      <span className="page-loading__bar" />
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
}

export default function App() {
  const { t } = useI18n();
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
      <ScrollManager />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<PageFallback />}>
          <div className="page" key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:orderId" element={<Confirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <ItemSheet />
      <CartBar />
      <BackToTop />
    </>
  );
}
