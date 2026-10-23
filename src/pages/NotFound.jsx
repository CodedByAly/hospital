import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('الصفحة مش موجودة')
  return (
    <div className="container checkout-empty">
      <p className="eyebrow">404</p>
      <h1 className="page-title page-title--dark">هالصفحة مش موجودة</h1>
      <p className="muted">يمكن الرابط غلط. المنيو بعدو محلّو.</p>
      <div className="row-actions">
        <Link to="/" className="btn btn--outline">
          الرئيسية
        </Link>
        <Link to="/menu" className="btn btn--primary">
          المنيو
        </Link>
      </div>
    </div>
  )
}
