import { internationalPhone } from '../data/restaurant.js'

export const whatsappUrl = (text = '') =>
  `https://wa.me/${internationalPhone}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const telUrl = `tel:+${internationalPhone}`
