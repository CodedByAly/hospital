// Everything the café might want to change lives here.
// Anything set to null is simply hidden on the site until it is filled in.

export const restaurant = {
  name: 'Sukun',
  fullName: 'Sukun Coffee Shop',
  tagline: 'Your calm coffee spot in Tripoli',
  highlights: ['Specialty Coffee', 'Breakfast', 'Games', 'Chill Vibes'],

  address: {
    street: 'Azmi Street',
    landmark: 'Facing Kher w Barakeh Market, near Dr. Scholl',
    city: 'Tripoli',
    country: 'Lebanon',
  },
  mapsUrl: 'https://goo.gl/maps/FQ3web1a8xjwZdSTA',

  // Both numbers are published by the café (Instagram bio and digital menu).
  phones: [
    { label: 'Café', display: '+961 78 760 800', tel: '+96178760800' },
    { label: 'Café', display: '+961 71 420 127', tel: '+96171420127' },
  ],

  // Number used for the WhatsApp buttons and feedback form (digits only, with country code).
  whatsapp: '96178760800',

  // e.g. [{ days: 'Monday – Sunday', time: '7:00 AM – 1:00 AM' }]. Left empty until confirmed.
  hours: [],

  social: {
    instagram: { handle: '@sukun_lb', url: 'https://www.instagram.com/sukun_lb/' },
  },

  // Shown as a small band on the homepage. Set to null to remove.
  offer: {
    title: '20% for every student',
    detail: 'Show your student ID when you pay.',
  },

  // Optional: an endpoint that accepts a JSON POST (Formspree, a Netlify function, etc.).
  // While null, feedback is handed over to WhatsApp with the message pre-filled.
  feedbackEndpoint: null,

  currency: '$',
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const fullAddress = (a = restaurant.address) =>
  `${a.street}, ${a.landmark}, ${a.city}`;
