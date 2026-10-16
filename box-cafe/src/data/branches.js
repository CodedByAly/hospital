// Box Cafe branches. Each guest picks one when the site opens.
// `hours` comes from the Box Cafe Instagram bio; null means not provided yet.
// `boxBun: true` shows the Box Bun burger menu (the Box Bun menu lists Zaarour only).

export const branches = [
  {
    id: 'achrafieh',
    name: 'Achrafieh',
    hours: ['Mon to Fri, 7:30 AM to 10 PM', 'Sat, 7:30 AM to 2 PM'],
    mapsUrl: 'https://maps.app.goo.gl/hS3Ygvq6tWmd7krF6',
    boxBun: false,
  },
  {
    id: 'antelias',
    name: 'Antelias',
    hours: null,
    mapsUrl: 'https://maps.app.goo.gl/3FioYdERVf3qbKBbA',
    boxBun: false,
  },
  {
    id: 'zaarour',
    name: 'Zaarour',
    hours: ['Sat & Sun, 10 AM to 9 PM'],
    mapsUrl: 'https://maps.app.goo.gl/D3hPndTE39PRBF9f6',
    boxBun: true,
  },
];

export const brand = {
  name: 'Box Cafe',
  tagline: 'For the love of coffee...',
  by: 'By Société Last Exit',
  phone: '+9613396689',
  phoneDisplay: '03 396 689',
  instagram: { handle: '@box.cafelb', url: 'https://www.instagram.com/box.cafelb/' },
  boxBunInstagram: { handle: '@box.bunlb', url: 'https://www.instagram.com/box.bunlb/' },
};

export const getBranch = (id) => branches.find((b) => b.id === id) ?? null;
