import { Link } from 'react-router-dom'
import { t } from '../content/text'

export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="not-found__code num">404</p>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.text')}</p>
      <Link to="/" className="btn btn--dark">
        {t('notFound.home')}
      </Link>
    </div>
  )
}
