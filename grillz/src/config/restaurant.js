/**
 * Grillz — restaurant details in one place.
 * Taken from the Grillz menu board, logo and Instagram (@grillz.burger.lb).
 * `null` means "not provided yet": the site hides or softens that feature
 * instead of showing invented information.
 */

const restaurant = {
  name: 'Grillz',
  tagline: 'Burger. Done right.',

  // "CALL: 961 79 022 617" on the logo; "Delivery: 79 022 617" on Instagram.
  phone: { display: '79 022 617', international: '+96179022617' },
  // Digits only with country code — used to build wa.me links.
  whatsapp: '96179022617',

  address: {
    short: 'Near Beirut Arab University',
    full: 'Near Beirut Arab University, Lebanon',
  },
  // The restaurant's own Google Maps pin.
  mapsUrl: 'https://maps.app.goo.gl/au39wz7aYV7w9aHa6',

  // "Open Daily 12 PM – 1 AM" (Instagram bio).
  hours: [{ days: 'Every day', hours: '12 PM – 1 AM' }],
  // Same hours in minutes after midnight, for the "Open now" badge
  // (close past midnight = more than 1440).
  schedule: { open: 12 * 60, close: 25 * 60 },

  social: {
    instagram: 'https://www.instagram.com/grillz.burger.lb/',
    facebook: null, // the menu shows a Facebook icon — add the page link here
    tiktok: null,
  },

  ordering: {
    pickup: true,
    delivery: true,
    // Delivery fee in L.L. null = confirmed with the customer on WhatsApp.
    deliveryFee: null,
  },

  payments: {
    cash: true,
    /**
     * Whish Money number — not provided yet. While null, Whish shows at
     * checkout as unavailable. Example: { display: '79 022 617', raw: '79022617' }
     */
    whish: null,
  },

  // Optional backends (Formspree, a custom API…). While null, orders and
  // feedback are sent on WhatsApp.
  endpoints: { order: null, feedback: null },
};

export default restaurant;
