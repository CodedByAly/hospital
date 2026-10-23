import { restaurant } from '../config/restaurant'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Current day (0 = Sunday) and minutes since midnight in the restaurant's time zone. */
function nowInRestaurantTz(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: restaurant.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type)?.value
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

/** Opening windows expressed in minutes from the start of the week. */
function weeklyWindows() {
  const week = 7 * 24 * 60
  return restaurant.hours.flatMap(({ day, open, close }) => {
    const start = day * 1440 + toMinutes(open)
    let end = day * 1440 + toMinutes(close)
    if (end <= start) end += 1440
    // Repeat each window one week later so Saturday-night windows that run
    // into Sunday morning still match.
    return [
      { start, end, day, close },
      { start: start + week, end: end + week, day, close },
    ]
  })
}

/**
 * { open: true, closesAt: '01:30' } or { open: false, opensAt: '16:00', opensDay: 0 }
 */
export function openStatus(date = new Date()) {
  const { day, minutes } = nowInRestaurantTz(date)
  const now = day * 1440 + minutes
  const windows = weeklyWindows().sort((a, b) => a.start - b.start)
  const current = windows.find((w) => now >= w.start && now < w.end)
  if (current) return { open: true, closesAt: current.close }
  const next = windows.find((w) => w.start > now) ?? windows[0]
  const entry = restaurant.hours.find((h) => h.day === next.day)
  return { open: false, opensAt: entry.open, opensDay: next.day, opensToday: next.day === day }
}

/** "1:30 PM" / "1:30 م" style time, from "13:30". */
export function formatTime(hhmm, lang) {
  const [h, m] = hhmm.split(':').map(Number)
  const date = new Date(Date.UTC(2024, 0, 1, h, m))
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-US', {
    hour: 'numeric',
    minute: m ? '2-digit' : undefined,
    timeZone: 'UTC',
  }).format(date)
}

/** Groups consecutive days with identical hours: Mon–Sat 1:30 PM – 1:30 AM. */
export function groupedHours() {
  const ordered = [1, 2, 3, 4, 5, 6, 0].map((d) => restaurant.hours.find((h) => h.day === d)).filter(Boolean)
  const groups = []
  for (const entry of ordered) {
    const last = groups[groups.length - 1]
    if (last && last.open === entry.open && last.close === entry.close) last.days.push(entry.day)
    else groups.push({ days: [entry.day], open: entry.open, close: entry.close })
  }
  return groups
}
