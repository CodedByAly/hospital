// Every business detail the site shows lives here.
// Change a value once and it updates the header, footer, contact
// section, checkout, WhatsApp messages and the SEO data.
//
// Anything set to `null` has NOT been supplied yet. The UI hides or
// adapts those parts on purpose instead of showing made-up details.

export const restaurant = {
  name: 'Chippy',
  legalName: 'Chippy Restaurant',
  tagline: 'A Taste To Remember',

  // Local Lebanese number as written on the posters, plus the country code.
  // Delivery orders and WhatsApp use the same number.
  phone: {
    display: '78 703 770',
    local: '78703770',
    international: '+96178703770',
  },
  whatsapp: '96178703770', // digits only, used for wa.me links

  email: 'chippy.restaurant@outlook.com',

  address: {
    line: 'Hleliyeh, facing Queen Station',
    city: 'Saida',
    country: 'Lebanon',
    countryCode: 'LB',
  },

  // A Google Maps search for the address. Swap in the restaurant's own
  // "Share" link from Google Maps once the pin is set up.
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Chippy+Restaurant+Hleliyeh+Queen+Station+Saida',

  // Only include accounts that actually exist.
  social: {
    instagram: {
      handle: 'chippyrestaurant',
      url: 'https://www.instagram.com/chippyrestaurant/',
    },
    // facebook: { handle: '', url: '' },
    // tiktok: { handle: '', url: '' },
  },

  // Opening hours were not provided. Fill in to show them across the site,
  // e.g. [{ days: 'Monday to Sunday', hours: '12:00 PM to 12:00 AM' }]
  hours: null,

  // Whish Money account for transfers. Not provided yet. While it is null
  // the checkout still offers Whish, and tells the customer the number
  // is sent with the order confirmation on WhatsApp.
  whish: {
    number: null, // e.g. '78 703 770'
    accountName: 'Chippy Restaurant',
  },

  ordering: {
    currency: 'USD',
    currencySymbol: '$',
    // Delivery fee in dollars. null = confirmed with the customer when we
    // call back, so it is shown as "Confirmed on call" and left out of the total.
    deliveryFee: null,
    delivery: true,
    pickup: true,
  },

  // Optional form endpoint (Formspree, Getform, your own API...).
  // When null, feedback opens the customer's email app addressed to `email`.
  feedbackEndpoint: null,

  siteUrl: 'https://chippy-restaurant.netlify.app',
}

export const telLink = `tel:${restaurant.phone.international}`

export function whatsappLink(message = '') {
  const base = `https://wa.me/${restaurant.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const fullAddress = `${restaurant.address.line}, ${restaurant.address.city}`
