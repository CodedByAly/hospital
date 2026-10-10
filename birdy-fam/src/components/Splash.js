/**
 * The splash markup lives in index.html so it paints before any JavaScript loads.
 * Once React has rendered, keep it up for a short minimum time and then fade it out.
 */
const MIN_VISIBLE_MS = 1100

export function dismissSplash() {
  const el = document.getElementById('splash')
  if (!el) return
  const elapsed = performance.now()
  const wait = Math.max(0, MIN_VISIBLE_MS - elapsed)
  setTimeout(() => {
    el.classList.add('splash--out')
    el.addEventListener('transitionend', () => el.remove(), { once: true })
    setTimeout(() => el.remove(), 800) // in case transitionend never fires
  }, wait)
}
