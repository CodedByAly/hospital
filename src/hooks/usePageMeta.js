import { useEffect } from 'react'
import { restaurant } from '../config/restaurant'

const SITE = `${restaurant.name} | ${restaurant.nameLatin}`

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title, description = restaurant.description) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — مشاوي وساندويشات`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
