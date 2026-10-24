import { useEffect, useState } from 'react'
import { Lockup } from './Logo'
import { site } from '../data/site'
import './Splash.css'

const SEEN_KEY = 'ba:splash-seen'

// Short brand intro on the first visit of a session. Pure CSS animation: it's in the
// prerendered HTML so the logo paints immediately, and it never blocks the page content
// underneath (which search engines and screen readers read as normal).
export default function Splash() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('no-splash')) {
      setDone(true)
      return
    }
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode — the splash simply shows again next time */
    }
    // Safety net in case animationend never fires (tab in background, etc.)
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
        <Lockup className="splash__logo" />
        <p className="splash__tagline">{site.tagline}</p>
      </div>
    </div>
  )
}
