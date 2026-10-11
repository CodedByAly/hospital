import restaurant from '../config/restaurant';

export const telLink = `tel:${restaurant.phone.international}`;

export function whatsappLink(text) {
  const base = `https://wa.me/${restaurant.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Only profiles that exist in the config are returned. */
export function socialProfiles() {
  const s = restaurant.social;
  return [
    s.instagram && { id: 'instagram', label: 'Instagram', href: s.instagram, handle: '@grillz.burger.lb' },
    s.facebook && { id: 'facebook', label: 'Facebook', href: s.facebook },
    s.tiktok && { id: 'tiktok', label: 'TikTok', href: s.tiktok },
    { id: 'whatsapp', label: 'WhatsApp', href: whatsappLink(), handle: restaurant.phone.display },
  ].filter(Boolean);
}
