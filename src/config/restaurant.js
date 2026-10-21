// Everything about the restaurant that is not the menu lives here.
// Change a value once and it updates across the whole site.

const PHONE_LOCAL = '70346913'
const COUNTRY_CODE = '961'

export const restaurant = {
  name: 'Jungs',
  tagline: 'Feast with the guys',
  bio: 'Where the gang gets together',

  // Primary phone. WhatsApp and Whish use the same number.
  phone: {
    local: PHONE_LOCAL,
    display: '70 346 913',
    international: `+${COUNTRY_CODE} ${PHONE_LOCAL.slice(0, 2)} ${PHONE_LOCAL.slice(2, 5)} ${PHONE_LOCAL.slice(5)}`,
    e164: `+${COUNTRY_CODE}${PHONE_LOCAL}`,
  },
  whatsapp: `${COUNTRY_CODE}${PHONE_LOCAL}`, // digits only, used to build wa.me links
  whish: {
    number: '70 346 913',
    copyValue: PHONE_LOCAL,
    accountName: 'Jungs',
  },
  email: 'jungs.lb1@gmail.com',

  address: {
    locality: 'Chekka',
    country: 'Lebanon',
    countryCode: 'LB',
    display: 'Chekka, Lebanon',
  },
  mapsUrl: 'https://maps.app.goo.gl/RLyZMXXykiACEr1s9',

  // 24:00 means midnight. Days were not specified, so the same hours are used every day.
  hours: {
    open: '13:00',
    close: '24:00',
    label: '1:00 pm – 12:00 am',
    short: '1pm – 12am',
  },

  services: {
    dineIn: true,
    pickup: true,
    delivery: true,
  },

  // Set a number (in USD) when a fixed delivery fee is decided.
  // While it is null, the cart and checkout say the fee is confirmed with the order.
  deliveryFee: null,
  currency: 'USD',

  // Average times shown on the confirmation page. Adjust to what the kitchen can promise.
  estimates: {
    pickupMinutes: '20–30',
    deliveryMinutes: '35–50',
  },

  social: [
    { id: 'instagram', label: 'Instagram', handle: '@jungs__lb', url: 'https://www.instagram.com/jungs__lb/' },
    { id: 'whatsapp', label: 'WhatsApp', handle: '70 346 913', url: `https://wa.me/${COUNTRY_CODE}${PHONE_LOCAL}` },
  ],

  // Optional backends. Leave null to send orders and feedback through WhatsApp.
  // When set, the site POSTs JSON to these URLs instead (see src/lib/submit.js).
  endpoints: {
    orders: null,
    feedback: null,
  },
}
