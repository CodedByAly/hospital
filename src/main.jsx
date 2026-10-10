import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque/wdth.css'
import '@fontsource-variable/instrument-sans/index.css'
import '@fontsource-variable/readex-pro/index.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/ui.css'
import App from './App.jsx'
import { injectMenuStructuredData } from './lib/structuredData'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

injectMenuStructuredData()

// Hide the splash (rendered by index.html before JS loads) once the app has painted.
const splash = document.getElementById('splash')
if (splash) {
  const shownAt = Number(splash.dataset.start) || performance.now()
  const minVisible = 900 // let the logo animation finish; skipped entirely on repeat visits
  const wait = Math.max(0, minVisible - (performance.now() - shownAt))
  setTimeout(() => {
    splash.classList.add('splash--out')
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
    setTimeout(() => splash.remove(), 800)
  }, wait)
}
