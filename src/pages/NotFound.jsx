import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import usePageMeta from '../lib/usePageMeta';
import { TreeMark } from '../components/Logo';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('meta.notFoundTitle'));
  return (
    <section className="container checkout-empty" style={{ display: 'grid', justifyItems: 'center', textAlign: 'center', gap: '1rem', paddingBlock: '6rem' }}>
      <TreeMark className="checkout-empty__mark" />
      <h1 style={{ fontSize: '2rem' }}>{t('notFound.title')}</h1>
      <p style={{ color: 'var(--ink-2)' }}>{t('notFound.text')}</p>
      <Link to="/" className="btn">{t('notFound.cta')}</Link>
    </section>
  );
}
