import { useLang } from '../i18n/LanguageContext'

/** Toggles English / Arabic. The label is written in the language you switch to. */
export default function LanguageSwitch({ className = '' }) {
  const { lang, setLang, t } = useLang()
  const next = lang === 'en' ? 'ar' : 'en'
  return (
    <button type="button" className={`lang-switch ${className}`} onClick={() => setLang(next)} lang={next} aria-label={t('lang.switchLabel')}>
      {t('lang.switch')}
    </button>
  )
}
