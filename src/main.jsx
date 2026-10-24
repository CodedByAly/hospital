import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/montserrat'
import App from './App'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships prerendered HTML (see scripts/prerender.js); dev renders fresh.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
