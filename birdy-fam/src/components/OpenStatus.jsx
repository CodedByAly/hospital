import { useEffect, useState } from 'react'
import { isOpenNow, hoursLabel } from '../lib/hours.js'

export default function OpenStatus({ className = '' }) {
  const [open, setOpen] = useState(() => isOpenNow())
  useEffect(() => {
    const t = setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => clearInterval(t)
  }, [])
  return (
    <span className={`status ${open ? 'status--open' : 'status--closed'} ${className}`}>
      <span className="status__dot" aria-hidden="true" />
      {open ? 'Open now' : 'Closed now'}
      <span className="status__hours">· {hoursLabel}</span>
    </span>
  )
}
