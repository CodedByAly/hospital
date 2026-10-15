/**
 * Life Kitchen: restaurant details.
 *
 * Everything the owner may need to change (phone, Whish number, hours,
 * social links, delivery fee) lives here. Leave a value empty ('' or null)
 * when it is not known yet: the site hides or softens anything that is
 * not configured instead of showing made-up details.
 */

export const restaurant = {
  name: 'Life Kitchen',
  nameAr: 'لايف كيتشن',
  tagline: {
    en: 'a bite for you, a bite for them',
    ar: 'لقمة إلك، ولقمة لغيرك',
  },

  phone: {
    // Shown to customers
    display: '03 525 615',
    // Used for tel: links
    tel: '+9613525615',
  },

  // International format, digits only (no +, no spaces). Used for wa.me links.
  whatsapp: '9613525615',

  location: {
    area: { en: 'Dekwaneh', ar: 'الدكوانة' },
    // Full street address. Leave empty until confirmed by the restaurant.
    street: { en: '', ar: '' },
    mapsUrl: 'https://maps.app.goo.gl/xm2VWDoXRKsLMeKZA',
  },

  // Days: 0 = Sunday ... 6 = Saturday. Times are 24h, Beirut time.
  timeZone: 'Asia/Beirut',
  hours: [
    { days: [1, 2, 3, 4, 5, 6], open: '12:00', close: '22:00' },
    { days: [0], open: '12:00', close: '16:00' },
  ],

  social: {
    instagram: { handle: '@lifekitchen.lb', url: 'https://www.instagram.com/lifekitchen.lb/' },
    // The page name is "Life Kitchen". Paste the page URL here to show the Facebook link.
    facebook: { handle: 'Life Kitchen', url: '' },
    tiktok: { handle: '', url: '' },
  },

  ordering: {
    pickup: true,
    delivery: true,
    // Delivery fee in USD. null = confirmed with the customer on WhatsApp.
    deliveryFee: null,
    // Minimum time (minutes) between "now" and the first pickup slot offered.
    pickupLeadMinutes: 30,
    pickupSlotMinutes: 15,
  },

  payments: {
    whish: {
      // Restaurant's Whish Money number, as it should be shown and copied.
      // Leave empty until confirmed; customers are then told the number
      // will be shared on WhatsApp.
      number: '',
      accountName: 'Life Kitchen',
    },
  },

  // Where orders and feedback go. Without an endpoint, both are sent to the
  // restaurant on WhatsApp. Set an endpoint (e.g. a Formspree form or your own
  // API) to receive them as JSON POST requests instead.
  endpoints: {
    orders: '',
    feedback: '',
  },
};
