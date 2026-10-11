/*
 * Offers taken from the restaurant's Instagram posts and stories.
 * Set `active: false` (or delete the entry) when an offer ends.
 * `posted` is the date the offer appeared on Instagram, for reference only.
 */

export const offers = [
  {
    id: 'open-wings',
    active: true,
    title: 'Open Wings Tuesday',
    price: 14,
    details: 'Unlimited wings, all day, every Tuesday.',
    terms: 'All branches · Dine-in only',
    image: '/images/offers/open-wings.webp',
    imageAlt: 'Open Wings poster: every Tuesday, all day, only $14',
    posted: '2026-10-05',
  },
  {
    id: 'crispy-box',
    active: true,
    title: 'The crispy offer',
    price: 27,
    details: '15 crispy strips, family size fries, 3 coleslaw, 3 buns and a 1.25 L Pepsi.',
    terms: 'Order by phone or WhatsApp',
    image: '/images/offers/crispy-box.webp',
    imageAlt: 'Box of crispy strips with fries, coleslaw, buns, sauces and a Pepsi bottle, $27',
    posted: '2026-09-28',
  },
  {
    id: 'charcoal-chicken',
    active: true,
    title: 'Charcoal chicken, your way',
    price: 18,
    details: 'Charcoal-grilled chicken served with your choice of fries or rice.',
    terms: 'Order by phone or WhatsApp',
    image: '/images/offers/charcoal-chicken.webp',
    imageAlt: 'Charcoal grilled chicken platter with pickles, lemon and sauces, $18 with fries or rice',
    posted: '2026-09-21',
  },
  {
    id: 'fourth-sandwich',
    active: true,
    title: 'The fourth is on us',
    price: null,
    details: 'Buy 3 charcoal chicken sandwiches and get the fourth free.',
    terms: 'Order by phone or WhatsApp',
    image: '/images/offers/fourth-sandwich.webp',
    imageAlt: 'Charcoal chicken sandwiches wrapped in Zaher’s paper',
    posted: '2026-09-28',
  },
  {
    id: 'student-id',
    active: true,
    title: 'Study hard. Eat better.',
    price: null,
    details: '15% off when you show your university ID, and any combo for $2.5.',
    terms: 'Hamra · Bliss Street',
    image: '/images/offers/student-offer.webp',
    imageAlt: 'Student offer poster: 15% off with your uni ID, any combo for $2.5',
    posted: '2026-05-02',
  },
];

export const activeOffers = offers.filter((offer) => offer.active);
