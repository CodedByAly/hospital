// The Jungs menu, transcribed from the printed menu.
// Prices are in USD. To change the menu, edit this file only.
//
// Item fields
//   id           unique, used in URLs and the cart
//   name         as printed on the menu
//   description  as printed on the menu (omit when the menu has none)
//   price        base price
//   remove       ingredients the customer may ask to leave out
//   groups       option groups (see below)
//
// Option groups
//   type 'single'  pick exactly one (required) – an option can set `price` to replace the base price
//   type 'multi'   pick any – each option adds `add` to the price
//
// Calorie counts printed beside the salads were too small to read in the photo.
// Add them as `calories: '...'` on the item once confirmed and they will show up.

const extraDip = { id: 'extra-dip', label: 'Extra dip', add: 0.5 }

const saladOptions = [
  {
    id: 'portion',
    label: 'Portion',
    type: 'single',
    options: [
      { id: 'full', label: 'Full portion' },
      { id: 'half', label: 'Half portion', price: 5.5 },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    type: 'multi',
    options: [{ id: 'add-chicken', label: 'Add chicken', add: 1.5 }],
  },
]

export const categories = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    tone: 'red',
    items: [
      { id: 'fries', name: 'Fries', price: 3 },
      { id: 'curly-fries', name: 'Curly Fries', price: 3.5 },
      { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', portion: '4 pcs', price: 3.5 },
      { id: 'chicken-strips', name: 'Chicken Strips', portion: '3 pcs', price: 3.5 },
      {
        id: 'loaded-fries',
        name: 'Loaded Fries',
        description: 'Fries topped with chicken strips, melted cheddar and bbq sauce',
        price: 6,
        remove: ['Melted cheddar', 'BBQ sauce'],
      },
    ].map((item) => ({
      ...item,
      groups: [{ id: 'extras', label: 'Extras', type: 'multi', options: [extraDip] }],
    })),
  },
  {
    id: 'beef-subs',
    name: 'Beef Subs',
    tone: 'yellow',
    items: [
      {
        id: 'mushroom-load',
        name: 'Mushroom Load',
        description: 'Submarine bun with steak, mushroom, onion, jalapenos, mozzarella, and mayo sauce',
        price: 7,
        remove: ['Mushroom', 'Onion', 'Jalapenos', 'Mozzarella', 'Mayo sauce'],
      },
      {
        id: 'parmesan-steak',
        name: 'The Parmesan Steak',
        description: 'Steak, parmesan, tomato, fried onion, iceberg, and special sauce',
        price: 8,
        remove: ['Parmesan', 'Tomato', 'Fried onion', 'Iceberg', 'Special sauce'],
      },
    ],
  },
  {
    id: 'burgers',
    name: 'Burgers',
    tone: 'red',
    items: [
      {
        id: 'classic-burger',
        name: 'Classic Burger',
        description: 'Potato bun with beef patty, dill pickles, and cocktail sauce',
        price: 6,
        remove: ['Dill pickles', 'Cocktail sauce'],
      },
      {
        id: 'double-smashed-burger',
        name: 'Double Smashed Burger',
        description: 'Potato bun with double beef patty topped with Cheddar, dill pickles, and a classic-burger sauce',
        price: 7,
        remove: ['Cheddar', 'Dill pickles', 'Classic-burger sauce'],
      },
      {
        id: 'meat-the-jungs',
        name: 'Meat The Jungs',
        description: 'Potato bun with double smashed beef patty topped with Swiss cheese, rocca, Swiss & mushroom sauce',
        price: 7.5,
        remove: ['Swiss cheese', 'Rocca', 'Swiss & mushroom sauce'],
      },
      {
        id: 'bbq-bacon-smashed',
        name: 'BBQ Bacon Smashed',
        description: 'Potato bun with double beef patty, bacon, and bbq & mayo sauce',
        price: 8.5,
        remove: ['Bacon', 'BBQ & mayo sauce'],
      },
    ],
  },
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    tone: 'yellow',
    items: [
      {
        id: 'grilled-chicken-burger',
        name: 'Grilled Chicken Burger',
        description: 'Grilled chicken, emmental, strawberry jam, mozzarella patty, and mayo sauce',
        price: 7.5,
        remove: ['Emmental', 'Strawberry jam', 'Mozzarella patty', 'Mayo sauce'],
      },
      {
        id: 'chickn-crunch-burger',
        name: 'Chick’n Crunch Burger',
        description: 'Potato bun with crispy chicken filled with mozzarella cheese, dill pickles, iceberg, and sweet chilli mayo sauce',
        price: 7.5,
        remove: ['Dill pickles', 'Iceberg', 'Sweet chilli mayo sauce'],
      },
    ],
  },
  {
    id: 'salads',
    name: 'Salads',
    tone: 'yellow',
    note: 'Half portion $5.50 · Add chicken $1.50',
    items: [
      {
        id: 'nacho-salad',
        name: 'Nacho Salad',
        description: 'Nachos, cheddar cheese, olives, iceberg, sweet corn, carrot, topped with our special dressing',
        price: 7,
        remove: ['Nachos', 'Cheddar cheese', 'Olives', 'Sweet corn', 'Carrot', 'Special dressing'],
      },
      {
        id: 'chicken-caesar-salad',
        name: 'Chicken Caesar Salad',
        description: 'Grilled chicken, iceberg, croutons, parmesan with caesar dressing',
        price: 7.5,
        remove: ['Croutons', 'Parmesan', 'Caesar dressing'],
      },
      {
        id: 'goat-cheese-salad',
        name: 'Goat Cheese Salad',
        description: 'Goat cheese, iceberg, rocca, almonds, dried cranberry, strawberry, with balsamic sauce',
        price: 8,
        remove: ['Rocca', 'Almonds', 'Dried cranberry', 'Strawberry', 'Balsamic sauce'],
      },
      {
        id: 'pop-chicken-salad',
        name: 'The Pop Chicken Salad',
        description: 'Grilled chicken, iceberg, cherry tomato, carrot, sweet corn, chips sticks, with our special dressing',
        price: 8.5,
        remove: ['Cherry tomato', 'Carrot', 'Sweet corn', 'Chips sticks', 'Special dressing'],
      },
    ].map((item) => ({ ...item, groups: saladOptions })),
  },
  {
    id: 'chicken-sandwiches',
    name: 'Chicken Sandwiches',
    tone: 'red',
    items: [
      {
        id: 'bbq-boneless-chicken-wrap',
        name: 'BBQ Boneless Chicken Wrap',
        description: 'Tortilla wrap, with deep-fried breaded chicken breast, iceberg, chips sticks, melted cheddar, pickles, ranch and bbq sauce',
        price: 7,
        remove: ['Iceberg', 'Chips sticks', 'Melted cheddar', 'Pickles', 'Ranch sauce', 'BBQ sauce'],
      },
      {
        id: 'chicken-tandoori',
        name: 'Chicken Tandoori',
        description: 'Submarine bun, grilled chicken, mozzarella cheese, iceberg, pickles, and special tandoori sauce',
        price: 7.5,
        remove: ['Mozzarella cheese', 'Iceberg', 'Pickles', 'Tandoori sauce'],
      },
      {
        id: 'the-fajita',
        name: 'The Fajita',
        description: 'Submarine bun, grilled chicken, mozzarella cheese, onions, green bell pepper, and cocktail sauce',
        price: 7.5,
        remove: ['Mozzarella cheese', 'Onions', 'Green bell pepper', 'Cocktail sauce'],
      },
    ],
  },
  {
    id: 'offers',
    name: 'Meals & Offers',
    tone: 'teal',
    items: [], // filled below so the offers can reference other items
  },
  {
    id: 'drinks',
    name: 'Drinks',
    tone: 'red',
    items: [
      { id: 'water', name: 'Water', price: 0.5 },
      { id: 'sparkling-water', name: 'Sparkling Water', price: 1.5 },
      { id: 'soft-drink', name: 'Soft Drink', price: 1.5 },
      { id: 'beer', name: 'Beer', price: 2 },
      { id: 'juice', name: 'Juice', price: 1 },
    ],
  },
]

