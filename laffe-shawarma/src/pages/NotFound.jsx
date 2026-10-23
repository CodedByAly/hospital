import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLang } from '../i18n/LanguageContext'

export default function NotFound() {
  const { t } = useLang()
  usePageMeta(t('notFound.title'))
  return (
    <div className="container checkout-empty">
      <p className="eyebrow">404</p>
      <h1 className="page-title page-title--dark">{t('notFound.title')}</h1>
      <p className="muted">{t('notFound.hint')}</p>
      <div className="row-actions">
        <Link to="/" className="btn btn--outline">
          {t('nav.home')}
        </Link>
        <Link to="/menu" className="btn btn--primary">
          {t('nav.menu')}
        </Link>
      </div>
    </div>
  )
}
