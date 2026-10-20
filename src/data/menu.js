// Chippy menu, transcribed from the official printed menu.
//
// Names, prices and descriptions match the printed menu word for word.
// To change something, edit this file only, the whole site reads from it.
//
//  price        number in USD
//  description  text exactly as printed (null when the menu shows none)
//  remove       ingredients the customer may ask to leave out
//  options      required choices, e.g. rice or noodles
//  extras       optional paid add-ons (ids from `extraGroups` below)
//  fullName     longer name used in the cart and order (optional)
//  image        file name in /public/images/menu (null = no photo yet)

export const categories = [
  { id: 'ocean-combo', name: 'Ocean Combo', blurb: 'Served with French fries and a bun.' },
  { id: 'chippy-chicken', name: 'Chippy Chicken', blurb: 'Chippy Chicken, French Fries, Sauce, Coleslaw, Bun + Pepsi.' },
  { id: 'kiddy-meal', name: 'Kiddy Meal', blurb: null },
  { id: 'sandwiches', name: 'Sandwiches', blurb: null },
  { id: 'combo-sandwich', name: 'Combo Sandwich', blurb: null },
  { id: 'chippy-mongo', name: 'Chippy Mongo', blurb: 'Your choice of rice or noodles.' },
  { id: 'salad', name: 'Salad', blurb: null },
  { id: 'side-orders', name: 'Side Orders', blurb: null },
]

// Add-ons built only from items that are already on the menu,
// at their menu price.
export const extraGroups = {
  side: {
    label: 'Add a side',
    choices: [
      { id: 'fries', label: 'Fries', price: 4 },
      { id: 'wedges', label: 'Wedges', price: 5 },
    ],
  },
}

const chickenIncludes = 'Chippy Chicken, French Fries, Sauce, Coleslaw, Bun + Pepsi.'
const chickenRemove = ['Sauce', 'Coleslaw']
const mongoBase = {
  id: 'base',
  label: 'Rice or noodles',
  choices: [
    { id: 'rice', label: 'Rice' },
    { id: 'noodles', label: 'Noodles' },
  ],
}

