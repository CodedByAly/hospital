/**
 * Restaurant details used across the whole site.
 *
 * Everything here was taken from the Streets Instagram profile and the
 * Thrubits digital menu. Fields set to `null` / '' were not provided yet —
 * the UI hides or adapts those parts automatically, so filling a value in
 * here is all that is needed to switch the feature on.
 */

const WHATSAPP_NUMBER = '96170365358' // international format, digits only

export const restaurant = {
  name: 'Streets',
  fullName: 'Streets Coffee Shop',
  /** Public URL of the deployed site, used for canonical/OG tags. No trailing slash. */
  siteUrl: '',

  tagline: { en: 'Where Everyone Meets', ar: 'حيث يلتقي الجميع' },
  bio: {
    en: 'The cosiest neighbourhood coffee shop in the city',
    ar: 'أدفى كوفي شوب بالحيّ',
  },

  address: {
    en: 'Bhannine, Minieh highway, in front of Naboulsi resto-cafe',
    ar: 'بحنين، أوتوستراد المنية، مقابل النابلسي ريستو-كافيه',
  },
  locality: 'Bhannine',
  region: 'North Lebanon',
  country: 'LB',
  /**
   * Replace with the shop's exact Google Maps pin link when available.
   * Until then this opens a Maps search for the address above.
   */
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Streets coffee shop, Minieh highway, Bhannine, Lebanon'),

  phone: '+96170365358',
  phoneDisplay: '+961 70 365 358',
  whatsapp: WHATSAPP_NUMBER,

  /** Only accounts that actually exist. Add Facebook / TikTok here once their links are confirmed. */
  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@streets.coffee.shop',
      url: 'https://www.instagram.com/streets.coffee.shop/',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      handle: '+961 70 365 358',
      url: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
  ],

  /**
   * Opening hours were not provided yet. Fill in to show them across the site, e.g.
   * [
   *   { days: { en: 'Monday – Friday', ar: 'الإثنين – الجمعة' }, open: '08:00', close: '23:00' },
   *   { days: { en: 'Saturday – Sunday', ar: 'السبت – الأحد' }, open: '09:00', close: '00:00' },
   * ]
   */
  hours: null,

  currency: { code: 'LBP', symbol: { en: 'L.L.', ar: 'ل.ل.' } },

  ordering: {
    dineIn: true,
    pickup: true,
    delivery: true,
    /** Delivery fee in L.L. Leave `null` while it is confirmed per order on WhatsApp. */
    deliveryFee: null,
    /** Minutes added to "now" for the earliest pickup slot. */
    pickupLeadMinutes: 15,
  },

  payments: {
    cash: true,
    whish: {
      enabled: true,
      /** The shop's Whish Money number. Leave '' until it is confirmed — the site will not show a number until then. */
      number: '',
      /** Optional name on the Whish account, shown so customers can double-check before sending. */
      accountName: '',
    },
  },

  feedback: {
    /**
     * POST endpoint for the feedback form (Formspree, a serverless function, etc.).
     * It receives JSON: { name, contact, rating, message, language }.
     * While empty, the form hands the message over to WhatsApp instead.
     */
    endpoint: '',
  },
}

export const whatsappLink = (text = '') =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
