// Mirrors the current Taktawook menu. Prices in Lebanese pounds.
// fav = thumbs-up on the printed menu, spicy = chili on the printed menu.
// tone picks the band color, like the colored pages of the printed menu.

export const SECTIONS = [
  {
    id: 'sandwiches',
    title: 'Sandwiches',
    tone: 'teal',
    photos: ['photo-wrap-1', 'photo-wrap-2', 'photo-wrap-3'],
    groups: [
      {
        title: 'In Lebanese bread',
        sizes: ['Medium', 'Large'],
        items: [
          { id: 'taktawook', name: 'Taktawook', fav: true, prices: [390000, 490000], desc: 'Tawook with fries, Tak sauce, coleslaw, pickles and garlic.' },
          { id: 'tawook', name: 'Tawook', prices: [390000, 490000], desc: 'Tawook with fries, coleslaw and pickles, dressed with ketchup and garlic sauce.' },
          { id: 'spicy-tawook', name: 'Spicy Tawook', spicy: true, prices: [440000, 550000], desc: 'Tawook with iceberg lettuce and jalapeño, dressed with Mexi-Tak sauce and loaded with cheddar cheese.' },
          { id: 'cheesy-tawook', name: 'Cheesy Tawook', prices: [440000, 550000], desc: 'Tawook with iceberg lettuce, pickles, garlic sauce and fries, loaded with the Cheesy-Tak mix.' },
          { id: 'charcoal', name: 'Charcoal Chicken', fav: true, prices: [390000, 550000], desc: 'Charcoal-grilled chicken with pickles, garlic sauce and our special sauce.' },
          { id: 'sausage', name: 'Spicy Beef Sausage', prices: [400000, 450000], desc: 'With tomato, pickles, onion, bell pepper, mayo and a drizzle of lemon juice.' },
          { id: 'escalope', name: 'Escalope', prices: [null, 450000], desc: 'Iceberg, pickles, tomato and garlic mayo sauce.' },
          { id: 'fries-sandwich', name: 'Fries Sandwich', prices: [200000, 250000], desc: 'Fries with garlic sauce, pickles and coleslaw, dressed with ketchup.' },
        ],
      },
    ],
  },
  {
    id: 'baguettes',
    title: 'Baguettes & Subs',
    tone: 'red',
    groups: [
      {
        title: 'In French baguette',
        items: [
          { id: 'b-sausage', name: 'Spicy Beef Sausage', price: 450000, desc: 'With tomato, pickles, mayo and a drizzle of lemon juice.' },
          { id: 'b-roast-beef', name: 'Roast Beef', price: 500000, desc: 'Roast beef with tomato, pickles, fresh mint, mayo and mustard.' },
          { id: 'b-charcoal', name: 'Charcoal Chicken', price: 475000, desc: 'Charcoal-grilled chicken with pickles, garlic sauce and our special sauce.' },
          { id: 'b-escalope', name: 'Escalope', price: 450000, desc: 'Iceberg, pickles, tomato and garlic mayo sauce.' },
          { id: 'b-chicken', name: 'Chicken Sandwich', price: 550000, desc: 'Grilled chicken breast, tomato, pickles, iceberg and garlic mayo sauce.' },
        ],
      },
      {
        title: 'In a sub',
        items: [
          { id: 's-tawook', name: 'Tawook Sub', price: 550000, desc: 'Tawook with fries, coleslaw, pickles, corn, ketchup and garlic sauce, loaded with melted mozzarella.' },
          { id: 's-mexican', name: 'Mexican Tawook', price: 550000, desc: 'Tawook with our Mexican spice mix, bell pepper, onion, corn and iceberg, with mayo and melted mozzarella.' },
          { id: 's-crispy', name: 'Crispy Sub', price: 550000, desc: 'Crispy chicken tenders with coleslaw, garlic sauce and cocktail sauce.' },
          { id: 's-francisco', name: 'Francisco', price: 550000, desc: 'Marinated Francisco chicken with corn and iceberg, dressed with mayo and soy sauce, loaded with mozzarella.' },
        ],
      },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgers',
    tone: 'red',
    photos: ['photo-tak-burger', 'photo-escalope-burger', 'photo-chili-burger'],
    groups: [
      {
        items: [
          { id: 'tak-burger', name: 'Tak Burger', fav: true, price: 500000, desc: 'Grilled beef patty, cheddar cheese, iceberg, pickles and Tak sauce.' },
          { id: 'mexi-tak', name: 'Mexi-Tak Burger', spicy: true, price: 500000, desc: 'Grilled beef patty, cheddar, iceberg, jalapeño, onion, bell pepper, tomato and Mexican sauce.' },
          { id: 'tawooked', name: 'Tawooked Burger', fav: true, price: 450000, desc: 'Grilled chicken breast, fries, pickles, iceberg, tomato and garlic mayo sauce.' },
          { id: 'escaloped', name: 'Escaloped Burger', price: 500000, desc: 'Deep-fried chicken escalope, cheddar cheese, pickles, tomato, iceberg and garlic mayo sauce.' },
          { id: 'barbecue', name: 'Barbecue Burger', price: 500000, desc: 'Grilled beef patty, grilled bell pepper and onion, iceberg, pickles, cheddar and BBQ mayo.' },
          { id: 'chili-cheddar', name: 'Chili Cheddar Burger', price: 680000, desc: 'Grilled beef patty, breaded chili cheddar, iceberg, jalapeño, tomato, chips and Mexican sauce.' },
          { id: 'lebanese-burger', name: 'Lebanese Burger', price: 450000, desc: 'Grilled beef patty, fries, coleslaw, ketchup, tomato and onion.', addon: { name: 'Cheddar cheese', price: 100000 } },
        ],
      },
    ],
  },
  {
    id: 'platters',
    title: 'Platters',
    tone: 'white',
    groups: [
      {
        items: [
          { id: 'breast', name: 'Grilled Chicken Breast', price: 920000, desc: 'With potato wedges, iceberg salad, lemon-mustard sauce, garlic sauce and pickles.' },
          { id: 'boneless', name: 'Charcoal Chicken', sizes: ['Whole', 'Half'], prices: [1600000, 850000], desc: 'Charcoal-grilled chicken with garlic sauce, fries, pickles and garlic bread.' },
          { id: 'tawook-platter', name: 'Tawook', price: 900000, desc: 'Tawook with garlic sauce, fries, pickles and coleslaw.' },
          { id: 'escalope-platter', name: 'Escalope', price: 1000000, desc: 'Iceberg, fries, pickles and garlic mayo sauce.' },
        ],
      },
    ],
  },
  {
    id: 'starters',
    title: 'Starters & Sides',
    tone: 'white',
    photos: ['photo-tenders', 'photo-popcorn'],
    groups: [
      {
        items: [
          { id: 'tenders', name: 'Crispy Chicken Tenders', note: 'with BBQ sauce', price: 400000 },
          { id: 'popcorn', name: 'Popcorn Chicken', note: 'with honey mustard sauce', price: 500000 },
          { id: 'imported-fries', name: 'Imported Fries', note: 'with ketchup', price: 300000 },
          { id: 'curly-fries', name: 'Curly Fries', note: 'with cocktail sauce', price: 350000 },
          { id: 'wedges', name: 'Potato Wedges', note: 'with cocktail sauce', price: 300000 },
        ],
      },
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    tone: 'white',
    photos: ['photo-caesar'],
    groups: [
      {
        items: [
          { id: 'caesar', name: 'Caesar Salad', price: 400000, addon: { name: 'Chicken', price: 150000 } },
          { id: 'kale', name: 'Kale Salad', price: 400000, addon: { name: 'Chicken', price: 150000 } },
        ],
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    tone: 'teal',
    groups: [
      {
        items: [
          { id: 'soft-drink', name: 'Soft Drink', price: 100000 },
          { id: 'water', name: 'Water', price: 40000 },
          { id: 'sparkling', name: 'Rim Sparkling', price: 80000 },
          { id: 'ice-tea', name: 'Ice Tea', price: 100000 },
          { id: 'juice', name: 'Juice', price: 40000 },
        ],
      },
    ],
  },
]

export const MEAL_BOOSTER = { id: 'meal-booster', name: 'Meal Booster (fries & soft drink)', price: 200000 }
export const BOOSTER_SECTIONS = ['sandwiches', 'baguettes', 'burgers']

export const COMBOS = [
  { id: 'combo-bbq', name: 'BBQ Burger Combo', price: 700000, img: 'bbq-combo' },
  { id: 'combo-crispy', name: 'Crispy Sandwich Combo', price: 700000, img: 'crispy-combo' },
]

export const WING_FLAVORS = ['Sweet & Chili', 'Plain', 'Grilled', 'Buffalo', 'BBQ']

export const BRANCHES = [
  {
    id: 'sarba',
    name: 'Sarba',
    area: 'Mar Youhanna Street, facing Coral station',
    phones: ['09 912 832', '09 912 803'],
    map: 'https://www.google.com/maps/search/?api=1&query=Mar+Youhanna+Street+Sarba+Jounieh',
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
