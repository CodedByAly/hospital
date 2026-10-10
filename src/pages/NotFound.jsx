import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useMeta } from '../hooks/useMeta'

export default function NotFound() {
  const { t } = useLanguage()
  useMeta({ title: `404 — ${t('notFound.title')}` })
  return (
    <div className="container not-found">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1 className="page-title">{t('notFound.title')}</h1>
      <p className="muted">{t('notFound.lead')}</p>
      <Link to="/" className="btn btn--primary">{t('notFound.home')}</Link>
    </div>
  )
}
