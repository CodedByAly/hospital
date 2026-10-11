/*
 * Menu transcribed from the restaurant's current ordering site
 * (burger-bar-alpha.vercel.app, screenshots supplied by the restaurant).
 *
 * Item fields
 *   id           unique, used in the cart — don't change once live
 *   name         as written on the menu
 *   price        USD. null = not readable in the screenshots; the item shows
 *                "Ask for price" and can't be added until a price is set
 *   description  as written on the menu ('' when it has none)
 *   image        file in /public/images/menu, or null (no photo shown)
 *   removable    ingredients the customer may ask to leave out (free)
 *   options      single-choice groups: { id, label, required, choices: [{ id, label, price }] }
 *   addons       optional extras: [{ id, label, price }]
 *   review       note for whoever maintains the menu. Not shown on the site.
 *
 * Photos come from the restaurant's Instagram posts of the same item.
 */

const img = (name) => `/images/menu/${name}.webp`;

export const categories = [
  { id: 'burgers', name: 'Burgers' },
  { id: 'sandwiches', name: 'Sandwiches' },
  { id: 'plates', name: 'Plates' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'salads', name: 'Salads' },
  { id: 'drinks', name: 'Drinks' },
];

const flavours = ['BBQ', 'Buffalo', 'Honey Mustard', 'Mix', 'Regular'];

