// Everything about the restaurant that might change lives here.

export const site = {
  name: 'Chez Em Joud',
  tagline: 'Good food. Good mood.',
  bio: 'A little Chez. A lot to crave.',
  specialties: ['Sandwiches', 'Burgers', 'Sweet bites'],
  country: 'Lebanon',
  countryCode: 'LB',

  // Not published yet. Fill these in and they appear in the contact section and footer.
  town: '',
  address: '',
  maps: '',
  hours: '', // e.g. '11am – 11pm'

  // Leave empty until the domain is live; used for canonical/OG URLs and structured data.
  url: '',

  phone: {
    display: '+961 3 935 027',
    e164: '+9613935027',
  },

  // Orders and feedback are sent to this WhatsApp number.
  whatsapp: '9613935027',

  // Only accounts the restaurant actually runs.
  // Facebook page "Chez Em Joud" exists — paste its link here to show it.
  social: [
    { id: 'instagram', label: 'Instagram', handle: '@chez_emjoud', href: 'https://www.instagram.com/chez_emjoud/' },
    { id: 'facebook', label: 'Facebook', handle: 'Chez Em Joud', href: '' },
  ].filter((s) => s.href),

  currency: '$',

  ordering: {
    pickup: true,
    delivery: true,
    // Number to add a fixed delivery charge, or null when it depends on the area and is
    // confirmed on WhatsApp.
    deliveryFee: null,
    minimumOrder: 0,
  },

  // Optional: a form service URL (Formspree, Getform, own API) for the feedback form.
  // While empty, feedback opens WhatsApp with the message written out.
  feedbackEndpoint: '',
}

export const whatsappLink = (text = '') =>
  site.whatsapp
    ? `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
    : ''

export const telLink = `tel:${site.phone.e164}`

export const money = (n) => `${site.currency}${n.toFixed(2)}`