const byCategory = (id) => categories.find((c) => c.id === id).items
const asChoice = (item) => ({ id: item.id, label: item.name })

// "Any sub or burger": beef subs, the two chicken subs and every burger.
const subsAndBurgers = [
  ...byCategory('beef-subs'),
  ...byCategory('chicken-sandwiches').filter((i) => i.id !== 'bbq-boneless-chicken-wrap'),
  ...byCategory('burgers'),
  ...byCategory('chicken-burger'),
].map(asChoice)

// "Sandwich or burger": everything in the sandwich, sub and burger sections.
const sandwichesAndBurgers = [
  ...byCategory('beef-subs'),
  ...byCategory('chicken-sandwiches'),
  ...byCategory('burgers'),
  ...byCategory('chicken-burger'),
].map(asChoice)

categories.find((c) => c.id === 'offers').items = [
  {
    id: 'combo-meal',
    name: 'Combo Meal',
    description: 'Any sub or burger + fries, 2 tenders and soft drink',
    price: 11.5,
    featured: true,
    groups: [{ id: 'main', label: 'Choose your sub or burger', type: 'single', options: subsAndBurgers }],
  },
  {
    id: 'full-meal-offer',
    name: 'Full Meal Offer',
    description: '1 half portion salad + 1 sandwich or burger + fries + soft drink',
    price: 14.5,
    featured: true,
    groups: [
      { id: 'salad', label: 'Choose your half portion salad', type: 'single', options: byCategory('salads').map(asChoice) },
      { id: 'main', label: 'Choose your sandwich or burger', type: 'single', options: sandwichesAndBurgers },
    ],
  },
  {
    id: 'little-jungs',
    name: 'Little Jungs',
    portion: 'Kids meal',
    description: '1 classic burger + 1 chicken strips + fries + juice + gift',
    price: 9,
    featured: true,
  },
]

export const allItems = categories.flatMap((c) => c.items.map((item) => ({ ...item, categoryId: c.id, tone: c.tone })))

export const findItem = (id) => allItems.find((i) => i.id === id)

export const featuredItems = allItems.filter((i) => i.featured)
