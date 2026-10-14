import { useEffect, useState } from 'react'
import { restaurant } from '../config/restaurant'
import { copy as t } from '../content/copy'
import { fmt } from '../utils/format'
import { clock, isOpenNow } from '../utils/format'

/** Live open/closed pill based on the configured hours in Beirut time. */
export function OpenStatus({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(() => isOpenNow())

  useEffect(() => {
    const id = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span className={`open-status ${open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className={`dot ${open ? 'dot--live' : ''}`} aria-hidden="true" />
      <span>{open ? t.status.open : t.status.closed}</span>
      <span className="open-status__time">
        · {open ? fmt(t.status.closesAt, { t: clock(restaurant.hours.close) }) : fmt(t.status.opensAt, { t: clock(restaurant.hours.open) })}
      </span>
    </span>
  )
}
