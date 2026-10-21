import { restaurant } from '../config/restaurant.js'

export function formatPrice(value) {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`
}

export function whatsappLink(message) {
  const base = `https://wa.me/${restaurant.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const phoneLink = `tel:${restaurant.phone.e164}`
export const emailLink = `mailto:${restaurant.email}`
