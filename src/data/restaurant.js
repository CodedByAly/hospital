/**
 * Restaurant details used across the whole site.
 * Edit the values here; no component needs to change.
 *
 * Anything set to `null` (or an empty list) has not been provided yet.
 * The UI hides it or falls back to "ask us on WhatsApp" until it is filled in.
 */

// One number is used for calls, WhatsApp and Whish Money.
const PHONE_LOCAL = '70 796 761';
const PHONE_INTERNATIONAL = '+961 70 796 761';

export const restaurant = {
  name: 'Chicago Burgers',
  shortName: 'Chicago Burgers LB',
  tagline: 'Stacked High, Smashed Right',
  city: 'Beirut',
  country: 'Lebanon',
  currency: 'USD',

  phone: {
    display: PHONE_LOCAL,
    international: PHONE_INTERNATIONAL,
    // Digits only, with country code. Used to build tel: and wa.me links.
    e164: PHONE_INTERNATIONAL.replace(/[^\d]/g, ''),
  },

  whatsapp: {
    display: PHONE_INTERNATIONAL,
    e164: PHONE_INTERNATIONAL.replace(/[^\d]/g, ''),
  },

  whish: {
    // The Whish Money account customers transfer to.
    number: PHONE_LOCAL,
    international: PHONE_INTERNATIONAL,
    accountName: 'Chicago Burgers',
  },

  address: {
    lines: ['Gallery Semaan, Kamil Shamoun Blvd', 'Keserwani Center'],
    street: 'Gallery Semaan, Kamil Shamoun Blvd, Keserwani Center',
    city: 'Beirut',
    country: 'LB',
    // Search link built from the address. Replace with the exact Google Maps
    // place link once available.
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent('Chicago Burgers, Kamil Shamoun Boulevard, Gallery Semaan, Beirut'),
    mapsEmbedUrl:
      'https://www.google.com/maps?output=embed&q=' +
      encodeURIComponent('Kamil Shamoun Boulevard, Gallery Semaan, Beirut, Lebanon'),
  },

  social: {
    instagram: {
      label: 'Instagram',
      handle: '@chicagoburgerslb',
      url: 'https://www.instagram.com/chicagoburgerslb/',
    },
    // Add facebook / tiktok here in the same shape when the accounts exist:
    // facebook: { label: 'Facebook', handle: '...', url: 'https://...' },
  },

  partner: {
    name: 'Chicago Pizza',
    handle: '@chicagopizzalb',
    url: 'https://www.instagram.com/chicagopizzalb/',
  },

  /**
   * Opening hours. Not provided yet.
   * Example: [{ days: 'Mon – Sun', hours: '12:00 PM – 12:00 AM' }]
   */
  openingHours: [],

  ordering: {
    pickup: true,
    delivery: true,
    // Delivery fee in USD. `null` = not fixed, confirmed on WhatsApp with the order.
    deliveryFee: null,
    // Optional list of delivery areas. When empty, the checkout shows a free-text field.
    deliveryAreas: [],
    // Optional backend that receives orders as JSON (POST). When `null`,
    // orders are sent to the restaurant through WhatsApp.
    orderEndpoint: null,
    // Optional backend for the feedback form (POST JSON). When `null`,
    // feedback is sent through WhatsApp.
    feedbackEndpoint: null,
  },

  // Public site URL, used for SEO tags. Update after deployment.
  siteUrl: 'https://chicagoburgers.lb',
};

export const telLink = `tel:${restaurant.phone.international.replace(/\s/g, '')}`;

export function whatsappLink(message = '') {
  const base = `https://wa.me/${restaurant.whatsapp.e164}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const socialLinks = Object.entries(restaurant.social).map(([id, s]) => ({ id, ...s }));
