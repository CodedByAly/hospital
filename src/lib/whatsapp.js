import { restaurant } from '../config/restaurant';

export const hasWhatsApp = Boolean(restaurant.whatsapp);

export function whatsappUrl(text = '') {
  const base = `https://wa.me/${restaurant.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function openWhatsApp(text) {
  const win = window.open(whatsappUrl(text), '_blank');
  if (win) win.opener = null;
  return Boolean(win);
}
