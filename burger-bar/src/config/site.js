/*
 * Restaurant details used across the whole site. Everything a non-developer
 * might need to change lives here: phone, WhatsApp, Whish, hours, address,
 * social links, delivery rules.
 *
 * Phone numbers are stored in international format without spaces: +961XXXXXXXX
 */

export const site = {
  name: 'Burger Bar',
  legalName: 'Burger Bar',
  shortName: 'BB',
  tagline: 'Taste beyond ordinary',
  url: 'https://burger-bar-alpha.vercel.app',
  email: null,
  currency: 'USD',
  timeZone: 'Asia/Beirut',

  // "Order now" number printed on every Instagram post.
  whatsapp: '+96176799767',

  social: {
    instagram: { handle: 'burgerbar.76', url: 'https://www.instagram.com/burgerbar.76/' },
    // facebook: { handle: '...', url: 'https://www.facebook.com/...' },
    // tiktok: { handle: '...', url: 'https://www.tiktok.com/@...' },
  },
};

/*
 * Opening hours, by weekday (0 = Sunday ... 6 = Saturday), in Lebanon time.
 * null = closed that day. A closing time earlier than the opening time means
 * the restaurant closes after midnight.
 * Source: Instagram bio (1:00 PM – 12:30 AM) and the post announcing Monday
 * as the weekly day off.
 */
export const schedule = {
  0: { open: '13:00', close: '00:30' },
  1: null,
  2: { open: '13:00', close: '00:30' },
  3: { open: '13:00', close: '00:30' },
  4: { open: '13:00', close: '00:30' },
  5: { open: '13:00', close: '00:30' },
  6: { open: '13:00', close: '00:30' },
};

/*
 * Burger Bar has one branch. The site supports more: add entries here and a
 * branch picker appears automatically.
 *
 * - whatsapp: orders are sent here on WhatsApp.
 * - whish: Whish Money number for transfers (same as the WhatsApp line).
 * - mapsUrl: paste the Google Maps share link when available; until then a
 *   Maps search for the address is used.
 */
export const branches = [
  {
    id: 'west-bekaa',
    name: 'Al-Manara',
    area: 'West Bekaa',
    address: 'Main road, Al-Manara, West Bekaa',
    phone: '+96176799767',
    whatsapp: '+96176799767',
    whish: '+96176799767',
    mapsUrl: null,
    pickup: true,
    delivery: true,
    dineIn: true,
  },
];

export const ordering = {
  // Delivery fee in USD. null = confirmed by the restaurant per area.
  deliveryFee: null,
  // Minimum order for delivery in USD. null = no minimum.
  deliveryMinimum: null,
};

export const payments = {
  cash: { enabled: true },
  whish: {
    enabled: true,
    // The Whish number is set on the branch above (`whish`).
    logo: '/images/payments/whish.png',
  },
};

/*
 * Feedback form delivery. Paste a form-service endpoint (Formspree, Getform,
 * your own API...) that accepts a JSON POST. When empty, the form opens
 * WhatsApp with the message ready to send.
 */
export const feedback = {
  endpoint: '',
};

// Items shown in "Quick picks" on the home page (ids from src/data/menu.js).
export const featuredItemIds = [
  'stivo-swiss',
  'mozzarella-burger',
  'beef-bacon-burger',
  'swiss-mushrooms',
];
