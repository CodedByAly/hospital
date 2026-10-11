import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import useDocumentMeta from '../hooks/useDocumentMeta';

export default function NotFound() {
  const { t } = useLanguage();
  useDocumentMeta(t.meta.notFound, t.meta.homeDescription);
  return (
    <div className="container narrow-page empty-state">
      <img src="/images/logo-shrimp.svg" alt="" className="empty-state__mark" />
      <h1 className="page-title">{t.notFound.title}</h1>
      <p>{t.notFound.body}</p>
      <Link to="/" className="btn btn--primary">{t.notFound.home}</Link>
    </div>
  );
}
