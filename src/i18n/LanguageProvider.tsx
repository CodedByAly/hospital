import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang, Localized } from '../data/types'
import { strings, type Strings } from './strings'
import { storage } from '../utils/storage'

interface LanguageContextValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  t: Strings
  /** Pick the right side of a { en, ar } pair. */
  l: (v: Localized) => string
  toggle: () => void
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const KEY = 'kuku.lang'

const initialLang = (): Lang => {
  const saved = storage.get<Lang>(KEY)
  if (saved === 'en' || saved === 'ar') return saved
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    storage.set(KEY, next)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: strings[lang],
      l: (v) => v[lang] || v.en,
      toggle: () => setLang(lang === 'en' ? 'ar' : 'en'),
      setLang,
    }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}

/** Replace {key} placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
