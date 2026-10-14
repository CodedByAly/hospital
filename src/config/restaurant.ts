/**
 * Restaurant details — the single place to update contact info, hours,
 * links and payment settings. Everything in the UI reads from here.
 *
 * Source for every value below: the restaurant's ordering page
 * (kuku.moviyum.com) and Instagram profile (@kuku.chixjoint).
 * Values set to `null` were NOT provided yet — the UI hides or adapts
 * the related feature until you fill them in.
 */

export const restaurant = {
  name: 'Kuku Chix Joint',
  shortName: 'Kuku',
  /** Wording taken from the restaurant's own Instagram bio. */
  tagline: 'The Rolls-Royce of chicken in Lebanon.',
  specialties: 'Mac n Cheese, Strips, Wings, Burgers & more',

  /** Lebanese mobile, international format without "+" or spaces. */
  phone: '96181777384',
  phoneDisplay: '+961 81 777 384',
  /** Listed as "Message on WhatsApp" on the Instagram contact sheet. */
  whatsapp: '96181777384',
  email: 'info@kukuchixjoint.com',

  address: 'Khaldeh, Lebanon',
  /**
   * The full Google Maps short link was cut off in the screenshot
   * (maps.app.goo.gl/1m8WEaGyn…). Paste the complete link here.
   * Until then, a Maps search for the restaurant name is used.
   */
  mapsUrl: null as string | null,
  mapsSearchQuery: 'Kuku Chix Joint Khaldeh',

  /**
   * Opening hours (24h, Asia/Beirut). Taken from the ordering page:
   * "EVERYDAY: 3:00PM - 12:00 AM".
   * NOTE: the Instagram bio says "12:00 PM - 1:00 AM" — confirm which is current.
   */
  hours: { open: '15:00', close: '24:00' },
  timezone: 'Asia/Beirut',

  socials: {
    instagram: 'https://www.instagram.com/kuku.chixjoint/',
    /** Facebook page linked from the Instagram profile ("Kuku.chixjoint"). */
    facebook: 'https://www.facebook.com/Kuku.chixjoint',
    /** Not provided — leave null to hide. */
    tiktok: null as string | null,
  },

  payments: {
    currency: 'USD',
    /** "Dollar Rate: LBP 90,000 L.L" from the ordering page. Set to null to hide LBP totals. */
    lbpRate: 90000 as number | null,
    /** Whish Money number for transfers — same line as the restaurant's WhatsApp. Set to null to hide. */
    whishNumber: '+961 81 777 384' as string | null,
    whishAccountName: 'Kuku Chix Joint',
  },

  ordering: {
    pickup: true,
    delivery: true,
    /** Delivery fee in USD. Not provided — null means "confirmed on WhatsApp". */
    deliveryFee: null as number | null,
    /** Typical preparation time shown on confirmation, in minutes. Not provided — null hides it. */
    prepMinutes: null as number | null,
  },

  /**
   * Spice levels for items that say "choose your spice level".
   * The exact levels were not shown on the menu — confirm with the kitchen.
   */
  spiceLevels: [
    { id: 'mild', label: 'Mild' },
    { id: 'medium', label: 'Medium' },
    { id: 'hot', label: 'Hot' },
  ],

  siteUrl: 'https://kukuchixjoint.com',
} as const

export const whatsappLink = (text?: string) =>
  `https://wa.me/${restaurant.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const phoneLink = `tel:+${restaurant.phone}`

export const mapsLink =
  restaurant.mapsUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.mapsSearchQuery)}`
