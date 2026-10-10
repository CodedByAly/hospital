import { restaurant } from '../data/restaurant.js'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Current hour/minute in the restaurant's time zone, independent of the visitor's clock zone. */
export function restaurantNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: restaurant.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t) => Number(parts.find((p) => p.type === t).value)
  return get('hour') * 60 + get('minute')
}

// Every day shares the same hours, so the first entry is today's.
const today = restaurant.hours[0]
export const openMinutes = toMinutes(today.open)
export const closeMinutes = toMinutes(today.close)

export function isOpenNow(date) {
  const now = restaurantNow(date)
  return now >= openMinutes && now < closeMinutes
}

export function formatClock(minutes) {
  const m = minutes % (24 * 60)
  const h = Math.floor(m / 60)
  const mm = String(m % 60).padStart(2, '0')
  if (h === 0) return mm === '00' ? '12:00 AM' : `12:${mm} AM`
  if (h === 12) return `12:${mm} PM`
  return h > 12 ? `${h - 12}:${mm} PM` : `${h}:${mm} AM`
}

export const hoursLabel = `${formatClock(openMinutes)} – ${formatClock(closeMinutes)}`

/**
 * Pickup slots for the rest of today. If the kitchen is closed or too close to
 * closing, returns tomorrow's first slots instead.
 */
export function pickupSlots(date = new Date()) {
  const { pickupLeadMinutes: lead, pickupSlotMinutes: step } = restaurant.ordering
  const now = restaurantNow(date)
  const earliest = Math.max(openMinutes, Math.ceil((now + lead) / step) * step)
  const slots = []
  for (let t = earliest; t <= closeMinutes - step; t += step) slots.push({ value: `today-${t}`, label: `Today, ${formatClock(t)}` })
  if (slots.length) return { slots, sameDay: true }
  for (let t = openMinutes + step; t <= openMinutes + 4 * 60; t += step)
    slots.push({ value: `tomorrow-${t}`, label: `Tomorrow, ${formatClock(t)}` })
  return { slots, sameDay: false }
}
