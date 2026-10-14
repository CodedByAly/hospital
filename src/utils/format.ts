import type { Lang } from '../data/types'
import { restaurant } from '../config/restaurant'

/** Latin digits in both languages — standard on Lebanese menus. */
const locale = (lang: Lang) => (lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-US')

/** Prices are always shown as $12.50, the way the restaurant lists them. */
export const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v)

export const lbp = (usd: number) => {
  const rate = restaurant.payments.lbpRate
  if (!rate) return null
  // Lebanese pound amounts are conventionally rounded to the nearest 1,000.
  const v = Math.round((usd * rate) / 1000) * 1000
  return new Intl.NumberFormat('en-US').format(v)
}

export const num = (v: number, lang: Lang = 'en') => new Intl.NumberFormat(locale(lang)).format(v)

/** "15:00" -> "3:00 PM" / "٣:٠٠ م" */
export const clock = (hhmm: string, lang: Lang = 'en') => {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(2000, 0, 1, h % 24, m)
  return new Intl.DateTimeFormat(locale(lang), { hour: 'numeric', minute: '2-digit' }).format(d)
}

/** Minutes since midnight in the restaurant's timezone. */
export const beirutMinutes = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: restaurant.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  return h * 60 + m
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const isOpenNow = (date = new Date()) => {
  const now = beirutMinutes(date)
  const open = toMin(restaurant.hours.open)
  const close = toMin(restaurant.hours.close)
  return close > open ? now >= open && now < close : now >= open || now < close
}

/** Pickup slots every 15 minutes from now (+20 min) until closing. */
export const pickupSlots = (date = new Date()) => {
  const open = toMin(restaurant.hours.open)
  let close = toMin(restaurant.hours.close)
  if (close <= open) close += 24 * 60
  let now = beirutMinutes(date)
  if (now < open && now + 24 * 60 < close) now += 24 * 60
  const start = Math.max(open + 15, now + 20)
  const first = Math.ceil(start / 15) * 15
  const slots: string[] = []
  for (let t = first; t <= close - 15; t += 15) {
    const h = Math.floor(t / 60) % 24
    const m = t % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return slots
}

/** Accepts 8-digit Lebanese numbers (e.g. 70123456, 03123456) with optional +961 / 00961 / 961. */
export const normalizeLbPhone = (raw: string) => {
  let d = raw.replace(/[^\d+]/g, '')
  d = d.replace(/^\+/, '').replace(/^00/, '')
  if (d.startsWith('961')) d = d.slice(3)
  if (d.length === 7 && /^[13-9]/.test(d)) d = '0' + d // 3xxxxxx -> 03xxxxxx
  return /^\d{8}$/.test(d) ? d : null
}
