import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/ibm-plex-sans-arabic/arabic-400.css'
import '@fontsource/ibm-plex-sans-arabic/arabic-500.css'
import '@fontsource/ibm-plex-sans-arabic/arabic-600.css'
import '@fontsource/ibm-plex-sans-arabic/latin-400.css'
import '@fontsource/ibm-plex-sans-arabic/latin-600.css'
import '@fontsource/lalezar/arabic-400.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

/*
 * Splash: rendered in index.html so it shows before any JS runs, then faded
 * out once the app has painted. Shown once per visit and kept short.
 */
const splash = document.getElementById('splash')
if (splash) {
  const MIN_VISIBLE = 900
  const elapsed = performance.now()
  setTimeout(
    () => {
      splash.classList.add('is-leaving')
      splash.addEventListener('transitionend', () => splash.remove(), { once: true })
      setTimeout(() => splash.remove(), 800)
      try {
        sessionStorage.setItem('laffet.splash', '1')
      } catch {
        /* ignore */
      }
    },
    Math.max(0, MIN_VISIBLE - elapsed),
  )
}
