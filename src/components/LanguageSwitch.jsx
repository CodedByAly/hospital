import { useLanguage } from '../context/LanguageContext'
import './LanguageSwitch.css'

/** Two-state toggle: EN | ع — the active language is pressed. */
export default function LanguageSwitch({ tone = 'dark' }) {
  const { lang, setLang, t } = useLanguage()
  return (
    <div className={`lang-switch lang-switch--${tone}`} role="group" aria-label={t('nav.language')}>
      <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
      <button type="button" lang="ar" aria-pressed={lang === 'ar'} onClick={() => setLang('ar')}>
        عربي
      </button>
    </div>
  )
}
