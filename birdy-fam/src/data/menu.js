/**
 * Birdy Fam menu, transcribed from the printed menus (main menu + pastry menu).
 *
 * Editing guide
 * - price: USD number. Never shown with more than 2 decimals.
 * - image: path under /public (e.g. '/images/menu/road-kill-fries.webp'). While null,
 *   a branded placeholder is shown instead of a photo.
 * - options: choice groups. `required: true` forces the customer to pick one.
 * - removable: ingredients the customer can ask us to leave out (taken from the description).
 * - addons: true lets the customer add items from the "Add On" list to this item.
 */

export const categories = [
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'platters', name: 'Platters' },
  { id: 'burger', name: 'Burger' },
  { id: 'sliders', name: 'Sliders' },
  { id: 'wraps', name: 'Wraps' },
  { id: 'kids-meal', name: 'Kids Meal' },
  { id: 'desserts', name: 'Desserts' },
  // The pastry menu is untitled in print; rename here if the shop uses another name.
  { id: 'pastries', name: 'Pastries' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'add-on', name: 'Add On' },
]

/** The "Add On" list, also offered as extras on savoury items. */
export const addOns = [
  { id: 'cup-sauce', name: '1 Cup Sauce', price: 1 },
  { id: 'big-cup-sauce', name: '1 Big Cup Sauce', price: 5 },
  { id: 'cup-coleslaw', name: '1 Cup Coleslaw', price: 1 },
  { id: 'brioche', name: '1 Brioche', price: 1 },
]

const item = (category, id, name, price, description = '', extra = {}) => ({
  id,
  category,
  name,
  price,
  description,
  image: null,
  options: [],
  removable: [],
  addons: false,
  ...extra,
})

