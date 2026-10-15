import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';
import App from './App';
import './styles/global.css';
import './styles/forms.css';
import './styles/layout.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <CartProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Hide the splash once the app has painted (index.html keeps it short and skips it on repeat visits).
requestAnimationFrame(() => window.__hideSplash?.());
