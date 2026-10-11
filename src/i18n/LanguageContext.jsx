import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import strings from './strings';
import { readString, writeString } from '../lib/storage';

const STORAGE_KEY = 'qambri.lang';
const ARABIC_FONTS =
  'https://fonts.googleapis.com/css2?family=Lalezar&family=Readex+Pro:wght@300..700&display=swap';

const LanguageContext = createContext(null);

function initialLanguage() {
  const saved = readString(STORAGE_KEY);
  if (saved === 'ar' || saved === 'en') return saved;
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

/** Arabic fonts are only downloaded once someone actually switches to Arabic. */
function ensureArabicFonts() {
  if (document.getElementById('font-ar')) return;
  const link = document.createElement('link');
  link.id = 'font-ar';
  link.rel = 'stylesheet';
  link.href = ARABIC_FONTS;
  document.head.appendChild(link);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') ensureArabicFonts();
    writeString(STORAGE_KEY, lang);
  }, [lang]);

  const toggle = useCallback(() => {
    // Fade the page briefly so the LTR ↔ RTL flip doesn't feel like a jump.
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return setLang((l) => (l === 'ar' ? 'en' : 'ar'));
    root.classList.add('lang-switching');
    window.setTimeout(() => {
      setLang((l) => (l === 'ar' ? 'en' : 'ar'));
      window.setTimeout(() => root.classList.remove('lang-switching'), 40);
    }, 160);
  }, []);

  const value = useMemo(
    () => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', t: strings[lang], setLang, toggle }),
    [lang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
