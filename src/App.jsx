import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';

// Less-visited pages load on demand to keep the first load small.
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <UIProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order/:orderId" element={<OrderConfirmation />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UIProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
