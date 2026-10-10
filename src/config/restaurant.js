/**
 * Restaurant details used across the whole site.
 *
 * Everything here was taken from the Adam's Burger Instagram profile and the
 * Thrubits digital menu. Fields set to `null` / '' were not provided yet —
 * the UI hides or adapts those parts automatically, so filling a value in
 * here is all that is needed to switch the feature on.
 */

const WHATSAPP_NUMBER = '96181501258' // international format, digits only

export const restaurant = {
  name: "Adam's",
  fullName: "Adam's Burger",
  /** Public URL of the deployed site, used for canonical/OG tags. No trailing slash. */
  siteUrl: '',

  tagline: { en: 'Happiness starts here', ar: 'من هون بتبلش السعادة' },
  bio: {
    en: 'Fast food restaurant in Saida, beside LIU',
    ar: 'مطعم وجبات سريعة بصيدا، حدّ الـLIU',
  },

  address: {
    en: 'Saida, beside LIU',
    ar: 'صيدا، حدّ الجامعة اللبنانية الدولية (LIU)',
  },
  locality: 'Saida',
  region: 'South Lebanon',
  country: 'LB',
  /**
   * Replace with the restaurant's exact Google Maps pin link when available.
   * Until then this opens a Maps search for the address above.
   */
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent("Adam's Burger, beside LIU, Saida, Lebanon"),

  phone: '+96181501258',
  phoneDisplay: '+961 81 501 258',
  whatsapp: WHATSAPP_NUMBER,
  email: 'adamburgerlb@gmail.com',

  /** Only accounts that actually exist. Add Facebook / TikTok here once their links are confirmed. */
  socials: [
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '@adamsburgerlb',
      url: 'https://www.instagram.com/adamsburgerlb/',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      handle: '+961 81 501 258',
      url: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
  ],

  /** From the Instagram bio: 1:00 PM – 10:00 PM, Friday closed. */
  hours: [
    { days: { en: 'Saturday – Thursday', ar: 'السبت – الخميس' }, open: '13:00', close: '22:00' },
    { days: { en: 'Friday', ar: 'الجمعة' }, closed: true },
  ],

  currency: { code: 'USD', symbol: '$' },

  ordering: {
    dineIn: true,
    pickup: true,
    delivery: true,
    /** Delivery fee in USD. Leave `null` while it is confirmed per order on WhatsApp. */
    deliveryFee: null,
    /** Minutes added to "now" for the earliest pickup slot. */
    pickupLeadMinutes: 15,
  },

  payments: {
    cash: true,
    whish: {
      enabled: true,
      /** The restaurant's Whish Money number. Leave '' until it is confirmed — the site will not show a number until then. */
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
