// Everything about the restaurant lives here. Edit this file to update
// contact details, hours, links or payment settings across the whole site.
//
// Values set to `null` are things the restaurant has not provided yet.
// The UI hides anything that is `null`, so nothing made-up is ever shown.

export const restaurant = {
  name: 'Talia',
  fullName: 'Talia Resto Cafe',
  tagline: 'Built for your daily grind.',
  // Short lines taken from Talia's own Instagram captions.
  voice: {
    welcome: "The doors are open and our team can't wait to welcome you in.",
    coffee: 'Fuel for your focus and comfort for your soul, one sip at a time.',
    drinks: "Made with care. Every drink we serve satisfies a craving that'll keep you coming back for more.",
    cold: 'Some things just taste better cold.',
    sandwich: "The sandwich and drink you'll want every single day.",
    moments: 'Good moments start here.',
  },

  address: {
    street: 'Bikkerman Street',
    city: 'Saida',
    country: 'Lebanon',
    landmark: 'Next to LIU University',
  },
  // Opens a Google Maps search for the address above.
  // Replace with the exact Google Maps share link once available.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Talia+Resto+Cafe+Bikkerman+Street+Saida+Lebanon',

  phone: '+96176163675',
  phoneDisplay: '+961 76 163 675',
  // International format, digits only. Used to build wa.me links.
  whatsapp: '96176163675',

  hours: {
    summary: 'Open all week from 7:30 AM',
    opens: '7:30 AM',
    closes: null, // closing time not provided yet
    days: 'Monday to Sunday',
  },

  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@talia.leb', url: 'https://www.instagram.com/talia.leb/' },
    { id: 'whatsapp', label: 'WhatsApp', handle: '+961 76 163 675', url: 'https://wa.me/96176163675' },
    // Add Facebook / TikTok here once the restaurant shares the links:
    // { id: 'facebook', label: 'Facebook', handle: '', url: '' },
    // { id: 'tiktok', label: 'TikTok', handle: '', url: '' },
  ],

  currency: '$',

  ordering: {
    // Talia is a dine-in cafe: guests build their order at the table.
    mode: 'dine-in',
    // Payment options shown on the order screen.
    payments: {
      cash: true,
      // Whish Money number in international format, e.g. '96170000000'.
      // Leave as null to hide the Whish option entirely.
      whishNumber: null,
    },
  },

  // Where the feedback form sends its data. When null, the form opens
  // WhatsApp with the message already written instead.
  // Works with any JSON endpoint (Formspree, a serverless function, etc.).
  feedbackEndpoint: null,

  // Public URL of the site once deployed (used for share links). null = not set yet.
  siteUrl: null,
};

export const whatsappLink = (text) =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const telLink = `tel:${restaurant.phone}`;
export const addressLine = `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.country}`;
