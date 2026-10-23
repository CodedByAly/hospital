import { useEffect, useState } from 'react'

/**
 * Keeps an element mounted while its exit animation plays.
 * Returns [mounted, visible]: render while `mounted`, toggle the "open" class with `visible`.
 */
export function usePresence(isOpen, duration = 280) {
  const [mounted, setMounted] = useState(isOpen)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
    const timer = setTimeout(() => setMounted(false), duration)
    return () => clearTimeout(timer)
  }, [isOpen, duration])

  return [mounted, visible]
}
