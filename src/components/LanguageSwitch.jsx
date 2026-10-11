import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitch({ className = '' }) {
  const { t, lang, toggle } = useLanguage();
  return (
    <button
      type="button"
      className={`lang-switch ${className}`}
      onClick={toggle}
      aria-label={t.nav.switchToLabel}
      lang={lang === 'ar' ? 'en' : 'ar'}
    >
      {t.nav.switchTo}
    </button>
  );
}
