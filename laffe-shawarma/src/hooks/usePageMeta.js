import { useEffect } from 'react'
import { restaurant } from '../config/restaurant'
import { useLang } from '../i18n/LanguageContext'

/** Sets the document title and meta description for the current page and language. */
export function usePageMeta(title, description) {
  const { t, pick, lang } = useLang()
  useEffect(() => {
    const site = pick(restaurant.name)
    document.title = title ? `${title} — ${site}` : `${site} — ${t('meta.home')}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description ?? pick(restaurant.description))
  }, [title, description, lang, t, pick])
}
