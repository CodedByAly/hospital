import { restaurant } from '../config/restaurant'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const OPEN = toMinutes(restaurant.hours.open)
const CLOSE = toMinutes(restaurant.hours.close)
const CROSSES_MIDNIGHT = CLOSE <= OPEN

/** Current minutes since midnight in the restaurant's timezone. */
export function restaurantNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: restaurant.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  return get('hour') * 60 + get('minute')
}

export function isOpenAt(minutes) {
  return CROSSES_MIDNIGHT ? minutes >= OPEN || minutes < CLOSE : minutes >= OPEN && minutes < CLOSE
}

export function isOpenNow() {
  return isOpenAt(restaurantNow())
}

/** "4:15 PM" / "4:15 م" */
export function formatClock(minutes, lang = 'en') {
  const m = ((minutes % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const h12 = h24 % 12 || 12
  const suffix = lang === 'ar' ? (h24 < 12 ? 'ص' : 'م') : h24 < 12 ? 'AM' : 'PM'
  return `${h12}:${String(m % 60).padStart(2, '0')} ${suffix}`
}

const SESSION_END = CROSSES_MIDNIGHT ? CLOSE + 1440 : CLOSE
const STEP = 15
const LEAD = 30

function slotsBetween(from, to, lang) {
  const slots = []
  for (let t = Math.ceil(from / STEP) * STEP; t <= to - STEP; t += STEP) {
    const m = t % 1440
    const value = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
    slots.push({ value, label: formatClock(m, lang) })
  }
  return slots
}

/**
 * Pickup slots every 15 minutes, starting 30 minutes from now, until closing.
 * When the restaurant is closed (or about to close) the slots of the next
 * opening are returned instead, flagged with `nextSession: true`.
 */
export function pickupSlots(lang = 'en', now = restaurantNow()) {
  if (isOpenAt(now)) {
    // Position "now" on the session timeline (after-midnight minutes get +1440).
    const t = CROSSES_MIDNIGHT && now < CLOSE ? now + 1440 : now
    const slots = slotsBetween(t + LEAD, SESSION_END, lang)
    if (slots.length) return { slots, nextSession: false }
  }
  return { slots: slotsBetween(OPEN + LEAD, SESSION_END, lang), nextSession: true }
}

export const openingLabel = (lang) => formatClock(OPEN, lang)
