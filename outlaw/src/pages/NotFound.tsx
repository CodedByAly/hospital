import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'

export default function NotFound() {
  useMeta({ title: 'Page not found — Outlaw Sushi Bar', path: '/404' })
  return (
    <div className="container page-top notfound">
      <p className="mark mark--ember">404</p>
      <h1>This roll isn't on the menu.</h1>
      <p className="muted">The page you followed doesn't exist.</p>
      <Link to="/menu" className="btn btn--ember">Open the menu</Link>
    </div>
  )
}
