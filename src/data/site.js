// Everything about the café that might change lives here.
// Edit these values and the whole site (header, footer, contact, SEO data) follows.

export const site = {
  name: 'Bean Avenue',
  tagline: 'Brews, bonds and business',
  bio: 'Your coffee, your space',
  town: 'Aley',
  country: 'Lebanon',
  countryCode: 'LB',

  // Leave empty until the domain is live; used for canonical/OG URLs and structured data.
  url: '',

  phone: {
    display: '+961 81 185 505',
    e164: '+96181185505',
  },

  // WhatsApp uses the same mobile number. Set to '' to hide every WhatsApp button.
  whatsapp: '96181185505',

  maps: 'https://maps.app.goo.gl/YaEWLxNcQGWJa5Qv8',

  // Only accounts the café actually runs. Add facebook / tiktok here if they open one.
  social: [
    { id: 'instagram', label: 'Instagram', handle: '@beanavenue.lb', href: 'https://www.instagram.com/beanavenue.lb/' },
  ],

  // Hours as posted on Instagram. Times are 24h, Beirut time; '24:00' means midnight.
  hours: {
    opens: '07:00',
    closes: '24:00',
    display: '7am – 12am',
    timeZone: 'Asia/Beirut',
  },

  currency: 'USD',

  // Feedback form: paste a form-service URL (Formspree, Getform, your own API) to receive
  // submissions as JSON. While empty, the form hands the message over to WhatsApp instead.
  feedbackEndpoint: '',
}

export const whatsappLink = (text = '') =>
  site.whatsapp
    ? `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
    : ''

export const telLink = `tel:${site.phone.e164}`