export const menuItems = [
  // Appetizers
  item('appetizers', 'mozzarella-sticks', 'Mozzarella sticks', 6,
    'Three thick sticks of melted mozzarella wrapped in our crunchy chips crust, served with a side of our spicy mayo magic.',
    { addons: true, removable: ['Spicy mayo'] }),
  item('appetizers', 'corn-ribs', 'Corn Ribs', 5,
    'Golden crispy corn ribs seasoned to perfection, served with our house sauce.',
    { addons: true, removable: ['House sauce'] }),
  item('appetizers', 'fries', 'Fries', 4, '', { addons: true }),
  item('appetizers', 'wedges', 'Wedges', 4, '', { addons: true }),
  item('appetizers', 'curly-fries', 'Curly Fries', 6, '', { addons: true }),
  item('appetizers', 'road-kill-fries', 'Road Kill Fries', 8,
    'Piled high with our signature crispy chicken, cut into bite sized pieces, drizzled generously with creamy cheddar sauce and our legendary Chico sauce.',
    { addons: true, removable: ['Cheddar sauce', 'Chico sauce'], featured: true }),

  // Platters
  item('platters', '2-pieces-chicken-strips', '2 Pieces Chicken Strips', 7.5,
    '2 Big crispy, juicy, and full of flavor, our signature chip-crusted chicken strips served with two fluffy brioche buns and a side of our legendary Chico sauce.',
    { addons: true, removable: ['Chico sauce'] }),
  item('platters', '3-pieces-chicken-strips', '3 Pieces Chicken Strips', 10,
    '3 Big crispy, juicy, and full of flavor, our signature chip-crusted chicken strips served with two fluffy brioche buns and a side of our legendary Chico sauce.',
    { addons: true, removable: ['Chico sauce'], featured: true }),

  // Burger
  item('burger', 'chicken-fillet-burger', 'Chicken Fillet Burger', 6,
    'Crispy chicken fillet stacked with garlic sauce, crunchy lettuce, and pickles, all tucked in a soft bun.',
    { addons: true, removable: ['Garlic sauce', 'Lettuce', 'Pickles'] }),
  item('burger', 'mozzarella-chicken-burger', 'Mozzarella Chicken Burger', 8,
    'Crispy chicken fillet stacked with garlic sauce, crunchy lettuce, pickles and 1 Mozzarella patty all tucked in a soft bun.',
    { addons: true, removable: ['Garlic sauce', 'Lettuce', 'Pickles'], featured: true }),

  // Sliders
  item('sliders', 'bbq-chicken-sliders', 'BBQ Chicken Sliders', 9,
    '3 soft, fluffy brioche sliders filled with shredded BBQ chicken, drizzled with BBQ sauce, served with pickles and ranch sauce.',
    { addons: true, removable: ['Pickles', 'Ranch sauce'] }),
  item('sliders', 'honey-chipotle-sliders', 'Honey Chipotle Sliders', 9,
    '3 soft, fluffy brioche sliders filled with shredded chicken tossed in sweet and smoky honey chipotle sauce, topped with pickles and ranch sauce.',
    { addons: true, removable: ['Pickles', 'Ranch sauce'], featured: true }),

  // Wraps
  item('wraps', 'bbq-chicken-wrap', 'BBQ Chicken Wrap', 7,
    'Crispy fried chicken breast strips dipped in BBQ sauce, coated in our signature chips crust, wrapped with fresh iceberg and chip sticks, with honey mustard and ranch inside.',
    { addons: true, removable: ['Iceberg', 'Chip sticks', 'Honey mustard', 'Ranch'] }),
  item('wraps', 'honey-mustard-chicken-wrap', 'Honey Mustard Chicken Wrap', 7,
    'Crispy fried chicken breast strips dipped in honey mustard, coated in our signature chips crust, wrapped with fresh iceberg and chip sticks, with ranch inside.',
    { addons: true, removable: ['Iceberg', 'Chip sticks', 'Ranch'] }),

  // Kids Meal
  item('kids-meal', 'kids-meal', 'Kids Meal', 12,
    '1 Big Crispy, juicy, and full of flavor, our signature chip-crusted chicken strips served with fries, fluffy brioche bun and a side of our legendary Chico sauce.',
    { addons: true, removable: ['Chico sauce'] }),
  item('kids-meal', 'chico-toy', '1 Chico Toy', 7),

  // Desserts
  item('desserts', 'brookie', 'Brookie', 5,
    'Half brownie, half cookie, 100% trouble. Fudgy chocolate meets chewy cookie dough for the ultimate sweet fix after your crispy feast.'),
  item('desserts', 'choco-bomb-crunch', 'Choco Bomb Crunch', 8,
    'Vanilla ice cream drumstick with a chocolate-caramel core, rolled in crispy crunch and drizzled with caramel and chocolate.',
    { featured: true }),
  item('desserts', 'birdy-sundae', 'Birdy Sundae', 4,
    'Creamy vanilla soft serve ice cream blended with crunchy sugar coated cornflakes, topped with your choice of caramel or chocolate sauce.',
    {
      options: [{
        id: 'sauce', name: 'Sauce', required: true,
        choices: [{ id: 'caramel', name: 'Caramel' }, { id: 'chocolate', name: 'Chocolate' }],
      }],
    }),
  item('desserts', 'birdy-cone', 'Birdy Cone', 1.5),

  // Pastries
  item('pastries', '4pcs-cregg', '4PCS Cregg', 6,
    'Our signature egg-shaped croissant, golden, buttery, and perfectly flaky, with delicate layers, a soft, airy center, and your choice of flavor.',
    {
      featured: true,
      options: [{
        id: 'flavor', name: 'Choose Flavor', required: true,
        choices: [
          { id: 'zaatar', name: 'Zaatar' },
          { id: 'cheese', name: 'Cheese' },
          { id: 'nutella', name: 'Nutella' },
          { id: 'almond', name: 'Almond' },
          { id: 'chocolate-cream', name: 'Chocolate Cream' },
        ],
      }],
    }),
  item('pastries', 'chocolate-eclair', 'Chocolate Éclair', 4.5,
    'A delicate choux pastry filled with smooth, velvety chocolate cream and finished with a rich chocolate glaze.'),
  item('pastries', 'vanilla-eclair', 'Vanilla Éclair', 4.5,
    'A delicate choux pastry filled with smooth, velvety vanilla cream and finished with a rich vanilla glaze.'),
  item('pastries', 'eggsotic-passion', 'Eggsotic Passion', 5.5,
    'A delicate egg-shaped white chocolate shell filled with smooth vanilla cream and a vibrant passion fruit center, balancing creamy sweetness with a refreshing tropical touch.'),
  item('pastries', 'chocolate-crunch-egg', 'Chocolate Crunch Egg', 6,
    'An egg-shaped chocolate shell filled with smooth chocolate cream and layers of cake, set on a rich, crunchy chocolate base.'),
  item('pastries', 'cheesecake-egg', 'Cheesecake Egg', 6,
    'A playful egg-shaped cheesecake with a crunchy crumble base and a sweet raspberry filling.'),
  item('pastries', 'chocoberry-egg', 'Chocoberry Egg', 6,
    'A rich chocolate egg with a luscious raspberry filling inside, bringing together deep chocolate flavor and a sweet, tangy berry burst in every bite.'),
  item('pastries', 'chocolate-tarte', 'Chocolate Tarte', 5.5,
    'A decadent chocolate tarte with a crisp pastry shell, filled with a rich, silky chocolate Caramel filling and finished with a smooth chocolate glaze.'),
  item('pastries', 'raspberry-tarte', 'Raspberry Tarte', 7,
    'A delicate tarte with a crisp pastry shell, filled with a luscious raspberry filling and finished with a sweet, fruity touch.'),
  item('pastries', 'strawberry-tarte', 'Strawberry Tarte', 6,
    'A delicate tarte with a crisp pastry shell, filled with vanilla pastry cream and finished with a perfectly sweet, fruity touch.'),
  item('pastries', 'citron-tarte', 'Citron Tarte', 6,
    'A delicate tarte with a crisp pastry shell, filled with smooth, zesty lemon cream and finished with a refreshing citrus touch.'),
  item('pastries', 'american-cookie', 'American Cookie', 4,
    'A classic American-style cookie with a golden, slightly crisp exterior and a soft, chewy center, loaded with rich chocolate chunks in every bite.'),

  // Drinks
  item('drinks', 'soft-drinks', 'Soft Drinks', 1.5),
  item('drinks', 'water', 'Water', 1),
  item('drinks', 'ice-tea', 'Ice Tea', 1.5),
  item('drinks', 'sparkling-water', 'Sparkling Water', 1.5),

  // Add On (also orderable on their own)
  ...addOns.map((a) => item('add-on', a.id, a.name, a.price)),
]

export const itemsById = Object.fromEntries(menuItems.map((i) => [i.id, i]))
export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))
