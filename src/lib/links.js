import restaurant from '../config/restaurant';

export const telLink = `tel:${restaurant.phone.international}`;
export const mailLink = `mailto:${restaurant.email}`;

/** https://wa.me/<number>?text=… — the format WhatsApp documents for click-to-chat. */
export function whatsappLink(text) {
  const base = `https://wa.me/${restaurant.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Social profiles that actually exist (null entries in the config are skipped). */
export function socialProfiles() {
  const s = restaurant.social;
  return [
    s.instagram && { id: 'instagram', href: s.instagram, handle: '@qambriseafood' },
    s.facebook && { id: 'facebook', href: s.facebook },
    s.tiktok && { id: 'tiktok', href: s.tiktok },
    { id: 'whatsapp', href: whatsappLink(), handle: restaurant.phone.display },
  ].filter(Boolean);
}
