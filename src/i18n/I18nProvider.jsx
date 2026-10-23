import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import ar from './ar'
import { load, save } from '../lib/storage'

const dictionaries = { en, ar }
const STORAGE_KEY = 'moods:lang'

const I18nContext = createContext(null)

function initialLang() {
  const stored = load(STORAGE_KEY, null)
  if (stored === 'en' || stored === 'ar') return stored
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

const lookup = (dict, key) => key.split('.').reduce((node, part) => node?.[part], dict)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
    document.querySelector('meta[name="description"]')?.setAttribute('content', dictionaries[lang].meta.description)
    save(STORAGE_KEY, lang)
  }, [lang, dir])

  const t = useCallback(
    (key, vars) => {
      let value = lookup(dictionaries[lang], key) ?? lookup(en, key) ?? key
      if (typeof value === 'string' && vars) {
        value = value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '')
      }
      return value
    },
    [lang],
  )

  /** Picks the current language from a { en, ar } object. */
  const pick = useCallback((field) => (field ? field[lang] ?? field.en : ''), [lang])

  const value = useMemo(
    () => ({ lang, dir, t, pick, setLang, toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')) }),
    [lang, dir, t, pick],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
