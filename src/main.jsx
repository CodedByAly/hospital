import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Global tokens and base styles first, so component styles can build on them.
import './styles/global.css';
import { CartProvider } from './context/CartContext';
import { UIProvider } from './context/UIContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <UIProvider>
        <App />
      </UIProvider>
    </CartProvider>
  </StrictMode>
);
