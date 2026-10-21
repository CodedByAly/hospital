import { useEffect, useState } from 'react'

// Keeps a component mounted for `duration` ms after `open` turns false so it can animate out.
export function usePresence(open, duration = 260) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(id)
    }
    setVisible(false)
    const t = setTimeout(() => setMounted(false), duration)
    return () => clearTimeout(t)
  }, [open, duration])

  return { mounted, visible }
}
