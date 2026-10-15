import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en';
import ar from './ar';
import { interpolate } from '../lib/format';
import { readString, writeString } from '../lib/storage';

const dictionaries = { en, ar };
const STORAGE_KEY = 'lk.lang';

const LanguageContext = createContext(null);

function initialLanguage() {
  const stored = readString(STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') return stored;
  // First visit: follow the browser if it prefers Arabic.
  const browser = typeof navigator !== 'undefined' ? navigator.language || '' : '';
  return browser.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

function lookup(dict, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), dict);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    writeString(STORAGE_KEY, lang);
  }, [lang, dir]);

  const t = useCallback(
    (path, vars) => {
      const value = lookup(dictionaries[lang], path) ?? lookup(en, path);
      if (typeof value === 'string') return interpolate(value, vars);
      return value ?? path;
    },
    [lang],
  );

  // Pick the right language from a { en, ar } object (menu data, config).
  const pick = useCallback((value) => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.en || '';
  }, [lang]);

  const toggle = useCallback(() => setLang((current) => (current === 'ar' ? 'en' : 'ar')), []);

  const value = useMemo(() => ({ lang, dir, t, pick, setLang, toggle }), [lang, dir, t, pick, toggle]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useI18n must be used inside LanguageProvider');
  return context;
}
