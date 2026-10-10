import { useEffect } from 'react'
import { restaurant } from '../config/restaurant'

const setMeta = (selector, attr, value) => {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    // create <link rel="canonical"> / <meta property="og:url"> on first use
    const [, tag, key, name] = selector.match(/^(\w+)\[(\w+)="([^"]+)"\]$/)
    el = document.createElement(tag)
    el.setAttribute(key, name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/** Per-page <title>, description, canonical and Open Graph tags. */
export function useMeta({ title, description, path = '/' }) {
  useEffect(() => {
    if (title) document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    if (restaurant.siteUrl) {
      setMeta('link[rel="canonical"]', 'href', restaurant.siteUrl + path)
      setMeta('meta[property="og:url"]', 'content', restaurant.siteUrl + path)
    }
  }, [title, description, path])
}