const items = [
  // Burgers
  { id: 'bbq-burger', category: 'burgers', name: 'BBQ Burger', price: 6.5 },
  { id: 'beef-bacon-burger', category: 'burgers', name: 'Beef Bacon Burger', price: 7.5, image: img('beef-bacon-burger') },
  { id: 'chicken-burger', category: 'burgers', name: 'Chicken Burger', price: 5 },
  { id: 'classic-burger', category: 'burgers', name: 'Classic Burger', price: 6.5, image: img('classic-burger') },
  { id: 'crispy-burger', category: 'burgers', name: 'Crispy burger', price: 6, image: img('crispy-burger') },
  { id: 'double-bar-burger', category: 'burgers', name: 'Double Bar Burger', price: 9 },
  { id: 'double-mozzarella-burger', category: 'burgers', name: 'Double Mozzarella Burger', price: 11 },
  { id: 'egg-burger', category: 'burgers', name: 'Egg Burger', price: 7.5 },
  { id: 'lebanese-burger', category: 'burgers', name: 'Lebanese Burger', price: 6 },
  { id: 'mozzarella-burger', category: 'burgers', name: 'Mozzarella Burger', price: 8.5, image: img('mozzarella-burger') },
  { id: 'pepperoni-burger', category: 'burgers', name: 'Pepperoni Burger', price: 7.5 },
  { id: 'swiss-mushrooms', category: 'burgers', name: 'Swiss & Mushrooms', price: 7, image: img('swiss-mushrooms') },
  { id: 'zinger-burger', category: 'burgers', name: 'Zinger Burger', price: 6.5 },

  // Sandwiches
  { id: 'cheese-tawook', category: 'sandwiches', name: 'Cheese Tawook', price: 6 },
  { id: 'chicken-sub', category: 'sandwiches', name: 'Chicken Sub', price: 6 },
  { id: 'crispy', category: 'sandwiches', name: 'Crispy', price: 4.5 },
  {
    id: 'djej-3al-fa7m', category: 'sandwiches', name: 'djej 3al fa7m', price: 6, description: 'Grilled chicken sandwich.',
    review: 'Price partly hidden behind the cart button in the screenshot; reads as $6.00. Please confirm.',
  },
  { id: 'escalope', category: 'sandwiches', name: 'Escalope', price: 6 },
  { id: 'fahita', category: 'sandwiches', name: 'Fahita', price: 6 },
  { id: 'fransisco', category: 'sandwiches', name: 'Fransisco', price: 6 },
  { id: 'fries-sandwich', category: 'sandwiches', name: 'Fries Sandwich', price: 3 },
  { id: 'kusra', category: 'sandwiches', name: 'Kusra', price: 7 },
  { id: 'pepperoni-classic-wrap', category: 'sandwiches', name: 'Pepperoni Classic (Wrap)', price: 7 },
  {
    id: 'philadelphia', category: 'sandwiches', name: 'Philadelphia', price: null,
    review: 'Price hidden behind the cart button in the screenshot (starts with $7). Set the price to make it orderable. Items between Philadelphia and Stivo (Wrap) may be missing.',
  },
  { id: 'stivo-wrap', category: 'sandwiches', name: 'Stivo (Wrap)', price: 7 },
  { id: 'stivo-swiss', category: 'sandwiches', name: 'Stivo Swiss', price: 10, image: img('stivo-swiss') },
  { id: 'supreme', category: 'sandwiches', name: 'Supreme', price: 6 },
  { id: 'tawook', category: 'sandwiches', name: 'Tawook', price: 5 },
  { id: 'twister-wrap', category: 'sandwiches', name: 'Twister (Wrap)', price: 6 },

  // Plates
  { id: 'half-farouj-fa7m', category: 'plates', name: '1/2 farouj fa7m', price: 9, description: 'Half grilled chicken.' },
  { id: 'chicken-alfredo', category: 'plates', name: 'Chicken Alfredo', price: 10 },
  { id: 'crispy-plate', category: 'plates', name: 'Crispy Plate', price: 10 },
  { id: 'escalope-plate', category: 'plates', name: 'Escalope Plate', price: 10 },
  { id: 'farouj-fa7m', category: 'plates', name: 'farouj fa7m', price: 16, description: 'Whole grilled chicken.' },
  { id: 'farouj-fa7m-plate', category: 'plates', name: 'farouj fa7m plate', price: 9, description: 'Grilled chicken plate.' },
  { id: 'philadelphia-plate', category: 'plates', name: 'Philadelphia Plate', price: 12 },
  { id: 'shrimp-alfredo', category: 'plates', name: 'Shrimp Alfredo', price: 11 },
  { id: 'tawook-plate', category: 'plates', name: 'Tawook Plate', price: 8, image: img('tawook-plate') },
  { id: 'zinger-plate', category: 'plates', name: 'Zinger', price: 10 },

  // Appetizers
  { id: 'cheese-chicken-fries', category: 'appetizers', name: 'Cheese Chicken Fries', price: 6 },
  {
    id: 'chicken-wings', category: 'appetizers', name: 'Chicken Wings', price: 5,
    description: '10 pcs (BBQ, Buffalo, Honey Mustard, mix & Regular)',
    options: [
      {
        id: 'flavour', label: 'Choose your flavour', required: true,
        choices: flavours.map((f) => ({ id: f.toLowerCase().replace(/\s+/g, '-'), label: f, price: 0 })),
      },
    ],
  },
  { id: 'combo-meal', category: 'appetizers', name: 'Combo Meal', price: 16, description: '2 Crispy, 2 Escalope, 12 wings, 4 Mozzarella, Fries, 2 small Drink' },
  { id: 'fries-bag', category: 'appetizers', name: 'Fries Bag', price: 5 },
  { id: 'fries-box', category: 'appetizers', name: 'Fries Box', price: 2 },
  { id: 'fries-medium', category: 'appetizers', name: 'Fries Medium', price: 4 },
  { id: 'mozzarella-sticks', category: 'appetizers', name: 'Mozzarella Sticks 8 pcs', price: 5 },

  // Salads
  { id: 'chicken-caesar-salad', category: 'salads', name: 'Chicken Ceasar Salad', price: 7 },
  { id: 'crab-salad', category: 'salads', name: 'Crab Salad', price: 7 },
  { id: 'pasta-tuna-salad', category: 'salads', name: 'Pasta Tuna Salad', price: 5 },
  { id: 'tuna-salad', category: 'salads', name: 'Tuna Salad', price: 6 },

  // Drinks
  { id: 'ayran', category: 'drinks', name: 'Ayran', price: 1 },
  { id: 'soft-drink-180', category: 'drinks', name: 'Soft Drink 180 ML', price: 0.5 },
  { id: 'soft-drink-350', category: 'drinks', name: 'Soft Drink 350 ml', price: 1 },
  { id: 'sparkling-water', category: 'drinks', name: 'Sparkling Water', price: 1 },
  { id: 'water-small', category: 'drinks', name: 'Water Small', price: 0.5 },
];

export const menuItems = items.map((item) => ({
  description: '',
  image: null,
  removable: [],
  options: [],
  addons: [],
  ...item,
}));

const byId = new Map(menuItems.map((item) => [item.id, item]));
export const getItem = (id) => byId.get(id);
export const isOrderable = (item) => item.price != null;

export const itemsByCategory = categories.map((category) => ({
  ...category,
  items: menuItems.filter((item) => item.category === category.id),
}));
