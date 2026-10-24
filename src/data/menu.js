/**
 * The menu, transcribed from "Menu 2026 R01".
 *
 * Prices are in USD exactly as printed. To change something, edit the item here.
 *
 * Item shape:
 *   id           unique slug (used in the cart, keep it stable)
 *   name         as printed on the menu
 *   description  as printed on the menu (empty string when the menu has none)
 *   price        base price in USD
 *   options      optional single-choice group that replaces the price, e.g. Box / Plate
 *   removable    ingredients the customer may ask to leave out (free)
 *   addons       paid extras: [{ id, name, price }]. None are on the printed menu yet.
 */
import loadedFries from '../assets/food/loaded-fries.webp';
import loadedFriesSm from '../assets/food/loaded-fries-sm.webp';
import chickenBurger from '../assets/food/chicken-burger.webp';
import chickenBurgerSm from '../assets/food/chicken-burger-sm.webp';
import beefTrio from '../assets/food/beef-trio.webp';
import beefTrioSm from '../assets/food/beef-trio-sm.webp';
import tallStack from '../assets/food/tall-stack.webp';
import tallStackSm from '../assets/food/tall-stack-sm.webp';
import sandwiches from '../assets/food/sandwiches.webp';
import sandwichesSm from '../assets/food/sandwiches-sm.webp';
import drinks from '../assets/food/drinks.webp';
import drinksSm from '../assets/food/drinks-sm.webp';

const boxOrPlate = (box, plate) => ({
  label: 'Size',
  choices: [
    { id: 'box', name: 'Box', price: box },
    { id: 'plate', name: 'Plate', price: plate },
  ],
});

/**
 * Category image: `src` for large displays, `thumb` for small ones,
 * `shape` tells the layout whether the cut-out is tall or wide, and
 * `focus` is the CSS object-position used when the photo is cropped to fit
 * (point it at the side where the original print photo was cut off).
 * `fit: 'contain'` shows the whole photo instead of cropping it.
 * `image: null` renders a typographic panel instead of a photo.
 */
