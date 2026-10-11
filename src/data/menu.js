/*
 * Menu transcribed from zahersdiner.com (screenshots supplied by the restaurant).
 *
 * Item fields
 *   id           unique, used in URLs and the cart — don't change once live
 *   name         as written on the menu
 *   price        USD
 *   description  as written on the menu (empty string when the menu has none)
 *   pieces       portion note shown on the menu, e.g. '5 pieces'
 *   image        file in /public/images/menu, or null for the placeholder
 *   removable    ingredients the customer may ask to leave out (free)
 *   options      single-choice groups: { id, label, required, choices: [{ id, label, price }] }
 *                `price` is added to the item price (use 0 for no change)
 *   addons       optional extras: [{ id, label, price }]
 *   review       note for whoever maintains the menu — something in the
 *                source screenshot was unclear. Not shown on the site.
 *
 * No options or add-ons were listed on the restaurant's menu, so none are set.
 */

const img = (name) => `/images/menu/${name}.webp`;

export const categories = [
  { id: 'starters', name: 'Starters' },
  { id: 'salads', name: 'Salads' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'chicken-sandwiches', name: 'Chicken Sandwiches' },
  { id: 'beef-sandwiches', name: 'Beef Sandwiches' },
  { id: 'tortillas', name: 'Tortillas' },
  { id: 'mashawi', name: 'Mashawi' },
  { id: 'platters', name: 'Platters' },
  { id: 'drinks', name: 'Drinks' },
];

