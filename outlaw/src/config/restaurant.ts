/**
 * Everything about the restaurant itself, in one place. Taken from the
 * Outlaw Sushi Bar Instagram profile and Thrubits menu. Values set to null
 * or '' were not provided; the site hides or adapts those parts until they
 * are filled in.
 */

export type Line = { id: string; label: string; display: string; whatsapp: string }

/** Both numbers take WhatsApp orders; the guest picks one at checkout. */
export const lines: Line[] = [
  { id: 'a', label: 'Line 1', display: '78 997 164', whatsapp: '96178997164' },
  { id: 'b', label: 'Line 2', display: '78 944 899', whatsapp: '96178944899' },
]

export const restaurant = {
  name: 'Outlaw Sushi Bar',
  shortName: 'Outlaw',
  /** Public URL once deployed, for canonical and Open Graph links. No trailing slash. */
  siteUrl: '',
  kind: 'Sushi restaurant',
  address: 'Mansourieh main road, facing the municipality',
  locality: 'Mansourieh',
  region: 'Mount Lebanon',
  country: 'LB',
  mapsQuery: 'Outlaw Sushi Bar, Mansourieh, Lebanon',
  services: ['Dine in', 'Take away', 'Delivery'],
  instagram: { handle: '@outlawsushibar', url: 'https://www.instagram.com/outlawsushibar/' },
  /** The Instagram profile links a Facebook page named "Outlaw sushi bar"; add its URL here. */
  facebook: '',
  /**
   * Opening hours were not provided. Fill in to show them, e.g.
   * [{ days: 'Monday – Sunday', open: '12:00', close: '23:30' }]
   */
  hours: null as null | { days: string; open?: string; close?: string; closed?: boolean }[],
  currency: '$',
  ordering: {
    pickup: true,
    delivery: true,
    /** Delivery fee in USD; null while it is confirmed per order on WhatsApp. */
    deliveryFee: null as number | null,
    pickupLeadMinutes: 20,
  },
  payments: {
    cash: true,
    /** Whish Money goes to the same number the order is sent to. */
    whish: true,
  },
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.mapsQuery)}`
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapsQuery)}&output=embed`

export const whatsappLink = (line: Line, text = '') =>
  `https://wa.me/${line.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
