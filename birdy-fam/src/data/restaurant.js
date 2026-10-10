/**
 * Restaurant details. Everything customer-facing that might change lives here:
 * phone numbers, branches, hours, payment and delivery settings, social links.
 *
 * Source: the @birdyfam.lb Instagram profile and printed menu.
 * Values set to `null` have not been provided yet; the UI handles them gracefully.
 */

export const restaurant = {
  name: 'Birdy Fam',
  legalName: 'Birdy Fam',
  tagline: 'Crispy chicken, done the Birdy way',
  description:
    'Chip-crusted chicken strips, sliders, wraps and our legendary Chico sauce. Halal, and open every day from noon to midnight in Achrafieh and Jal el Dib.',
  halal: true,
  currency: 'USD',

  // Lebanese mobile number used for WhatsApp orders. Digits only, no country code.
  phone: '76508617',
  countryCode: '961',

  // Whish Money account customers transfer to. Change this one value if it moves.
  whishNumber: '76508617',

  // Opening hours, 24h clock, local Beirut time. "24:00" means midnight.
  timezone: 'Asia/Beirut',
  hours: [{ days: 'Monday to Sunday', open: '12:00', close: '24:00' }],
  schemaOpeningHours: 'Mo-Su 12:00-24:00',

  branches: [
    {
      id: 'achrafieh',
      name: 'Achrafieh',
      area: 'Achrafieh, Beirut',
      mapsUrl: 'https://maps.app.goo.gl/E3UFE9GiLsyT8iEt9?g_st=ipc',
    },
    {
      id: 'jal-el-dib',
      name: 'Jal el Dib',
      area: 'Jal el Dib, Metn',
      mapsUrl: 'https://maps.app.goo.gl/jEBZ3taYHYFFaXWGA?g_st=ic',
    },
  ],

  ordering: {
    pickup: true,
    delivery: true,
    // Flat delivery fee in USD. Leave null when the fee depends on the area and
    // is confirmed by the branch on WhatsApp.
    deliveryFee: null,
    // Shortest time (minutes) from now that a customer can pick a pickup slot.
    pickupLeadMinutes: 20,
    pickupSlotMinutes: 15,
  },

  // Optional URL that receives feedback form submissions as JSON (POST).
  // While empty, feedback is sent to the restaurant through WhatsApp instead.
  feedbackEndpoint: '',

  social: {
    instagram: { handle: 'birdyfam.lb', url: 'https://www.instagram.com/birdyfam.lb/' },
    // Add facebook / tiktok here once the accounts are confirmed, e.g.
    // facebook: { handle: '...', url: 'https://www.facebook.com/...' },
  },

  // Set once the domain is live (also update the URLs in index.html).
  siteUrl: '',
}

/** +961 76 508 617 */
export function formatPhone(number = restaurant.phone) {
  const d = String(number).replace(/\D/g, '')
  const local = d.length === 8 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}` : d
  return `+${restaurant.countryCode} ${local}`
}

export const internationalPhone = `${restaurant.countryCode}${restaurant.phone}`
