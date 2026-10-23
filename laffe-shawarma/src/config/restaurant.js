/**
 * Restaurant information — the single place to edit contact details,
 * hours, links and payment settings. Values come from the restaurant's
 * Instagram profile (@laffetshawarma), posts and printed menu.
 *
 * Bilingual values are { en, ar }. Values left empty ('' or null) are not
 * provided yet; the UI hides or adapts the related parts until filled in.
 */

export const restaurant = {
  name: { en: 'Laffet Shawarma', ar: 'لفّة شاورما' },
  // From the Instagram bio.
  tagline: { en: 'One wrap and you’ll be back for another.', ar: 'بتخلّيك تعيد اللفّة' },
  description: {
    en: 'Chicken and lamb shawarma, kebbeh, tawook, hummus and fries on Hamra main street, Beirut. Order for pickup or delivery.',
    ar: 'شاورما دجاج وغنم، كبة، طاووق، حمص وبطاطا بشارع الحمرا الرئيسي، بيروت. اطلب استلام أو توصيل.',
  },

  phone: {
    display: '70 111 330',
    international: '96170111330',
  },
  whatsapp: '96170111330',

  address: {
    en: 'Hamra main street, facing Spinneys — Beirut',
    ar: 'شارع الحمرا الرئيسي، مقابل سبينيس — بيروت',
  },
  // No map link was provided — this searches the address above on Google Maps.
  // Replace with the restaurant's own maps.app.goo.gl link when available.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Laffet Shawarma, Hamra Main Street, Beirut'),

  /**
   * Opening hours in Asia/Beirut time. `close` at or before `open` means
   * closing after midnight. Instagram bio: 12 PM to 12 AM (applied to all days).
   */
  timezone: 'Asia/Beirut',
  hours: { open: '12:00', close: '00:00' },
  hoursLabel: { en: '12 PM – 12 AM', ar: 'من 12 الظهر لـ 12 بالليل' },

  social: {
    instagram: { handle: 'laffetshawarma', url: 'https://www.instagram.com/laffetshawarma/' },
    // Add facebook / tiktok here as { handle, url } when available.
  },

  ordering: {
    pickup: true,
    // Delivery is not stated on the profile — confirm with the restaurant.
    delivery: true,
    // Delivery fee in LBP. null = agreed with the customer when confirming.
    deliveryFee: null,
    // Optional list of delivery areas as { en, ar }. Empty = free text field.
    deliveryAreas: [],
    // Optional endpoint (POST JSON). Empty = orders are sent on WhatsApp.
    orderEndpoint: '',
  },

  payment: {
    cash: true,
    whish: {
      enabled: true,
      // Restaurant's Whish Money number — NOT PROVIDED YET.
      // Set it like '70 111 330' and checkout shows it with a copy button.
      number: '',
      accountName: '',
    },
  },

  // Optional endpoint for the feedback form (e.g. Formspree). Empty = WhatsApp.
  feedbackEndpoint: '',

  // Public URL of the site, used for canonical links and sharing.
  siteUrl: '',
}

export const whatsappLink = (text = '') =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const phoneLink = `tel:+${restaurant.phone.international}`
