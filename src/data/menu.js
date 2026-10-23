/**
 * Moods Burger menu, transcribed from the restaurant's printed menu.
 *
 * Prices are in US dollars. Option prices are added to the item's base price,
 * so e.g. The Smasher: 9$ double, 11$ triple, 13$ double combo, 15$ triple combo.
 *
 * Option group types:
 *   single  – pick exactly one (radio). Set `required` to force a choice.
 *   multi   – pick any (checkbox add-ons).
 *   remove  – ingredients the customer can leave out (free).
 *
 * Mark a single-choice group `listed: true` to print its price variations
 * under the item in the menu list. An option with `plain: true` is the
 * default and is left out of those variation labels.
 */

const sauces = [
  { id: 'ranch', name: 'Ranch' },
  { id: 'honey-mustard', name: 'Honey mustard' },
  { id: 'cocktail', name: 'Cocktail' },
]

const sauceChoice = {
  id: 'sauce',
  type: 'single',
  required: true,
  name: 'Choose your homemade sauce',
  options: sauces,
}

const combo = {
  id: 'meal',
  type: 'single',
  required: true,
  listed: true,
  name: 'Make it a combo',
  options: [
    { id: 'sandwich', name: 'Burger only', plain: true },
    { id: 'combo', name: 'Combo', price: 4 },
  ],
}

const burgerExtras = {
  id: 'extras',
  type: 'multi',
  name: 'Extras',
  options: [
    { id: 'extra-cheese', name: 'Extra cheese', price: 1 },
    { id: 'extra-sauce', name: 'Extra sauce', price: 0.5 },
  ],
}

const removable = (...items) => ({
  id: 'remove',
  type: 'remove',
  name: 'Leave anything out?',
  options: items.map(([id, name]) => ({ id, name })),
})

export const categories = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    note: 'Homemade sauces: Ranch, Honey mustard, Cocktail',
  },
  {
    id: 'burgers',
    name: 'Burgers',
    note: 'Extra cheese 1$  ·  Extra sauce 0.5$',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    by: 'Caketime',
  },
  {
    id: 'drinks',
    name: 'Drinks',
  },
]

