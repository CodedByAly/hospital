import { useEffect, useState } from 'react'
import Logo from './Logo'
import { site } from '../data/site'
import './Splash.css'

const SEEN_KEY = 'cej:splash-seen'

// Short logo intro on the first visit of a session. Pure CSS, prerendered, and the real page
// is already underneath it, so it costs nothing for SEO or screen readers.
export default function Splash() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains('no-splash')) {
      setDone(true)
      return
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode */
    }
    const t = setTimeout(() => setDone(true), 2600)
    return () => clearTimeout(t)
  }, [])

  if (done) return null

  return (
    <div
      className="splash"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setDone(true)
      }}
    >
      <div className="splash__inner">
        <Logo className="splash__logo" />
        <p className="splash__tagline">{site.tagline}</p>
      </div>
    </div>
  )
}
