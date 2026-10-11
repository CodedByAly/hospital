import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en';
import ar from './ar';

const dictionaries = { en, ar };
const STORAGE_KEY = 'osnack.lang';

const LanguageContext = createContext(null);

function initialLang() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* storage unavailable */
  }
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'ar' : 'en')), []);

  const value = useMemo(
    () => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', t: dictionaries[lang], setLang, toggle }),
    [lang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
