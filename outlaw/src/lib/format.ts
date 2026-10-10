import { restaurant } from '../config/restaurant'

/** 5.5 → "$5.50" */
export const formatPrice = (amount: number) => `${restaurant.currency}${(Math.round(amount * 100) / 100).toFixed(2)}`

export const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(date)

export const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)

/** Lebanese numbers: accepts 70123456, 03 123 456, +961 70 123 456, 00961… */
export function isValidPhone(raw: string) {
  let d = raw.replace(/[^\d+]/g, '')
  if (d.startsWith('+')) d = d.slice(1)
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('961')) d = d.slice(3)
  if (d.startsWith('0')) d = d.slice(1)
  if (/^\d{7,8}$/.test(d)) return true
  return /^\+?\d{9,15}$/.test(raw.replace(/[\s-]/g, ''))
}
