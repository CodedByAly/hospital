import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta.js'

export default function NotFound() {
  usePageMeta('Page not found')
  return (
    <div className="container checkout-empty">
      <h1 className="page-title">This page isn&rsquo;t on the menu.</h1>
      <p>The link may be old or mistyped.</p>
      <div className="confirm__help-actions">
        <Link to="/" className="btn btn--primary">
          Go home
        </Link>
        <Link to="/menu" className="btn btn--ghost">
          See the menu
        </Link>
      </div>
    </div>
  )
}
