/**
 * Restaurant details used across the whole site.
 * Everything a non-developer may need to update lives in this file
 * (menu items and prices live in src/data/menu.js).
 *
 * Leave a value empty ('' / null / []) when it is not known yet —
 * the related UI hides itself or shows a neutral fallback.
 */

export const restaurant = {
  name: "O'snack",
  tagline: 'Taste That Talks!',

  phone: {
    display: '+961 81 720 200',
    tel: '+96181720200',
  },

  // International format, digits only (used to build wa.me links).
  // Set to '' to hide every WhatsApp button.
  whatsapp: '96181720200',

  address: {
    en: 'Tarik El Jdideh, Beirut, Lebanon',
    ar: 'طريق الجديدة، بيروت، لبنان',
  },
  locality: 'Beirut',
  country: 'LB',

  mapsUrl: 'https://maps.app.goo.gl/u6ht8rkVvCSS4hgu6',

  services: {
    dineIn: true,
    pickup: true,
    delivery: true,
  },

  deliveryArea: {
    en: 'All over Beirut',
    ar: 'لكل بيروت',
  },

  /**
   * Delivery fee in L.L. Use null when the fee depends on the area and
   * is confirmed with the customer — the cart then shows "to be confirmed"
   * instead of a number.
   */
  deliveryFee: null,

  /**
   * Opening hours. Example entry:
   *   { days: { en: 'Every day', ar: 'كل يوم' }, open: '11:00', close: '23:00' }
   * Leave empty to hide the hours blocks until they are confirmed.
   */
  openingHours: [],

  /**
   * Whish Money account the customer transfers to.
   * Leave '' until the restaurant confirms its number — the Whish option
   * stays visible at checkout but cannot be selected.
   */
  whish: {
    number: '',
    accountName: "O'snack",
  },

  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@osnack.lb',
      url: 'https://www.instagram.com/osnack.lb/',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      handle: '@osnack.lb',
      url: 'https://www.tiktok.com/@osnack.lb',
    },
  ],

  /**
   * Optional endpoint that receives feedback as JSON (Formspree, Netlify
   * function, your own API…). When empty, feedback is sent over WhatsApp.
   */
  feedbackEndpoint: '',

  currency: { en: 'L.L.', ar: 'ل.ل.' },

  // Final public URL, without trailing slash (used for canonical/OG tags).
  siteUrl: '',
};
