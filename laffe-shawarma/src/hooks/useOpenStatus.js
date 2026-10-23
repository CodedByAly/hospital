import { useEffect, useState } from 'react'
import { isOpenNow } from '../lib/hours'

/** Open/closed state, refreshed every minute. */
export function useOpenStatus() {
  const [open, setOpen] = useState(isOpenNow)
  useEffect(() => {
    const id = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(id)
  }, [])
  return open
}