export const menuItems = [
  // Appetizers
  {
    id: 'mozzarella-sticks',
    category: 'appetizers',
    name: 'Mozzarella Sticks (4 pcs)',
    description: 'Fresh mozzarella cheese fried to perfection, served with your choice of our homemade sauces',
    price: 6,
    image: '/images/mozzarella-sticks.webp',
    groups: [sauceChoice],
  },
  {
    id: 'onion-rings',
    category: 'appetizers',
    name: 'Onion Rings (8 pcs)',
    description: 'Fresh fried hand cut onions, served with your choice of our homemade sauces',
    price: 6,
    groups: [sauceChoice],
  },
  {
    id: 'wings',
    category: 'appetizers',
    name: 'Wings / Boneless (6 or 9 pcs)',
    description: 'Choose from Buffalo, BBQ or honey mustard, dipped or on the side. Served with ranch, cocktail or honey mustard',
    price: 7,
    image: '/images/wings.webp',
    groups: [
      {
        id: 'cut',
        type: 'single',
        required: true,
        name: 'Wings or boneless',
        options: [
          { id: 'wings', name: 'Wings' },
          { id: 'boneless', name: 'Boneless' },
        ],
      },
      {
        id: 'size',
        type: 'single',
        required: true,
        listed: true,
        name: 'How many pieces',
        options: [
          { id: '6', name: '6 pcs', plain: true },
          { id: '9', name: '9 pcs', price: 3 },
        ],
      },
      {
        id: 'flavour',
        type: 'single',
        required: true,
        name: 'Flavour',
        options: [
          { id: 'buffalo', name: 'Buffalo' },
          { id: 'bbq', name: 'BBQ' },
          { id: 'honey-mustard', name: 'Honey mustard' },
        ],
      },
      {
        id: 'style',
        type: 'single',
        required: true,
        name: 'Sauce on the wings',
        options: [
          { id: 'dipped', name: 'Dipped' },
          { id: 'side', name: 'On the side' },
        ],
      },
      {
        id: 'dip',
        type: 'single',
        required: true,
        name: 'Served with',
        options: [
          { id: 'ranch', name: 'Ranch' },
          { id: 'cocktail', name: 'Cocktail' },
          { id: 'honey-mustard', name: 'Honey mustard' },
        ],
      },
    ],
  },
  {
    id: 'house-fries',
    category: 'appetizers',
    name: 'House Fries',
    description: 'Seasoned with MOODS spices and served with cocktail sauce',
    price: 4,
  },
  {
    id: 'caesar-salad',
    category: 'appetizers',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce, croutons, parmesan, Caesar dressing',
    price: 6,
    groups: [
      {
        id: 'add',
        type: 'multi',
        name: 'Add',
        options: [{ id: 'chicken', name: 'Add chicken', price: 3 }],
      },
      removable(['croutons', 'Croutons'], ['parmesan', 'Parmesan']),
    ],
  },

  // Burgers
  {
    id: 'the-smasher',
    category: 'burgers',
    name: 'The Smasher',
    description: '2x smashed beef, cheddar cheese, pickles, onions and our special sauce',
    price: 9,
    image: '/images/the-smasher.webp',
    imageStyle: 'studio',
    featured: true,
    groups: [
      {
        id: 'patty',
        type: 'single',
        required: true,
        listed: true,
        name: 'Patties',
        options: [
          { id: 'double', name: 'Double patty', plain: true },
          { id: 'triple', name: 'Triple patty', price: 2 },
        ],
      },
      combo,
      burgerExtras,
      removable(
        ['cheddar', 'Cheddar cheese'],
        ['pickles', 'Pickles'],
        ['onions', 'Onions'],
        ['special-sauce', 'Special sauce'],
      ),
    ],
  },
  {
    id: 'swiss-shroom',
    category: 'burgers',
    name: 'Swiss Shroom',
    description: 'Beef patty, swiss cheese, sautéed mushrooms, onion, mayo',
    price: 9,
    image: '/images/swiss-shroom.webp',
    imageStyle: 'studio',
    featured: true,
    groups: [
      combo,
      burgerExtras,
      removable(
        ['swiss', 'Swiss cheese'],
        ['mushrooms', 'Mushrooms'],
        ['onion', 'Onion'],
        ['mayo', 'Mayo'],
      ),
    ],
  },
  {
    id: 'grilled-chick',
    category: 'burgers',
    name: 'Grilled Chick',
    description: 'Grilled chicken, iceberg lettuce, tomato, red onions and mayo',
    price: 8,
    image: '/images/grilled-chick.webp',
    featured: true,
    groups: [
      combo,
      burgerExtras,
      removable(
        ['lettuce', 'Iceberg lettuce'],
        ['tomato', 'Tomato'],
        ['red-onions', 'Red onions'],
        ['mayo', 'Mayo'],
      ),
    ],
  },
  {
    id: 'fried-chick',
    category: 'burgers',
    name: 'Fried Chick',
    description: 'Crispy chicken breast, pickles, shredded lettuce, special sauce',
    price: 8,
    image: '/images/fried-chick.webp',
    imageStyle: 'studio',
    featured: true,
    groups: [
      combo,
      burgerExtras,
      removable(
        ['pickles', 'Pickles'],
        ['lettuce', 'Shredded lettuce'],
        ['special-sauce', 'Special sauce'],
      ),
    ],
  },

  // Desserts by Caketime
  {
    id: 'cookie',
    category: 'desserts',
    name: 'Cookie (1 pc)',
    price: 3,
  },
  {
    id: 'smores',
    category: 'desserts',
    name: 'S’mores (2 pcs)',
    description: 'Butter biscuit, flamed marshmallow, chocolate spread',
    price: 4,
  },
  {
    id: 'burger-cupcake',
    category: 'desserts',
    name: 'Burger Cupcake',
    description: 'Upside down cupcake',
    price: 3.5,
  },

  // Drinks
  {
    id: 'pepsi',
    category: 'drinks',
    name: 'Pepsi / Diet',
    price: 1.2,
    groups: [
      {
        id: 'type',
        type: 'single',
        required: true,
        name: 'Regular or diet',
        options: [
          { id: 'regular', name: 'Pepsi' },
          { id: 'diet', name: 'Diet Pepsi' },
        ],
      },
    ],
  },
  { id: 'mirinda', category: 'drinks', name: 'Miranda', price: 1.2 },
  {
    id: '7up',
    category: 'drinks',
    name: '7Up / Diet',
    price: 1.2,
    groups: [
      {
        id: 'type',
        type: 'single',
        required: true,
        name: 'Regular or diet',
        options: [
          { id: 'regular', name: '7Up' },
          { id: 'diet', name: 'Diet 7Up' },
        ],
      },
    ],
  },
  { id: 'iced-tea', category: 'drinks', name: 'Iced Tea', price: 1.5 },
  { id: 'water', category: 'drinks', name: 'Water', price: 0.6 },
]

/** "Order the full menu for 65$ — excluding combos and drinks." */
export const fullMenuOffer = {
  id: 'full-menu',
  category: 'offer',
  name: 'The Full Menu',
  description: 'Everything on our menu, excluding combos and drinks.',
  price: 65,
}

const allItems = [...menuItems, fullMenuOffer]

export const getItem = (id) => allItems.find((item) => item.id === id)
