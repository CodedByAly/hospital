import { useEffect, useState } from 'react'

const listeners = new Set()

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname + window.location.hash) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  listeners.forEach((fn) => fn())
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    listeners.add(update)
    window.addEventListener('popstate', update)
    return () => {
      listeners.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return path
}

/** Go to a section on the home page, switching pages first if needed. */
export function goToSection(id) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (window.location.pathname !== '/') {
    navigate('/')
    requestAnimationFrame(() => requestAnimationFrame(scroll))
  } else scroll()
  if (id) window.history.replaceState({}, '', id === 'top' ? '/' : `/#${id}`)
}
