import { useLanguage } from '../i18n/LanguageContext';

export default function LangSwitch({ className = '' }) {
  const { t, toggle, lang } = useLanguage();
  return (
    <button
      type="button"
      className={`lang-switch ${className}`}
      onClick={toggle}
      aria-label={t.nav.switchLangLabel}
      lang={lang === 'en' ? 'ar' : 'en'}
    >
      {t.nav.switchLang}
    </button>
  );
}
