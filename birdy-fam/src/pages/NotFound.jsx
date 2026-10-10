import { useEffect } from 'react'
import { restaurant } from '../data/restaurant.js'
import { goToSection } from '../lib/router.js'

export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found | ${restaurant.name}`
  }, [])
  return (
    <main id="main" className="page not-found container">
      <img src="/images/logo-240.webp" alt="" width="120" height="120" />
      <h1 className="page-title">This page flew the coop</h1>
      <p className="muted">The link might be old or mistyped.</p>
      <button type="button" className="btn btn--primary" onClick={() => goToSection('top')}>Back to the home page</button>
    </main>
  )
}
