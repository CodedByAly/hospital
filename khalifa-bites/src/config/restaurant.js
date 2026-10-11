/**
 * Khalifa Bites — restaurant details in one place.
 *
 * Everything here comes from the restaurant's printed menu and Instagram
 * (@khalifa.bites). A value of `null` means "not provided yet": the site
 * hides or softens that feature instead of showing invented information.
 */

const restaurant = {
  name: 'Khalifa Bites',
  shortName: 'Khalifa',
  tagline: 'The Original Lebanese Flavor',

  // Order line printed on the menu and on every Instagram post.
  phone: { display: '76 086 068', international: '+96176086068' },

  // WhatsApp (the posts show the WhatsApp logo next to the order line).
  // Digits only with country code — used to build wa.me links.
  whatsapp: '96176086068',

  email: null,

  address: {
    line: 'Saida Highway',
    city: 'Saida',
    country: 'Lebanon',
    full: 'Saida Highway, Saida, Lebanon',
  },

  // Google Maps search for the restaurant. Replace with the exact place link
  // (Google Maps → Share → Copy link) when available.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Khalifa+Bites+Saida',

  /**
   * Opening hours — not provided yet. When null, customers are asked to call
   * or WhatsApp. Example:
   *   [{ days: 'Every day', hours: '12:00 – 00:00' }]
   */
  hours: null,

  social: {
    instagram: 'https://www.instagram.com/khalifa.bites/',
    facebook: null, // e.g. 'https://www.facebook.com/…'
    tiktok: null, // e.g. 'https://www.tiktok.com/@…'
  },

  ordering: {
    pickup: true,
    delivery: true,
    // Delivery fee in USD. null = confirmed with the customer on WhatsApp.
    deliveryFee: null,
  },

  payments: {
    cash: true,
    /**
     * Whish Money number that receives payments — not provided yet.
     * While null, Whish shows at checkout as unavailable.
     * Example: { display: '76 000 000', raw: '76000000' }
     */
    whish: null,
  },

  /**
   * Optional backend endpoints (Formspree, a custom API…). Each receives a
   * JSON POST. While null, orders and feedback go to WhatsApp.
   */
  endpoints: {
    order: null,
    feedback: null,
  },

  currency: 'USD',
};

export default restaurant;
