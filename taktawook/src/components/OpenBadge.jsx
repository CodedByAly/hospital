import { useEffect, useState } from 'react'
import { HOURS } from '../data/menu.js'

// Minutes since midnight in Beirut, regardless of the visitor's own timezone
function beirutMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Beirut', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return get('hour') * 60 + get('minute')
}

export function useOpenNow() {
  const [mins, setMins] = useState(beirutMinutes)
  useEffect(() => {
    const id = setInterval(() => setMins(beirutMinutes()), 60_000)
    return () => clearInterval(id)
  }, [])
  return mins >= HOURS.open && mins < HOURS.close
}

export default function OpenBadge({ className = '' }) {
  const open = useOpenNow()
  return (
    <span className={`open-badge ${open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="open-badge__dot" aria-hidden="true" />
      {open ? 'Open now' : 'Opens 11:30 AM'}
    </span>
  )
}
