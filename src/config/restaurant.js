/**
 * Restaurant details — the single place to update contact info, links,
 * payment details and service settings. Everything here comes from the
 * restaurant's own Instagram profile and printed menu.
 *
 * A value of `null` means "not provided yet": the UI hides or softens the
 * related feature instead of showing made-up information.
 */

const restaurant = {
  name: 'Qambri',
  nameAr: 'كامبري',
  tagline: { en: 'Seafood Restaurant', ar: 'مطعم بحري' },

  // Local Lebanese number as printed ("79 074 149") and in international form.
  phone: { display: '79 074 149', international: '+96179074149' },

  // WhatsApp — the Instagram "Message on WhatsApp" contact uses the order line.
  // Digits only, with country code, no "+" (used to build wa.me links).
  whatsapp: '96179074149',

  email: 'qambri.lb@gmail.com',

  address: {
    en: 'Dimass St, Barja, Lebanon',
    ar: 'شارع دماس، برجا، لبنان',
    street: 'Dimass St',
    locality: 'Barja',
    country: 'LB',
  },

  // Opens Google Maps searching for the restaurant. Replace with the exact
  // place link ("Share" → "Copy link" in Google Maps) when available.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Qambri+Seafood+Dimass+St+Barja+Lebanon',

  /**
   * Opening hours. Not provided yet — when null the site asks customers to
   * call or WhatsApp. Fill in like:
   *   [{ days: { en: 'Every day', ar: 'كل يوم' }, hours: '12:00 – 23:00' }]
   */
  hours: null,

  social: {
    instagram: 'https://www.instagram.com/qambriseafood/',
    linktree: 'https://linktr.ee/qambriseafood',
    facebook: null, // e.g. 'https://www.facebook.com/…'
    tiktok: null, // e.g. 'https://www.tiktok.com/@…'
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
     * Whish Money number that receives payments. Not provided yet.
     * When null, the Whish option is shown as unavailable at checkout.
     * Example: { display: '79 000 000', raw: '79000000' }
     */
    whish: null,
  },

  /**
   * Optional endpoints for when a backend or form service is connected
   * (Formspree, Getform, a custom API…). Each receives a JSON POST.
   * While null, orders and feedback are sent to the restaurant on WhatsApp.
   */
  endpoints: {
    order: null,
    feedback: null,
  },

  currency: { en: 'L.L', ar: 'ل.ل' },
};

export default restaurant;
