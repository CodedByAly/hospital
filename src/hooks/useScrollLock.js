import { useEffect } from 'react'

let locks = 0

/** Locks page scroll while `active` — supports nested dialogs. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const { body, documentElement } = document
    if (locks++ === 0) {
      const gap = window.innerWidth - documentElement.clientWidth
      body.style.setProperty('--scrollbar-gap', `${gap}px`)
      body.classList.add('is-locked')
    }
    return () => {
      if (--locks === 0) body.classList.remove('is-locked')
    }
  }, [active])
}
