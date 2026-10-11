import { useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title) {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = title ? `${title} · O'snack` : t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }, [title, t]);
}
