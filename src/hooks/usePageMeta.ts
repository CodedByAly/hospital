import { useEffect } from 'react'
import { restaurant } from '../config/restaurant'

/** Sets document title and meta description per page. */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${restaurant.name}` : `${restaurant.name} — Fried chicken in Khaldeh`
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
