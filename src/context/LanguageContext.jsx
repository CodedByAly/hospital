import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { makePick, makeT } from '../i18n/translate'
import { storage } from '../lib/storage'

const LanguageContext = createContext(null)
const KEY = 'adams:lang'

function initialLanguage() {
  const saved = storage.get(KEY)
  if (saved === 'en' || saved === 'ar') return saved
  // index.html may already have set it before React loaded
  return document.documentElement.lang === 'ar' ? 'ar' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage)

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    storage.set(KEY, lang)
  }, [lang])

  const t = useMemo(() => makeT(lang), [lang])
  /** Picks the right language from a { en, ar } object (menu data, config). */
  const pick = useMemo(() => makePick(lang), [lang])

  const value = useMemo(
    () => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', isRTL: lang === 'ar', setLang, toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')), t, pick }),
    [lang, t, pick],
  )
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext)
