import { useEffect, useState } from 'react'

/**
 * Keeps an element mounted long enough to play its exit animation.
 * Returns [mounted, visible]: render while `mounted`, toggle the
 * "open" class with `visible`.
 */
export function usePresence(open, duration = 280) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(frame)
    }
    setVisible(false)
    const timer = setTimeout(() => setMounted(false), duration)
    return () => clearTimeout(timer)
  }, [open, duration])

  return [mounted, visible]
}
