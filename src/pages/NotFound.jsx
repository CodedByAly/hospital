import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <main id="main" className="page">
      <div className="container narrow">
        <div className="empty-state">
          <p className="eyebrow">404</p>
          <h1 className="display display--sm">This page swam off</h1>
          <p>The link may be old or mistyped. The menu is still where you left it.</p>
          <div className="empty-state__actions">
            <Link to="/" className="btn btn--primary btn--lg">Back to home</Link>
            <Link to="/#menu" className="btn btn--ghost btn--lg">See the menu</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
