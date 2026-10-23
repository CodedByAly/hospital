import { useI18n } from '../i18n/I18nProvider'

export default function LanguageSwitch({ compact = false }) {
  const { lang, setLang, t } = useI18n()

  if (compact) {
    const next = lang === 'ar' ? 'en' : 'ar'
    return (
      <button
        type="button"
        className="lang-compact"
        onClick={() => setLang(next)}
        lang={next}
        aria-label={t('lang.switchTo')}
      >
        {t('lang.short')}
      </button>
    )
  }

  return (
    <div className="lang-switch" role="group" aria-label={t('lang.label')}>
      {[
        ['en', 'EN'],
        ['ar', 'عربي'],
      ].map(([code, label]) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          className={lang === code ? 'is-active' : ''}
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
      <span className="lang-switch__thumb" aria-hidden="true" />
    </div>
  )
}
