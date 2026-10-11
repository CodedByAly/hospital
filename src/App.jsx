import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileTabBar from './components/MobileTabBar.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ItemDialog from './components/ItemDialog.jsx';
import BranchPicker from './components/BranchPicker.jsx';
import BackToTop from './components/BackToTop.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import RouteProgress from './components/RouteProgress.jsx';
import Home from './pages/Home.jsx';
import MenuPage from './pages/MenuPage.jsx';

// Less-visited pages load on demand to keep the first load small.
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function PageFallback() {
  return (
    <div className="page-loading" role="status">
      <span className="spinner" />
      <span className="visually-hidden">Loading</span>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const inCheckout = pathname === '/checkout';

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <RouteProgress />
      <Header />
      <main id="main" className={`page ${inCheckout ? 'page--checkout' : ''}`} key={pathname}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:number" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {!inCheckout && <MobileTabBar />}
      <BackToTop />
      <CartDrawer />
      <ItemDialog />
      <BranchPicker />
    </>
  );
}
