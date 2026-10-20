import { useEffect } from 'react'
import { restaurant } from '../config/restaurant'

export const baseTitle = `${restaurant.legalName} | Shrimp, Fish & Chicken in Hleliyeh, Saida`

export default function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} | ${restaurant.legalName}` : baseTitle
    return () => {
      document.title = previous
    }
  }, [title])
}
