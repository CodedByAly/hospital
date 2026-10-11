import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  const { t } = useLanguage();
  usePageMeta(t.notFound.title);
  return (
    <div className="container page-pad">
      <div className="empty-state empty-state--page">
        <p className="not-found__code" aria-hidden="true">404</p>
        <h1 className="empty-state__title">{t.notFound.title}</h1>
        <p>{t.notFound.text}</p>
        <Link to="/" className="btn btn--primary">{t.notFound.home}</Link>
      </div>
    </div>
  );
}
