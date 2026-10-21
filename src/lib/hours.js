import { restaurant } from '../config/restaurant.js'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const OPEN = toMinutes(restaurant.hours.open)
const CLOSE = toMinutes(restaurant.hours.close)

const nowMinutes = (date = new Date()) => date.getHours() * 60 + date.getMinutes()

export function isOpenNow(date = new Date()) {
  const m = nowMinutes(date)
  return CLOSE > OPEN ? m >= OPEN && m < CLOSE : m >= OPEN || m < CLOSE
}

export function formatClock(minutes) {
  const h24 = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  const suffix = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

// Pickup slots for today, every 15 minutes, starting at least 20 minutes from now.
export function pickupSlots(date = new Date()) {
  const earliest = Math.max(nowMinutes(date) + 20, OPEN + 15)
  const start = Math.ceil(earliest / 15) * 15
  const slots = []
  for (let m = start; m <= CLOSE - 15; m += 15) slots.push(formatClock(m))
  return slots
}
