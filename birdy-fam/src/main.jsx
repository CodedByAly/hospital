import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ShopProvider>
        <App />
      </ShopProvider>
    </ToastProvider>
  </StrictMode>,
)
