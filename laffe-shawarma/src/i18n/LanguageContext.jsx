import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { strings } from './strings'

export const LANG_KEY = 'laffet.lang'
export const LANGUAGES = { en: { dir: 'ltr', label: 'English' }, ar: { dir: 'rtl', label: 'عربي' } }

const LanguageContext = createContext(null)

function initialLang() {
  // index.html sets <html lang> from storage before the app loads.
  const fromDoc = document.documentElement.lang
  return LANGUAGES[fromDoc] ? fromDoc : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = LANGUAGES[lang].dir
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const setLang = useCallback((next) => {
    if (LANGUAGES[next]) setLangState(next)
  }, [])

  const value = useMemo(() => {
    const dict = strings[lang]
    /** t('cart.title') or t('menu.results', { count: 3 }) */
    const t = (key, vars) => {
      const entry = dict[key] ?? strings.en[key] ?? key
      return typeof entry === 'function' ? entry(vars ?? {}) : entry
    }
    /** Picks the current language from a { en, ar } value (plain strings pass through). */
    const pick = (value) => (value && typeof value === 'object' ? value[lang] ?? value.en : value ?? '')
    return { lang, dir: LANGUAGES[lang].dir, setLang, t, pick }
  }, [lang, setLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
