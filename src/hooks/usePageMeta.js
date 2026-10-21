import { useEffect } from 'react'
import { restaurant } from '../config/restaurant.js'

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${restaurant.name} – ${restaurant.address.locality}` : `${restaurant.name} – Burgers, Subs & Salads in ${restaurant.address.locality}`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
