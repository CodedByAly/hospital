import { useEffect, useState } from 'react'
import { site } from '../data/site'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

// "07:00" -> "7am", "13:30" -> "1:30pm", "24:00" -> "midnight"
export const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  if (h % 24 === 0 && m === 0) return h === 0 || h === 24 ? 'midnight' : '12am'
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''}${suffix}`
}

const nowInCafeTime = () => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: site.hours.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  return get('hour') * 60 + get('minute')
}

// Returns null until mounted (the server has no idea what time it is for the visitor),
// then { open, label } refreshed every minute.
export function useOpenStatus() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const opens = toMinutes(site.hours.opens)
    const closes = toMinutes(site.hours.closes)
    const update = () => {
      const now = nowInCafeTime()
      const open = now >= opens && now < closes
      const minsLeft = closes - now
      let label
      if (open) label = minsLeft <= 60 ? `Open, closing in ${minsLeft} min` : 'Open now'
      else label = `Closed, opens at ${formatTime(site.hours.opens)}`
      setStatus({ open, label })
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  return status
}
