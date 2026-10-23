/**
 * Restaurant details used across the website.
 *
 * Everything here comes from Moods Burger's own Instagram profile, menu and
 * location post. Values left empty ("" or null) have not been provided yet;
 * the UI hides or adapts the related feature until they are filled in.
 */

export const restaurant = {
  name: 'Moods Burger',
  tagline: 'Good food, Good Mood.',

  // Digits only, international format without "+". Used for calls and WhatsApp.
  phone: '96181810409',
  phoneDisplay: '+961 81 810 409',
  email: 'Moodsburgerlb@gmail.com',

  address: {
    area: 'Kraytem, Beirut',
    street: 'Bader Demechkieh Street',
    landmark: 'Near Al Baba Sweets, facing the Characters Store',
  },
  mapsUrl: 'https://maps.app.goo.gl/HNvEyx2PPxyNBEzi9',

  // Opening hours, Beirut time. A closing time earlier than the opening time
  // means the kitchen closes after midnight. Day 0 is Sunday.
  hours: [
    { day: 0, open: '16:00', close: '00:00' },
    { day: 1, open: '13:30', close: '01:30' },
    { day: 2, open: '13:30', close: '01:30' },
    { day: 3, open: '13:30', close: '01:30' },
    { day: 4, open: '13:30', close: '01:30' },
    { day: 5, open: '13:30', close: '01:30' },
    { day: 6, open: '13:30', close: '01:30' },
  ],
  lateNight: { days: [1, 2, 3, 4, 5, 6], open: '22:30', close: '01:30' },
  timeZone: 'Asia/Beirut',

  // Only accounts with a real, confirmed link are shown. Leave a value empty
  // to hide that platform everywhere on the site.
  social: {
    instagram: 'https://www.instagram.com/moods.burger/',
    facebook: '', // The Instagram profile links to a "Moods Burger" Facebook page; add its URL here.
    tiktok: '',
  },
}

export const ordering = {
  currency: '$',

  // Delivery fee in dollars. null = confirmed by the restaurant on WhatsApp.
  deliveryFee: null,

  // Orders are sent to this WhatsApp number (digits only).
  whatsappNumber: restaurant.phone,

  whish: {
    // The restaurant's Whish Money number, e.g. '96181000000'.
    // The Whish payment option stays hidden on the live site until this is set.
    number: '',
    accountName: 'Moods Burger',
  },
}

// Where the feedback form posts to (for example a Formspree or Getform URL).
// When empty, the form opens the customer's email app addressed to the restaurant.
export const feedbackEndpoint = ''

export const whatsappLink = (text = '') =>
  `https://wa.me/${ordering.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const phoneLink = `tel:+${restaurant.phone}`
