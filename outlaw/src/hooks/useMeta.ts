import { useEffect } from 'react'
import { restaurant } from '../config/restaurant'

/** Per-page title, description and canonical link. */
export function useMeta({ title, description, path }: { title: string; description?: string; path: string }) {
  useEffect(() => {
    document.title = title
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const base = restaurant.siteUrl || window.location.origin
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = base + path
  }, [title, description, path])
}
