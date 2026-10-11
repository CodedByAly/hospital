import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import ItemSheet from './ItemSheet';
import BackToTop from './BackToTop';
import Splash from './Splash';

export default function Layout() {
  const location = useLocation();

  // New page: start at the top, or at the linked #section.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Splash />
      <Header />
      <main id="main" tabIndex={-1} className="page" key={location.pathname}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <TabBar />
      <BackToTop />
      <CartDrawer />
      <ItemSheet />
    </>
  );
}
