import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/dm-sans/wght.css'
import './styles/index.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// The homepage is prerendered at build time (see scripts/prerender.js).
// Hydrate only on "/" so hosts that serve index.html for every route
// still render other pages cleanly.
if (root.firstElementChild && window.location.pathname === '/') {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}
