/**
 * Restaurant information — the single place to edit contact details,
 * hours, links and payment settings. Every value here comes from the
 * restaurant's own Instagram profile and printed menu.
 *
 * Values left empty ('' or null) are not yet provided. The UI hides or
 * adapts the related parts until they are filled in.
 */

export const restaurant = {
  name: 'عل منقل',
  nameLatin: 'Al Manqal',
  tagline: 'من أول لقمة…',
  // Short description used in the footer and meta tags (built from the menu only).
  description: 'مشاوي وساندويشات عالمنقل: شقف، كباب، طاووق، سجق ومقانق، وجبات وجاط عائلي. توصيل واستلام من المحل.',

  // Lebanese mobile number, local format for display and international for links.
  phone: {
    display: '78 785 060',
    international: '96178785060',
  },
  whatsapp: '96178785060',

  // Address text has not been provided yet. Fill it in to show it on the site.
  address: '',
  mapsUrl: 'https://maps.app.goo.gl/zmvu1wofrC7jfMqc8',

  /**
   * Opening hours, in the restaurant's local time (Asia/Beirut).
   * `close` earlier than `open` means closing after midnight.
   * Only one time window was provided (4:00 PM – 2:00 AM), applied to all days.
   */
  timezone: 'Asia/Beirut',
  hours: { open: '16:00', close: '02:00' },
  hoursLabel: 'من 4:00 العصر حتى 2:00 بعد نص الليل',

  social: {
    instagram: { handle: 'almanqal.lb', url: 'https://www.instagram.com/almanqal.lb/' },
    // Add facebook / tiktok here as { handle, url } when available.
  },

  ordering: {
    pickup: true,
    delivery: true,
    // Delivery fee in LBP. null = agreed with the customer when the order is confirmed.
    deliveryFee: null,
    // Optional list of delivery areas. Empty = free text field.
    deliveryAreas: [],
    // Optional endpoint (POST JSON). Empty = orders are sent to the restaurant on WhatsApp.
    orderEndpoint: '',
  },

  payment: {
    cash: true,
    whish: {
      enabled: true,
      // Restaurant's Whish Money number — NOT PROVIDED YET.
      // Set it like '78 785 060' and the checkout will display it with a copy button.
      number: '',
      accountName: '',
    },
  },

  // Optional endpoint for the feedback form (e.g. Formspree). Empty = sent on WhatsApp.
  feedbackEndpoint: '',

  // Public URL of the site, used for canonical links and sharing.
  siteUrl: '',
}

export const whatsappLink = (text = '') =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const phoneLink = `tel:+${restaurant.phone.international}`
