// The Chez Em Joud menu, copied from the three-page menu on Instagram.
// Names, descriptions and prices are exactly as printed.
//
// Item fields:
//   id           stable key used by the cart (don't change it once orders exist)
//   name, desc, price
//   image        optional photo in /public/images
//   removable    ingredients a customer can ask to leave out (taken from the description)
//   askFlavor    shows a short "which flavor?" field

export const categories = [
  {
    id: 'appetizers',
    title: 'Appetizers & Sides',
    items: [
      {
        id: 'classic-fries',
        name: 'Classic Fries',
        desc: 'A generous serving of golden, classic salted fries.',
        price: 3.5,
      },
      {
        id: 'mozzarella-sticks',
        name: 'Mozzarella Sticks',
        desc: 'Five crispy mozzarella sticks with honey mustard dip.',
        price: 5,
        removable: ['Honey mustard dip'],
      },
      {
        id: 'cheesy-garlic-bread',
        name: 'Cheesy Garlic Bread',
        desc: 'Four toasted garlic-butter baguette pieces with melted mozzarella.',
        price: 5,
      },
    ],
  },
  {
    id: 'chicken',
    title: 'Signature Chicken',
    items: [
      {
        id: 'paprika-crispy',
        name: 'Paprika Crispy',
        desc: 'Crispy paprika chicken, cheddar, iceberg, pickles & paprika sauce.',
        price: 6,
        removable: ['Cheddar', 'Iceberg', 'Pickles', 'Paprika sauce'],
      },
      {
        id: 'chick-boom',
        name: 'Chick Boom',
        desc: 'American-style chicken, cheddar, caramelized onions & Boom sauce.',
        price: 6,
        removable: ['Cheddar', 'Caramelized onions', 'Boom sauce'],
      },
      {
        id: 'creamy-mushroom-chicken-melt',
        name: 'Creamy Mushroom Chicken Melt',
        desc: 'Tender chicken, sauteed mushrooms, creamy sauce & melted cheese.',
        price: 7,
        removable: ['Mushrooms', 'Creamy sauce', 'Cheese'],
      },
    ],
  },
  {
    id: 'beef',
    title: 'Signature Beef',
    items: [
      {
        id: 'philly-steak',
        name: 'Philly Steak',
        desc: 'Thinly sliced beef, onions, bell peppers, mushrooms & melted cheese.',
        price: 8,
        removable: ['Onions', 'Bell peppers', 'Mushrooms', 'Cheese'],
      },
      {
        id: 'mushroom-steak',
        name: 'Mushroom Steak',
        desc: 'Tender sliced beef, onions, mushrooms, melted cheese & creamy mushroom sauce.',
        price: 8,
        image: 'mushroom-steak',
        removable: ['Onions', 'Mushrooms', 'Cheese', 'Mushroom sauce'],
      },
    ],
  },
  {
    id: 'burgers',
    title: 'Burgers',
    items: [
      {
        id: 'escalope-burger',
        name: 'Escalope Burger',
        desc: 'Crispy chicken escalope, coleslaw, fries, pickles & garlic paste.',
        price: 6.5,
        removable: ['Coleslaw', 'Fries', 'Pickles', 'Garlic paste'],
      },
      {
        id: 'grilled-chicken-burger',
        name: 'Grilled Chicken Burger',
        desc: 'Grilled chicken breast, iceberg, melted cheese, onions & garlic mayo.',
        price: 6.5,
        removable: ['Iceberg', 'Cheese', 'Onions', 'Garlic mayo'],
      },
      {
        id: 'swiss-mushroom-burger',
        name: 'Swiss Mushroom Burger',
        desc: 'Juicy beef, Swiss cheese, mushrooms, iceberg & creamy mushroom sauce.',
        price: 7.5,
        removable: ['Swiss cheese', 'Mushrooms', 'Iceberg', 'Mushroom sauce'],
      },
      {
        id: 'em-jouds-classic',
        name: 'Em Joud’s Classic',
        desc: 'Juicy beef, cheddar, grilled onions, iceberg, fries & our house sauce.',
        price: 7.5,
        removable: ['Cheddar', 'Grilled onions', 'Iceberg', 'Fries', 'House sauce'],
      },
    ],
  },
  {
    id: 'lebanese',
    title: 'Lebanese Favorites',
    items: [
      {
        id: 'original-taouk',
        name: 'Original Taouk',
        desc: 'Grilled marinated chicken, toum, pickles & fries in Lebanese bread.',
        price: 5.5,
        removable: ['Toum', 'Pickles', 'Fries'],
      },
      {
        id: 'kafta',
        name: 'Kafta',
        desc: 'Juicy grilled kafta, fries & coleslaw in traditional Lebanese bread.',
        price: 5.5,
        removable: ['Fries', 'Coleslaw'],
      },
      {
        id: 'rosto',
        name: 'Rosto',
        desc: 'Warm roast beef, iceberg, tomato, pickles, mayo & mustard in a toasted sub.',
        price: 5,
        removable: ['Iceberg', 'Tomato', 'Pickles', 'Mayo', 'Mustard'],
      },
    ],
  },
  {
    id: 'sweet',
    title: 'Something Sweet',
    items: [
      {
        id: 'fudgy-brownie',
        name: 'Fudgy Brownie',
        desc: 'Rich, moist chocolate brownie, served plain.',
        price: 3,
      },
      {
        id: 'chocolate-lazy-cake',
        name: 'Rich Chocolate Lazy Cake',
        desc: 'A thick round slice of our rich chocolate-and-biscuit cake.',
        price: 3,
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    items: [
      { id: 'water', name: 'Water', desc: 'Still bottled water.', price: 0.6 },
      { id: 'sparkling-water', name: 'Sparkling Water', desc: 'Bottled sparkling water.', price: 1 },
      {
        id: 'soft-drinks',
        name: 'Soft Drinks',
        desc: 'Ask for available flavors.',
        price: 1.25,
        askFlavor: true,
      },
    ],
  },
]

export const itemsById = Object.fromEntries(categories.flatMap((c) => c.items.map((i) => [i.id, i])))
