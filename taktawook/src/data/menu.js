// Mirrors the printed Taktawook menu. Prices in Lebanese pounds.
// fav = thumbs-up on the printed menu, spicy = chili on the printed menu.

export const SECTIONS = [
  {
    id: 'sandwiches',
    title: 'Sandwiches',
    img: 'cut-sub',
    groups: [
      {
        title: 'In Lebanese bread',
        sizes: ['Medium', 'Large'],
        items: [
          { id: 'tawook', name: 'Tawook', prices: [480000, 600000] },
          { id: 'taktawook', name: 'Taktawook', prices: [480000, 600000], fav: true },
          { id: 'spicy-tawook', name: 'Spicy Tawook', prices: [540000, 700000], spicy: true },
          { id: 'cheesy-tawook', name: 'Cheesy Tawook', prices: [540000, 700000] },
          { id: 'strips', name: 'Chicken Strips', prices: [450000, 650000], fav: true },
          { id: 'sausage', name: 'Spicy Beef Sausage', prices: [400000, 450000] },
          { id: 'escalope', name: 'Escalope', prices: [null, 500000] },
          { id: 'fries-sandwich', name: 'Fries Sandwich', prices: [230000, 280000] },
        ],
      },
      {
        title: 'In French baguette',
        items: [
          { id: 'b-sausage', name: 'Spicy Beef Sausage', price: 450000 },
          { id: 'b-strips', name: 'Chicken Strips', price: 500000 },
          { id: 'b-escalope', name: 'Escalope', price: 500000 },
          { id: 'b-chicken', name: 'Chicken Sandwich', price: 580000 },
        ],
      },
      {
        title: 'In a sub',
        items: [
          { id: 's-tawook', name: 'Tawook Sub', price: 650000 },
          { id: 's-mexican', name: 'Mexican Tawook', price: 600000 },
          { id: 's-crispy', name: 'Crispy Sub', price: 590000 },
          { id: 's-francisco', name: 'Francisco', price: 600000 },
        ],
      },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgers',
    img: 'cut-burger2',
    groups: [
      {
        items: [
          { id: 'tak-burger', name: 'Tak Burger', price: 580000, fav: true },
          { id: 'mexi-tak', name: 'Mexi-Tak Burger', price: 580000, spicy: true },
          { id: 'tawooked', name: 'Tawooked Burger', price: 530000, fav: true },
          { id: 'golden-crispy', name: 'Golden Crispy Burger', price: 580000 },
          { id: 'barbecue', name: 'Barbecue Burger', price: 580000 },
          { id: 'chili-cheddar', name: 'Chili Cheddar Burger', price: 680000 },
          { id: 'lebanese-burger', name: 'Lebanese Burger', price: 530000, addon: { name: 'Cheddar cheese', price: 100000 } },
        ],
      },
    ],
  },
  {
    id: 'platters',
    title: 'Platters',
    img: 'cut-platter',
    groups: [
      {
        items: [
          { id: 'breast', name: 'Grilled Chicken Breast', price: 1100000 },
          { id: 'boneless', name: 'Boneless Grilled Chicken', sizes: ['Whole', 'Half'], prices: [1700000, 900000] },
          { id: 'tawook-platter', name: 'Tawook', price: 1100000 },
          { id: 'escalope-platter', name: 'Escalope', price: 1000000 },
        ],
      },
    ],
  },
  {
    id: 'starters',
    title: 'Starters & Sides',
    img: 'cut-curly',
    groups: [
      {
        items: [
          { id: 'tenders', name: 'Crispy Chicken Tenders', note: 'with BBQ sauce', price: 500000 },
          { id: 'popcorn', name: 'Popcorn Chicken', note: 'with honey mustard sauce', price: 500000 },
          { id: 'imported-fries', name: 'Imported Fries', note: 'with ketchup', price: 330000 },
          { id: 'curly-fries', name: 'Curly Fries', note: 'with cocktail sauce', price: 350000 },
          { id: 'wedges', name: 'Potato Wedges', note: 'with cocktail sauce', price: 330000 },
        ],
      },
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    img: 'cut-salad',
    groups: [
      {
        items: [
          { id: 'caesar', name: 'Caesar Salad', price: 480000, addon: { name: 'Chicken', price: 170000 } },
          { id: 'kale', name: 'Kale Salad', price: 480000, addon: { name: 'Chicken', price: 170000 } },
          { id: 'fattoush', name: 'Fattoush', price: 450000 },
        ],
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    groups: [
      {
        items: [
          { id: 'soft-drink', name: 'Soft Drink', price: 110000 },
          { id: 'water', name: 'Water', price: 40000 },
          { id: 'sparkling', name: 'Sparkling Water', price: 100000 },
          { id: 'ice-tea', name: 'Ice Tea', price: 100000 },
          { id: 'juice', name: 'Juice', price: 40000 },
          { id: 'ayran', name: 'Ayran (yogurt drink)', price: 110000 },
        ],
      },
    ],
  },
]

export const MEAL_BOOSTER = { id: 'meal-booster', name: 'Meal Booster (fries & soft drink)', price: 260000 }

export const COMBOS = [
  { id: 'combo-bbq', name: 'BBQ Burger Combo', price: 700000, img: 'bbq-combo' },
  { id: 'combo-crispy', name: 'Crispy Sandwich Combo', price: 700000, img: 'crispy-combo' },
]

export const WING_FLAVORS = ['Sweet & Chili', 'Plain', 'Grilled', 'Buffalo', 'BBQ']

export const BRANCHES = [
  {
    id: 'sarba',
    name: 'Sarba',
    area: 'Sarba, Jounieh',
    phones: ['09 912 803', '03 131 140'],
    map: 'https://www.google.com/maps/search/?api=1&query=Taktawook+Sarba+Jounieh',
  },
  {
    id: 'dora',
    name: 'Dora',
    area: 'Dora',
    phones: ['01 255 663', '01 255 667'],
    map: 'https://www.google.com/maps/search/?api=1&query=Taktawook+Dora',
  },
]

export const WHATSAPP = '9613131140'
export const EMAIL = 'info.taktawook@gmail.com'
export const INSTAGRAM = 'https://www.instagram.com/taktawook/'

export const formatLBP = (n) => n.toLocaleString('en-US')