const items = [
  // Starters
  { id: 'bbq-chicken-strips', category: 'starters', name: 'BBQ Chicken Strips', price: 8.5, pieces: '5 pieces', description: '', image: img('bbq-chicken-strips') },
  { id: 'bbq-chicken-wings', category: 'starters', name: 'BBQ Chicken Wings', price: 8.5, pieces: '10 pieces', description: '', image: img('bbq-chicken-wings') },
  { id: 'buffalo-chicken-strips', category: 'starters', name: 'Buffalo Chicken Strips', price: 8.5, pieces: '5 pieces', description: '', image: img('bbq-chicken-strips') },
  { id: 'buffalo-chicken-wings', category: 'starters', name: 'Buffalo Chicken Wings', price: 8.5, pieces: '10 pieces', description: '', image: null },
  { id: 'cheesy-fries', category: 'starters', name: 'Cheesy Fries', price: 6, description: '', image: null },
  { id: 'curly-fries', category: 'starters', name: 'Curly Fries', price: 5.5, description: '', image: img('curly-fries') },
  { id: 'fries', category: 'starters', name: 'Fries', price: 3, description: '', image: img('fries') },
  { id: 'honey-mustard-strips', category: 'starters', name: 'Honey Mustard Strips', price: 8, pieces: '5 pieces', description: '', image: img('bbq-chicken-strips') },
  { id: 'honey-mustard-wings', category: 'starters', name: 'Honey Mustard Wings', price: 8, pieces: '10 pieces', description: '', image: img('honey-mustard-wings') },
  { id: 'mixed-chicken-wings', category: 'starters', name: 'Mixed Chicken Wings', price: 8, pieces: '10 pieces', description: '', image: null },
  { id: 'mozzarella-sticks', category: 'starters', name: 'Mozzarella Sticks', price: 5.5, pieces: '5 pieces', description: '', image: img('mozzarella-sticks') },
  { id: 'nachos', category: 'starters', name: 'Nachos', price: 6, pieces: '5 pieces', description: '', image: null },
  { id: 'onion-rings', category: 'starters', name: 'Onion Rings', price: 4.5, description: '', image: img('onion-rings') },

  // Salads
  { id: 'fattoush', category: 'salads', name: 'Fattoush', price: 5.5, description: '', image: null },
  { id: 'tabbouleh', category: 'salads', name: 'Tabbouleh', price: 5.5, description: '', image: null },

  // Burgers
  {
    id: 'american-burger', category: 'burgers', name: 'American Burger', price: 9, image: img('american-burger'),
    description: 'Beef, fried onion rings, beef bacon, cheddar cheese, honey mustard sauce.',
    removable: ['Fried onion rings', 'Beef bacon', 'Cheddar cheese', 'Honey mustard sauce'],
  },
  {
    id: 'bbq-burger', category: 'burgers', name: 'BBQ Burger', price: 9, image: img('bbq-burger'),
    description: 'Beef, beef bacon, caramelized onions, cheddar cheese, Doritos chips, BBQ sauce.',
    removable: ['Beef bacon', 'Caramelized onions', 'Cheddar cheese', 'Doritos chips', 'BBQ sauce'],
  },
  {
    id: 'bbq-chicken-burger', category: 'burgers', name: 'BBQ Chicken Burger', price: 8.5, image: img('bbq-chicken-burger'),
    description: 'Fried chicken, coleslaw, pickles, BBQ sauce, mayo and honey mustard sauce.',
    removable: ['Coleslaw', 'Pickles', 'BBQ sauce', 'Mayo', 'Honey mustard sauce'],
  },
  {
    id: 'cheese-burger', category: 'burgers', name: 'Cheese Burger', price: 7.5, image: img('cheese-burger'),
    description: 'Beef, iceberg lettuce, pickles, cheddar cheese, classic sauce.',
    removable: ['Iceberg lettuce', 'Pickles', 'Cheddar cheese', 'Classic sauce'],
  },
  {
    id: 'chicken-attack-burger', category: 'burgers', name: 'Chicken Attack Burger', price: 8.5, image: img('chicken-attack-burger'),
    description: 'Grilled chicken, iceberg, grilled tomatoes, bacon, mayo, honey mustard, sweet pickles.',
    removable: ['Iceberg', 'Grilled tomatoes', 'Bacon', 'Mayo', 'Honey mustard', 'Sweet pickles'],
  },
  {
    id: 'chicken-avocado-burger', category: 'burgers', name: 'Chicken Avocado Burger', price: 9, image: img('chicken-avocado-burger'),
    description: 'Grilled chicken, avocado, rocca, cheddar cheese and Mexican sauce.',
    removable: ['Avocado', 'Rocca', 'Cheddar cheese', 'Mexican sauce'],
  },
  {
    id: 'classic-burger', category: 'burgers', name: 'Classic Burger', price: 8, image: img('classic-burger'),
    description: 'Beef, iceberg lettuce, tomatoes, onions, pickles, cheddar cheese and classic sauce.',
    removable: ['Iceberg lettuce', 'Tomatoes', 'Onions', 'Pickles', 'Cheddar cheese', 'Classic sauce'],
  },
  {
    id: 'crunchy-zinger', category: 'burgers', name: 'Crunchy Zinger', price: 7.9, image: img('crunchy-zinger'),
    description: 'Fried chicken, iceberg lettuce, pickles, Doritos chips, cheddar cheese and zinger sauce.',
    removable: ['Iceberg lettuce', 'Pickles', 'Doritos chips', 'Cheddar cheese', 'Zinger sauce'],
  },
  {
    id: 'crunchy-zinger-spicy', category: 'burgers', name: 'Crunchy Zinger Spicy', price: 7.9, image: null,
    description: 'Spicy fried chicken, iceberg lettuce, pickles, Doritos chips.',
    removable: ['Iceberg lettuce', 'Pickles', 'Doritos chips'],
    review: 'Description is cut off at the bottom of the screenshot after "Doritos chips," — confirm the rest (and the photo).',
  },
  {
    id: 'double-burger', category: 'burgers', name: 'Double Burger', price: 15.5, image: img('double-burger'),
    description: 'Double beef, beef bacon, caramelized onion, cheddar cheese, special sauce.',
    removable: ['Beef bacon', 'Caramelized onion', 'Cheddar cheese', 'Special sauce'],
  },
  {
    id: 'honey-crunch-burger', category: 'burgers', name: 'Honey Crunch Burger', price: 8.5, image: null,
    description: 'Fried chicken, iceberg, dill pickles, honey mustard, potato sticks chips.',
    removable: ['Iceberg', 'Dill pickles', 'Honey mustard', 'Potato sticks chips'],
  },
  {
    id: 'hunger-crunchy-burger', category: 'burgers', name: 'Hunger Crunchy Burger', price: 9.5, image: null,
    description: 'Fried chicken, iceberg, sweet pickles, BBQ patty, mozzarella, mayo, honey mustard.',
    removable: ['Iceberg', 'Sweet pickles', 'Mozzarella', 'Mayo', 'Honey mustard'],
  },
  {
    id: 'mexican-burger', category: 'burgers', name: 'Mexican Burger', price: 9.5, image: null,
    description: 'Beef, jalapeno, cheddar cheese, Doritos chips, Mexican sauce, onion, tomato and avocado slices.',
    removable: ['Jalapeno', 'Cheddar cheese', 'Doritos chips', 'Mexican sauce', 'Onion', 'Tomato', 'Avocado slices'],
  },
  {
    id: 'patty-mozzarella-burger', category: 'burgers', name: 'Patty Mozzarella Burger', price: 9.5, image: img('patty-mozzarella-burger'),
    description: 'Beef, fried mozzarella cheese, cheddar cheese, iceberg lettuce, pickles, tomatoes, classic sauce.',
    removable: ['Cheddar cheese', 'Iceberg lettuce', 'Pickles', 'Tomatoes', 'Classic sauce'],
  },
  {
    id: 'spicy-chicken-burger', category: 'burgers', name: 'Spicy Chicken Burger', price: 9, image: img('spicy-chicken-burger'),
    description: 'Fried chicken, coleslaw, pickles, cheddar cheese, spicy sauce.',
    removable: ['Coleslaw', 'Pickles', 'Cheddar cheese', 'Spicy sauce'],
  },
  {
    id: 'swiss-mushroom-burger', category: 'burgers', name: 'Swiss Mushroom Burger', price: 9.5, image: null,
    description: 'Beef, Swiss cheese, mushroom, caramelized onion and mayo BBQ sauce.',
    removable: ['Swiss cheese', 'Mushroom', 'Caramelized onion', 'Mayo BBQ sauce'],
  },
  {
    id: 'truffle-burger', category: 'burgers', name: 'Truffle Burger', price: 9.5, image: img('truffle-burger'),
    description: 'Beef, baby rocca, mushrooms, caramelized onion, truffle sauce, emmental cheese.',
    removable: ['Baby rocca', 'Mushrooms', 'Caramelized onion', 'Truffle sauce', 'Emmental cheese'],
  },

  // Chicken sandwiches
  {
    id: 'chicken-sub', category: 'chicken-sandwiches', name: 'Chicken Sub', price: 7.9, image: img('chicken-sub'),
    description: 'Grilled chicken, lettuce, corn, pickles, mozzarella cheese, garlic mayo.',
    removable: ['Lettuce', 'Corn', 'Pickles', 'Mozzarella cheese', 'Garlic mayo'],
  },
  {
    id: 'fajita', category: 'chicken-sandwiches', name: 'Fajita', price: 7.5, image: img('fajita'),
    description: 'Grilled chicken, bell peppers, onions, mushrooms, mozzarella cheese, mayo and avocado sauce.',
    removable: ['Bell peppers', 'Onions', 'Mushrooms', 'Mozzarella cheese', 'Mayo', 'Avocado sauce'],
  },
  {
    id: 'zahers', category: 'chicken-sandwiches', name: "Zaher's", price: 7.5, image: img('zahers-sandwich'),
    description: 'Spicy grilled chicken, lettuce, mushrooms, corn, pickles and mayonnaise.',
    removable: ['Lettuce', 'Mushrooms', 'Corn', 'Pickles', 'Mayonnaise'],
  },
  {
    id: 'zinger-sandwich', category: 'chicken-sandwiches', name: 'Zinger Sandwich', price: 8, image: img('zinger-sandwich'),
    description: 'Fried chicken, iceberg lettuce, pickles, zinger sauce, avocado sauce, tomato and mayo.',
    removable: ['Iceberg lettuce', 'Pickles', 'Zinger sauce', 'Avocado sauce', 'Tomato', 'Mayo'],
  },
  {
    id: 'zinger-spicy-sandwich', category: 'chicken-sandwiches', name: 'Zinger Spicy Sandwich', price: 8, image: img('zinger-sandwich'),
    description: 'Fried chicken, iceberg lettuce, pickles, zinger sauce, avocado sauce, tomato and mayo.',
    removable: ['Iceberg lettuce', 'Pickles', 'Zinger sauce', 'Avocado sauce', 'Tomato', 'Mayo'],
    review: 'Price shows as "L8 $" on the current site; entered as 8. Please confirm.',
  },
  {
    id: 'zinger-supreme', category: 'chicken-sandwiches', name: 'Zinger Supreme', price: 9, image: img('zinger-supreme'),
    description: 'Fried chicken, turkey slice, cheddar cheese, iceberg lettuce, pickles, zinger sauce, avocado sauce and tomatoes and mayo.',
    removable: ['Turkey slice', 'Cheddar cheese', 'Iceberg lettuce', 'Pickles', 'Zinger sauce', 'Avocado sauce', 'Tomatoes', 'Mayo'],
  },

  // Beef sandwiches
  {
    id: 'philadelphia', category: 'beef-sandwiches', name: 'Philadelphia', price: 11, image: img('philadelphia'),
    description: 'Beef, peppers, onions, mushrooms, mozzarella cheese, avocado sauce and mayonnaise.',
    removable: ['Peppers', 'Onions', 'Mushrooms', 'Mozzarella cheese', 'Avocado sauce', 'Mayonnaise'],
  },
  {
    id: 'real-steak', category: 'beef-sandwiches', name: 'Real Steak', price: 11, image: img('real-steak'),
    description: 'Beef, onions, mushrooms, mayo, Swiss cheese and HP sauce.',
    removable: ['Onions', 'Mushrooms', 'Mayo', 'Swiss cheese', 'HP sauce'],
  },
  {
    id: 'truffle-steak', category: 'beef-sandwiches', name: 'Truffle Steak', price: 12.2, image: null,
    description: 'Beef, Emmental cheese, mushrooms, onion, baby rocca and mayo-truffle sauce.',
    removable: ['Emmental cheese', 'Mushrooms', 'Onion', 'Baby rocca', 'Mayo-truffle sauce'],
  },

  // Tortillas
  {
    id: 'twister', category: 'tortillas', name: 'Twister', price: 7.5, image: img('twister'),
    description: 'Crispy chicken, crisp lettuce, fresh tomatoes.',
    removable: ['Lettuce', 'Tomatoes'],
    review: 'Description is cut off in the screenshot after "fresh tomatoes and our" — confirm the ending (probably the twister sauce, as on Twister Spicy). Photo is the Twister Spicy one.',
  },
  {
    id: 'twister-spicy', category: 'tortillas', name: 'Twister Spicy', price: 7.5, image: img('twister'),
    description: 'Crispy chicken, crisp lettuce, fresh tomatoes and our signature twister sauce.',
    removable: ['Lettuce', 'Tomatoes', 'Twister sauce'],
  },

  // Mashawi (charcoal grill)
  {
    id: 'chicken-half', category: 'mashawi', name: 'Chicken - Half', price: 9, image: null,
    description: 'Nos farooj al fahem, fries, toom har, toom, kabis.',
    removable: ['Toom har', 'Toom', 'Kabis'],
  },
  {
    id: 'chicken-whole', category: 'mashawi', name: 'Chicken - Whole', price: 16, image: null,
    description: 'Farooj al fahem, fries, toom har, toom, kabis.',
    removable: ['Toom har', 'Toom', 'Kabis'],
  },
  {
    id: 'mashawi-chicken-sandwich', category: 'mashawi', name: 'Chicken Sandwich', price: 5.5, image: null,
    description: 'Djej al fahem, toom, kabis, toom har.',
    removable: ['Toom', 'Kabis', 'Toom har'],
  },

  // Platters
  { id: 'crispy-3', category: 'platters', name: 'Crispy (3pcs)', price: 8, image: img('crispy-platter'), description: 'Fried chicken, coleslaw, bun, fries, cocktail sauce, 1 garlic sauce and Pepsi bottle.' },
  { id: 'crispy-5', category: 'platters', name: 'Crispy (5pcs)', price: 12, image: img('crispy-platter'), description: 'Fried chicken, coleslaw, bun, fries, 1 cocktail sauce, 1 garlic sauce and Pepsi bottle.' },
  { id: 'crispy-spicy-3', category: 'platters', name: 'Crispy Spicy (3pcs)', price: 8, image: img('crispy-platter'), description: 'Fried chicken, coleslaw, bun, fries, cocktail sauce, 1 garlic sauce and Pepsi bottle.' },
  { id: 'crispy-spicy-5', category: 'platters', name: 'Crispy Spicy (5pcs)', price: 12, image: img('crispy-platter'), description: 'Fried chicken, coleslaw, bun, fries, 1 cocktail sauce, 1 garlic sauce and Pepsi bottle.' },

  // Drinks
  { id: 'iced-tea', category: 'drinks', name: 'Iced Tea', price: 1.7, description: '', image: null },
  { id: 'rim-sparkling-water', category: 'drinks', name: 'Rim Sparkling Water', price: 2.6, description: '', image: null },
  { id: 'soft-drink', category: 'drinks', name: 'Soft Drink', price: 1.35, description: '', image: null },
  { id: 'water', category: 'drinks', name: 'Water', price: 0.5, description: '', image: null },
];

export const menuItems = items.map((item) => ({
  pieces: null,
  removable: [],
  options: [],
  addons: [],
  ...item,
}));

const byId = new Map(menuItems.map((item) => [item.id, item]));
export const getItem = (id) => byId.get(id);

export const itemsByCategory = categories.map((category) => ({
  ...category,
  items: menuItems.filter((item) => item.category === category.id),
}));
