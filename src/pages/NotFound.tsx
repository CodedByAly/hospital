import { Link } from 'react-router-dom'
import { copy as t } from '../content/copy'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('404')
  return (
    <div className="container" style={{ display: 'grid', justifyItems: 'center', gap: 20, padding: '120px 16px', textAlign: 'center' }}>
      <p className="price" style={{ fontSize: '6rem', lineHeight: 1, color: 'var(--yellow)', WebkitTextStroke: '2px var(--ink)' }}>404</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>{t.notFound.title}</h1>
      <Link to="/" className="btn btn--yellow">{t.notFound.back}</Link>
    </div>
  )
}
