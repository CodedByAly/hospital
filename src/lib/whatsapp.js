import { restaurant } from '../config/restaurant';

export function whatsappLink(message = '') {
  const base = `https://wa.me/${restaurant.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
