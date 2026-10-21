import { useEffect, useState } from 'react'
import { restaurant } from '../config/restaurant.js'
import { isOpenNow } from '../lib/hours.js'

export function OpenStatus({ className = '' }) {
  const [open, setOpen] = useState(() => isOpenNow())
  useEffect(() => {
    const id = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span className={`status ${open ? 'status--open' : 'status--closed'} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {open ? 'Open now' : 'Closed now'} · {restaurant.hours.short}
    </span>
  )
}