export const menu = [
  // Ocean Combo
  {
    id: 'chippy-shrimp',
    category: 'ocean-combo',
    name: 'Chippy Shrimp',
    price: 12,
    description: '8 Jumbo Shrimps, French Fries, Cocktail Sauce, Tartar Sauce, Bun.',
    remove: ['Cocktail Sauce', 'Tartar Sauce', 'Bun'],
    image: 'chippy-shrimp',
    imageAlt: 'Chippy Shrimp box with fried jumbo shrimps, fries, tartar and cocktail sauce',
  },
  {
    id: 'chippy-fish',
    category: 'ocean-combo',
    name: 'Chippy Fish',
    price: 8,
    description: 'Fish, French Fries, Lemon, Tartar Sauce, Bun.',
    remove: ['Lemon', 'Tartar Sauce', 'Bun'],
  },
  {
    id: 'chippy-mix',
    category: 'ocean-combo',
    name: 'Chippy Mix',
    price: 12,
    description: 'Shrimp, Fish, French Fries, Lemon, Tartar Sauce, Bun.',
    remove: ['Lemon', 'Tartar Sauce', 'Bun'],
  },

  // Chippy Chicken
  {
    id: 'chicken-combo',
    category: 'chippy-chicken',
    name: 'Combo',
    fullName: 'Chippy Chicken Combo',
    detail: '5 pcs',
    price: 9,
    description: chickenIncludes,
    remove: chickenRemove,
  },
  {
    id: 'chicken-duo',
    category: 'chippy-chicken',
    name: 'Duo',
    fullName: 'Chippy Chicken Duo',
    detail: '10 pcs',
    price: 15,
    description: chickenIncludes,
    remove: chickenRemove,
  },
  {
    id: 'chicken-trio',
    category: 'chippy-chicken',
    name: 'Trio',
    fullName: 'Chippy Chicken Trio',
    detail: '15 pcs',
    price: 22,
    description: chickenIncludes,
    remove: chickenRemove,
  },
  {
    id: 'chicken-family',
    category: 'chippy-chicken',
    name: 'Family',
    fullName: 'Chippy Chicken Family',
    detail: '20 pcs',
    price: 35,
    description: chickenIncludes,
    remove: chickenRemove,
    image: 'chippy-family',
    imageAlt: 'Chippy Family box of crispy chicken strips, fries, dips and Pepsi cans',
  },

  // Kiddy Meal
  {
    id: 'kiddy-meal',
    category: 'kiddy-meal',
    name: 'Kiddy Meal',
    price: 6,
    description: '3 Chippy Chicken, French Fries, Ketchup, Bun + Juice.',
    remove: ['Ketchup'],
  },

  // Sandwiches
  {
    id: 'golden-bun',
    category: 'sandwiches',
    name: 'Golden Bun',
    price: 6,
    description: 'Chicken, Sauce, Cheddar, Lettuce, Bun.',
    remove: ['Sauce', 'Cheddar', 'Lettuce'],
    extras: ['side'],
    image: 'golden-bun',
    imageAlt: 'Golden Bun crispy chicken burger with lettuce and white sauce on a sesame bun',
  },
  {
    id: 'crunch-me',
    category: 'sandwiches',
    name: 'Crunch Me',
    price: 6,
    description: 'Chicken, Sauce, Cheddar, Lettuce, Baguette.',
    remove: ['Sauce', 'Cheddar', 'Lettuce'],
    extras: ['side'],
  },
  {
    id: 'chippy-twist',
    category: 'sandwiches',
    name: 'Chippy Twist',
    price: 6,
    description: 'Chicken, Sauce, Cheddar, Lettuce, Tomato, Tortilla.',
    remove: ['Sauce', 'Cheddar', 'Lettuce', 'Tomato'],
    extras: ['side'],
  },
  {
    id: 'submarine',
    category: 'sandwiches',
    name: 'Submarine',
    price: 7,
    description: 'Chicken, Sauce, Emmental, Mushroom, Baguette.',
    remove: ['Sauce', 'Emmental', 'Mushroom'],
    extras: ['side'],
  },
  {
    id: 'chix-and-chill',
    category: 'sandwiches',
    name: 'Chix & Chill',
    price: 7,
    description: 'Chicken, Cheddar, Pepper, Onion, Chilly Sauce, Baguette.',
    remove: ['Cheddar', 'Pepper', 'Onion', 'Chilly Sauce'],
    extras: ['side'],
    image: 'chix-and-chill',
    imageAlt: 'Chix & Chill baguette loaded with chicken, peppers, onion and melted cheddar',
  },
  {
    id: 'blue-bun',
    category: 'sandwiches',
    name: 'Blue Bun',
    price: 6,
    description: 'Fish, Tartar Sauce, Pickles, Lemon Juice, Bun.',
    remove: ['Tartar Sauce', 'Pickles', 'Lemon Juice'],
    extras: ['side'],
  },
  {
    id: 'craby',
    category: 'sandwiches',
    name: 'Craby',
    price: 6,
    description: 'Crab, Tartar Sauce, Lettuce, Corn, Mustard, Baguette.',
    remove: ['Tartar Sauce', 'Lettuce', 'Corn', 'Mustard'],
    extras: ['side'],
  },
  {
    id: 'shrimp-boss',
    category: 'sandwiches',
    name: 'Shrimp Boss',
    price: 8,
    description: 'Shrimp, Sauce, Lettuce, Tomato, Tortilla.',
    remove: ['Sauce', 'Lettuce', 'Tomato'],
    extras: ['side'],
  },

  // Combo Sandwich
  {
    id: 'combo-sandwich',
    category: 'combo-sandwich',
    name: 'Combo Sandwich',
    price: 10,
    // The printed menu shows a photo only, no item list.
    description: null,
    image: 'combo-sandwich',
    imageAlt: 'Combo Sandwich: chicken wrap with fries and a cold drink',
  },

  // Chippy Mongo
  {
    id: 'shrimp-mongo',
    category: 'chippy-mongo',
    name: 'Shrimp Mongo',
    price: 12,
    description: 'Shrimp, Fresh Pepper, Vegetables, Mongo Sauce, Rice/Noodles.',
    options: [mongoBase],
    remove: ['Fresh Pepper', 'Vegetables'],
  },
  {
    id: 'chicken-mongo',
    category: 'chippy-mongo',
    name: 'Chicken Mongo',
    price: 9,
    description: 'Chicken, Fresh Pepper, Vegetables, Mongo Sauce, Rice/Noodles.',
    options: [mongoBase],
    remove: ['Fresh Pepper', 'Vegetables'],
    image: 'chippy-mongo',
    imageAlt: 'Chicken Mongo bowl with peppers, vegetables and mongo sauce over rice',
  },

  // Salad
  { id: 'shrimp-salad', category: 'salad', name: 'Shrimp Salad', price: 6, description: null },
  { id: 'crab-salad', category: 'salad', name: 'Crab Salad', price: 6, description: null },
  { id: 'chicken-salad', category: 'salad', name: 'Chicken Salad', price: 6, description: null },
  { id: 'green-salad', category: 'salad', name: 'Green Salad', price: 6, description: null },

  // Side Orders
  { id: 'fries', category: 'side-orders', name: 'Fries', price: 4, description: null },
  { id: 'wedges', category: 'side-orders', name: 'Wedges', price: 5, description: null },
  { id: 'shrimp-dynamite', category: 'side-orders', name: 'Shrimp Dynamite', price: 12, description: null },
]

export const menuById = Object.fromEntries(menu.map((item) => [item.id, item]))

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))

// Items shown in the homepage line-up (all have real photos).
export const featuredIds = ['chippy-shrimp', 'chicken-family', 'golden-bun', 'chix-and-chill', 'chicken-mongo', 'combo-sandwich']