export const categories = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    note: 'B: Box / P: Plate',
    image: null,
    tone: 'orange',
    items: [
      { id: 'french-fries', name: 'French Fries', description: '', options: boxOrPlate(4.0, 8.0) },
      { id: 'potato-wedges', name: 'Potato Wedges', description: '', options: boxOrPlate(4.0, 8.0) },
      { id: 'curly-fries', name: 'Curly Fries', description: '', options: boxOrPlate(6.0, 10.5) },
      { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', description: '', price: 7.0 },
      { id: 'cheddar-sticks', name: 'Cheddar Sticks', description: '', price: 7.5 },
      { id: 'cheese-garlic-bread', name: 'Cheese Garlic Bread', description: '', price: 7.5 },
      { id: 'onion-rings', name: 'Onion Rings', description: '', price: 6.0 },
      { id: 'mix-fries-plate', name: 'Mix Fries Plate', description: '', price: 10.0 },
    ],
  },
  {
    id: 'loaded-fries',
    name: 'Loaded Fries',
    image: { src: loadedFries, thumb: loadedFriesSm, alt: 'Three plates of loaded fries with melted cheese, sauces and jalapeños', shape: 'wide', focus: 'center bottom' },
    tone: 'orange',
    items: [
      {
        id: 'steak-on-fries',
        name: 'Steak on Fries',
        description:
          'Crispy seasoned fries, thinly sliced steak with sautéed onions, roasted peppers, jalapeños, mushrooms, melted cheese, chipotle and garlic mayo',
        price: 11.0,
        removable: ['Onions', 'Roasted peppers', 'Jalapeños', 'Mushrooms', 'Chipotle', 'Garlic mayo'],
      },
      {
        id: 'wrigley-field',
        name: 'Wrigley Field',
        description:
          'Crispy seasoned fries loaded with grilled beef, beef bacon, melted mozzarella and cheddar cheese, crunchy chips, all drizzled with our signature secret sauce',
        price: 11.0,
        removable: ['Beef bacon', 'Chips', 'Secret sauce'],
      },
      {
        id: 'lakeshore-bites',
        name: 'Lakeshore Bites',
        description:
          'Crispy seasoned fries loaded with melted cheddar cheese, BBQ sauce, creamy ranch, jalapeños, and crispy chicken strips',
        price: 8.0,
        removable: ['BBQ sauce', 'Ranch', 'Jalapeños'],
      },
      {
        id: 'chicago-river',
        name: 'Chicago River',
        description:
          'Crispy seasoned fries, breaded chicken, mozzarella cheese, and a drizzle of honey and BBQ sauce',
        price: 8.5,
        removable: ['Honey', 'BBQ sauce'],
      },
      {
        id: 'cloud-gate-crunch',
        name: 'Cloud Gate Crunch',
        description:
          'Crispy seasoned fries topped with mozzarella cheese, crispy buffalo-dipped strips, crunchy potato chips, jalapeños, all drizzled with cocktail sauce',
        price: 10.0,
        removable: ['Potato chips', 'Jalapeños', 'Cocktail sauce'],
      },
      {
        id: 'bbq-chipotle',
        name: 'BBQ Chipotle',
        description:
          'Crispy seasoned fries topped with melted cheddar cheese, BBQ-glazed crispy chicken, a vibrant mix of red and green cabbage, onions, finished with creamy smoky chipotle sauce',
        price: 9.0,
        removable: ['Cabbage', 'Onions', 'Chipotle sauce'],
      },
    ],
  },
  {
    id: 'chicken-burgers',
    name: 'Chicken Burgers',
    image: { src: chickenBurger, thumb: chickenBurgerSm, alt: 'Crispy chicken burger with cheese, pickles, lettuce and sauce', shape: 'tall', focus: 'left center' },
    tone: 'peach',
    items: [
      {
        id: 'honey-gold-chicago',
        name: 'Honey Gold Chicago',
        description: 'Breaded chicken breast dipped in honey mustard, mozzarella patty, lettuce, pickles, cocktail sauce',
        price: 9.0,
        removable: ['Lettuce', 'Pickles', 'Cocktail sauce'],
      },
      {
        id: 'chicago-heatwave',
        name: 'Chicago Heatwave',
        description: 'Crispy zinger dipped in cheddar sauce, mozzarella patty, pickles, tomatoes, lettuce, Aioli and hot sauce',
        price: 9.0,
        removable: ['Pickles', 'Tomatoes', 'Lettuce', 'Aioli', 'Hot sauce'],
      },
      {
        id: 'the-chicago-dipper',
        name: 'The Chicago Dipper',
        description: 'Breaded chicken breast dipped in BBQ sauce, cheddar cheese, pickles, lettuce, honey mustard, and chips',
        price: 7.0,
        removable: ['Pickles', 'Lettuce', 'Honey mustard', 'Chips'],
      },
      {
        id: 'south-side-spice',
        name: 'South Side Spice',
        description:
          'Breaded chicken breast, grilled onions and peppers, jalapeños, tomato, lettuce, melted cheddar, Gouda cheese, hot cheese, hot sauce, and honey mustard sauce',
        price: 8.0,
        removable: ['Grilled onions', 'Peppers', 'Jalapeños', 'Tomato', 'Lettuce', 'Hot sauce', 'Honey mustard'],
      },
      {
        id: 'the-buffalo-loop',
        name: 'The Buffalo Loop',
        description: 'Breaded chicken breast dipped in buffalo sauce, Mozzarella patty, lettuce, pickles, cocktail sauce',
        price: 9.0,
        removable: ['Lettuce', 'Pickles', 'Cocktail sauce'],
      },
      {
        id: 'cheddar-melt',
        name: 'Cheddar Melt',
        description: 'Marinated char-grilled chicken breast, cheddar patty, lettuce, tomatoes, pickles, and cocktail sauce',
        price: 9.0,
        removable: ['Lettuce', 'Tomatoes', 'Pickles', 'Cocktail sauce'],
      },
      {
        id: 'the-windy-crunch',
        name: 'The Windy Crunch',
        description:
          'Breaded chicken breast, crispy chips, cheddar cheese, pickles, tomato, lettuce, cocktail and honey mustard sauce, finished with a second layer of chips',
        price: 8.0,
        removable: ['Pickles', 'Tomato', 'Lettuce', 'Cocktail sauce', 'Honey mustard'],
      },
      {
        id: 'honey-crisp-delight',
        name: 'Honey Crisp Delight',
        description:
          'Crispy Chicken, smoked turkey, lettuce, pickles, tomatoes, cocktail sauce, cheddar sauce, and our honey mustard sauce',
        price: 8.0,
        removable: ['Smoked turkey', 'Lettuce', 'Pickles', 'Tomatoes', 'Cocktail sauce', 'Honey mustard'],
      },
    ],
  },
  {
    id: 'signature-beef-burgers',
    name: 'Signature Beef Burgers',
    image: { src: beefTrio, thumb: beefTrioSm, alt: 'Three smashed beef burgers with cheese, lettuce and sauce', shape: 'wide', focus: 'center 70%' },
    tone: 'dark',
    items: [
      {
        id: 'chicago-style-burger',
        name: 'Chicago Style Burger',
        description: '2x smashed patties, roasted peppers, baby rocca, spicy aioli, double provolone cheese',
        price: 10.5,
        removable: ['Roasted peppers', 'Baby rocca', 'Spicy aioli'],
      },
      {
        id: 'the-chi-town-double-hit',
        name: 'The Chi-Town Double Hit',
        description:
          'Smashed beef patty, premium steak slices, iceberg, grilled onions and peppers, hot sauce, special sauce, Gouda and cheddar cheese',
        price: 10.5,
        removable: ['Iceberg', 'Grilled onions', 'Peppers', 'Hot sauce', 'Special sauce'],
      },
      {
        id: 'big-baby-burger',
        name: 'Big Baby Burger',
        description: '2x smashed patties, caramelized onions, pickles, special sauce, provolone and cheddar cheese',
        price: 10.5,
        removable: ['Caramelized onions', 'Pickles', 'Special sauce'],
      },
      {
        id: 'magnificent-mile-melt',
        name: 'Magnificent Mile Melt',
        description:
          'Smashed beef patty, cheddar patty, halal beef bacon, caramelized onions, lettuce, pickles, cocktail and aioli sauce',
        price: 10.5,
        removable: ['Beef bacon', 'Caramelized onions', 'Lettuce', 'Pickles', 'Cocktail sauce', 'Aioli'],
      },
      {
        id: 'swiss-mushroom',
        name: 'Swiss Mushroom',
        description: 'Smashed beef patty, mushroom sauce, onions, rocca, Swiss cheese, secret sauce',
        price: 10.0,
        removable: ['Onions', 'Rocca', 'Secret sauce'],
      },
      {
        id: 'classic-burger',
        name: 'Classic Burger',
        description: 'Smashed beef patty, pickles, lettuce, tomato, onions, cheddar cheese, cocktail sauce',
        price: 8.0,
        removable: ['Pickles', 'Lettuce', 'Tomato', 'Onions', 'Cheddar cheese', 'Cocktail sauce'],
      },
    ],
  },
  {
    id: 'flame-grilled-beef-burgers',
    name: 'Flame Grilled Beef Burgers',
    image: { src: tallStack, thumb: tallStackSm, alt: 'Two flame-grilled beef burgers stacked high', shape: 'tall', focus: 'right 40%' },
    tone: 'dark',
    items: [
      {
        id: 'lebanese-burger',
        name: 'Lebanese Burger',
        description: 'Char-grilled beef patty, coleslaw, french fries, ketchup',
        price: 7.0,
        removable: ['Coleslaw', 'French fries', 'Ketchup'],
      },
      {
        id: 'chicago-burger-grill',
        name: 'Chicago Burger Grill',
        description:
          'Char-grilled beef patty with lettuce, grilled tomatoes, grilled pepper, onion rings, cheddar cheese, honey mustard, and our burger sauce',
        price: 10.0,
        removable: ['Lettuce', 'Grilled tomatoes', 'Grilled pepper', 'Onion rings', 'Honey mustard', 'Burger sauce'],
      },
      {
        id: 'mozzarella-beef-melt',
        name: 'Mozzarella Beef Melt',
        description:
          'Char-grilled beef patty, mozzarella patty with lettuce, tomatoes, pickles, cocktail sauce, and our burger sauce',
        price: 10.0,
        removable: ['Lettuce', 'Tomatoes', 'Pickles', 'Cocktail sauce', 'Burger sauce'],
      },
      {
        id: 'bbq-beef-melt',
        name: 'BBQ Beef Melt',
        description:
          'Char-grilled beef patty, caramelized onions, lettuce, tomatoes, pickles, cheddar cheese, BBQ sauce and our burger sauce',
        price: 8.0,
        removable: ['Caramelized onions', 'Lettuce', 'Tomatoes', 'Pickles', 'BBQ sauce', 'Burger sauce'],
      },
    ],
  },
  {
    id: 'sandwiches',
    name: 'Sandwiches',
    image: { src: sandwiches, thumb: sandwichesSm, alt: 'Four sub sandwiches stacked: chicken, fajita and steak', shape: 'tall', focus: 'right center' },
    tone: 'light',
    items: [
      {
        id: 'grant-park-beef',
        name: 'Grant Park Beef',
        description:
          'A delectable blend of thinly sliced philly steak, sautéed onions and mushroom, topped with creamy peppercorn mayo sauce and Gouda cheese',
        price: 10.5,
        removable: ['Onions', 'Mushroom', 'Peppercorn mayo'],
      },
      {
        id: 'chicken-mushroom',
        name: 'Chicken Mushroom',
        description: 'Grilled chicken breast, lettuce, mayo sauce, fresh mushrooms, white sauce, Swiss cheese',
        price: 9.0,
        removable: ['Lettuce', 'Mayo', 'Mushrooms', 'White sauce'],
      },
      {
        id: 'classic-fajita',
        name: 'Classic Fajita',
        description: 'Tender chicken breast, onions, peppers, special and avocado sauces, cheese',
        price: 7.5,
        removable: ['Onions', 'Peppers', 'Special sauce', 'Avocado sauce'],
      },
      {
        id: 'lakeshore-chicken',
        name: 'Lakeshore Chicken',
        description:
          'A delicious combination of thinly sliced grilled chicken, sautéed onions and mushrooms, finished with rich peppercorn mayo and Gouda cheese',
        price: 9.0,
        removable: ['Onions', 'Mushrooms', 'Peppercorn mayo'],
      },
      {
        id: 'classic-philadelphia',
        name: 'Classic Philadelphia',
        description:
          'A savory combination of tender beef steak slices, sautéed mushrooms, bell peppers, onions, special and mayo sauce, melted mozzarella cheese',
        price: 10.0,
        removable: ['Mushrooms', 'Bell peppers', 'Onions', 'Special sauce', 'Mayo'],
      },
      {
        id: 'classic-chicken-sub',
        name: 'Classic Chicken Sub',
        description:
          'Thinly sliced chicken breast paired with lettuce, pickles, creamy mayo, garlic sauce, melted cheese, and a touch of savory soy sauce',
        price: 7.5,
        removable: ['Lettuce', 'Pickles', 'Mayo', 'Garlic sauce', 'Soy sauce'],
      },
    ],
  },
  {
    id: 'drinks',
    name: 'Drinks',
    image: { src: drinks, thumb: drinksSm, alt: 'Fresh orange juice, soft drink cans, water and juice box', shape: 'tall', focus: 'center center', fit: 'contain' },
    tone: 'dark',
    items: [
      { id: 'fresh-orange', name: 'Fresh Orange', description: '', price: 4.0 },
      { id: 'soft-drink-can', name: 'Soft Drink Can', description: '', price: 1.12 },
      { id: 'soft-drink-1-25l', name: 'Soft Drink 1.25L', description: '', price: 2.5 },
      { id: 'water-small', name: 'Water Small', description: '', price: 0.5 },
      { id: 'ice-tea', name: 'Ice Tea', description: '', price: 1.66 },
      { id: 'maccaw-juice', name: 'Maccaw Juice', description: '', price: 1.0 },
    ],
  },
];

// Flat lookup with each item linked to its category.
export const itemsById = new Map();
for (const category of categories) {
  for (const item of category.items) {
    itemsById.set(item.id, { ...item, categoryId: category.id });
  }
}

export const categoriesById = new Map(categories.map((c) => [c.id, c]));

/** Lowest price an item can be ordered at (used for "from $x" labels). */
export function basePrice(item) {
  if (item.options) return Math.min(...item.options.choices.map((c) => c.price));
  return item.price;
}
