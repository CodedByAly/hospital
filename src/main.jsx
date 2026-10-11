import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';
import App from './App';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
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

// Hide the splash screen (rendered by index.html) once the app has painted.
window.__hideSplash?.();
