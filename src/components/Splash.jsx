import { useEffect } from 'react'

/**
 * The splash markup lives in index.html so it paints before JavaScript
 * loads. Once the app has mounted we keep it up just long enough for the
 * logo animation, then fade it out and remove it.
 */
const MIN_VISIBLE = 900

export default function Splash() {
  useEffect(() => {
    const el = document.getElementById('splash')
    if (!el) return
    const started = Number(el.dataset.start) || 0
    const wait = Math.max(0, MIN_VISIBLE - (performance.now() - started))
    let removeTimer
    const hideTimer = setTimeout(() => {
      el.classList.add('is-leaving')
      removeTimer = setTimeout(() => el.remove(), 500)
    }, wait)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return null
}
