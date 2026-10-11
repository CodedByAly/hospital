import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/anton/latin-400.css';
import './styles/global.css';
import App from './App.jsx';
import { ShopProvider } from './context/ShopContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ShopProvider>
        <App />
      </ShopProvider>
    </BrowserRouter>
  </StrictMode>,
);
