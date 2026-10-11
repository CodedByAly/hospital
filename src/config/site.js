/*
 * Restaurant details used across the whole site.
 * Everything a non-developer might need to update lives in this file
 * (contact numbers, branches, social links, payment details, delivery rules).
 *
 * Phone numbers are stored in international format without spaces: +961XXXXXXXX
 */

export const site = {
  name: "Zaher's",
  legalName: "Zaher's Diner",
  tagline: 'Delivering Happiness',
  since: 2014,
  url: 'https://zahersdiner.com',
  email: 'zaherssnack@outlook.com',
  currency: 'USD',

  // The main WhatsApp line listed on Instagram (Hamra).
  whatsapp: '+96171510106',

  social: {
    instagram: { handle: 'zahersdiner', url: 'https://www.instagram.com/zahersdiner/' },
    // Add Facebook / TikTok here once the accounts are confirmed, e.g.
    // facebook: { handle: '...', url: 'https://www.facebook.com/...' },
    // tiktok: { handle: '...', url: 'https://www.tiktok.com/@...' },
  },
};

/*
 * Branches, in the order they appear on Instagram.
 *
 * - whatsapp: set to the branch's WhatsApp number to let customers send orders
 *   to that branch on WhatsApp. When null, the confirmation page asks the
 *   customer to call the branch instead.
 * - address: only what has been confirmed. Hamra's street comes from the
 *   student-offer flyer; Tyre and Batroun still need a street address.
 * - hours: list of { days, open, close } e.g. { days: 'Mon – Sun', open: '11:00', close: '00:00' }.
 *   Leave empty until confirmed; the site then tells customers to call for hours.
 * - mapsUrl: paste the Google Maps share link for the branch when available.
 *   Until then a Maps search for the branch is used.
 */
export const branches = [
  {
    id: 'tyre',
    name: 'Tyre',
    area: 'Tyre',
    address: 'Tyre, South Lebanon',
    phone: '+96181783558',
    whatsapp: null,
    hours: [],
    mapsUrl: null,
    pickup: true,
    delivery: true,
  },
  {
    id: 'hamra',
    name: 'Hamra',
    area: 'Beirut',
    address: 'Bliss Street, Hamra, Beirut',
    phone: '+96171510106',
    whatsapp: '+96171510106',
    hours: [],
    mapsUrl: null,
    pickup: true,
    delivery: true,
  },
  {
    id: 'batroun',
    name: 'Batroun',
    area: 'Batroun',
    address: 'Batroun, North Lebanon',
    phone: '+96178900695',
    whatsapp: null,
    hours: [],
    mapsUrl: null,
    pickup: true,
    delivery: true,
  },
];

export const ordering = {
  /*
   * Delivery fee in USD. null = not fixed / depends on the area; the cart then
   * shows "confirmed by the branch" instead of a number and the total excludes it.
   */
  deliveryFee: null,
  // Minimum order for delivery in USD. null = no minimum.
  deliveryMinimum: null,
};

export const payments = {
  cash: { enabled: true },
  whish: {
    enabled: true,
    /*
     * Restaurant's Whish Money number, e.g. '+96171000000'.
     * While this is empty the Whish option is shown as unavailable at checkout.
     */
    number: '',
    accountName: "Zaher's",
  },
};

/*
 * Feedback form delivery. Paste a form-service endpoint (Formspree, Getform,
 * your own API...) that accepts a JSON POST. When empty, the form opens the
 * customer's email app with the message addressed to site.email.
 */
export const feedback = {
  endpoint: '',
};

// Items shown in the "From the menu" row on the home page (ids from src/data/menu.js).
export const featuredItemIds = [
  'double-burger',
  'crunchy-zinger',
  'truffle-burger',
  'zinger-supreme',
  'philadelphia',
  'bbq-chicken-wings',
  'crispy-5',
  'twister-spicy',
];
