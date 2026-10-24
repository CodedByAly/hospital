import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/dm-sans'
import App from './App'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production ships prerendered HTML (scripts/prerender.js); dev renders fresh.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
