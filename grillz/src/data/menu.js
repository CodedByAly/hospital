/**
 * Grillz menu — transcribed from the restaurant's menu board.
 *
 * Prices are in Lebanese pounds as full numbers: the board prints "650 L.L"
 * for 650,000 L.L (the posts confirm this, e.g. "790,000 LBP").
 * Names, descriptions and spellings follow the board ("Honney mustard sous",
 * "dell pickles" on the Blaze are kept as printed in `description`).
 *
 * Item fields
 *   id, category, name, price
 *   accent       the part of the name printed in orange on the board
 *   description  the ingredient line(s) as printed
 *   pieces       "4 PCS" style badge
 *   remove       ingredients a customer can leave out
 *   addons       true = extra cheese / extra sauce / fries + Pepsi combo can be added
 *   spicy        the board marks it with a flame
 */

export const categories = [
  { id: 'beef-burgers', name: 'Beef Burgers', note: 'Made with 100% Angus beef' },
  { id: 'chicken-burgers', name: 'Chicken Burgers', note: 'Crispy. Juicy. Loaded.' },
  { id: 'specials', name: 'Specials' },
  { id: 'local-favorite', name: 'Local Favorite' },
  { id: 'kids-menu', name: 'Kids Menu' },
  { id: 'wraps-quesadilla', name: 'Wraps & Quesadilla' },
  { id: 'appetizers', name: 'Appetizers' },
];

export const ADDONS = [
  { id: 'extra-cheese', name: 'Extra cheese', price: 100000 },
  { id: 'extra-sauce', name: 'Extra sauce', price: 70000 },
  { id: 'combo', name: 'Combo: fries + Pepsi', price: 250000 },
];

const k = (n) => n * 1000;

export const items = [
  // ── Beef Burgers ───────────────────────────────────────────
  { id: 'grillz-bbq', category: 'beef-burgers', name: 'Grillz BBQ', accent: 'BBQ', price: k(650), addons: true,
    description: 'BBQ mayo · BBQ sauce · lettuce · tomato · pickles · 130g Angus beef · grilled onion · chips',
    remove: ['BBQ mayo', 'BBQ sauce', 'lettuce', 'tomato', 'pickles', 'grilled onion', 'chips'] },
  { id: 'grillz-cheese', category: 'beef-burgers', name: 'Grillz Cheese', accent: 'Cheese', price: k(600), addons: true,
    description: 'Cocktail sauce · lettuce · tomato · pickles · 130g Angus beef · cheddar · grilled onion',
    remove: ['cocktail sauce', 'lettuce', 'tomato', 'pickles', 'cheddar', 'grilled onion'] },
  { id: 'grillz-mushroom', category: 'beef-burgers', name: 'Grillz Mushroom', accent: 'Mushroom', price: k(590), addons: true,
    description: 'Mushroom sauce · lettuce · 130g Angus beef · grilled mushroom & onion · Swiss cheese',
    remove: ['mushroom sauce', 'lettuce', 'grilled onion', 'Swiss cheese'] },
  { id: 'truffle-mushroom', category: 'beef-burgers', name: 'Truffle Mushroom', accent: 'Mushroom', price: k(650), addons: true,
    description: 'Truffle mayo · lettuce · 130g Angus beef · mushroom · Swiss cheese',
    remove: ['truffle mayo', 'lettuce', 'mushroom', 'Swiss cheese'] },
  { id: 'grillz-smoked-in', category: 'beef-burgers', name: 'Grillz Smoked In', accent: 'Smoked In', price: k(790), addons: true, star: true,
    description: 'BBQ mayo · lettuce · tomato · 130g Angus beef · julienne beef steak · Halal beef bacon · Grillz crispy BBQ · Emmental cheese',
    remove: ['BBQ mayo', 'lettuce', 'tomato', 'beef bacon', 'Grillz crispy BBQ', 'Emmental cheese'] },

  // ── Chicken Burgers ────────────────────────────────────────
  { id: 'hellfire-chicken', category: 'chicken-burgers', name: 'Hellfire Chicken', accent: 'Chicken', price: k(550), addons: true, spicy: true,
    description: 'Hellfire sauce · lettuce · jalapeños · fried chicken · cheddar · chips',
    remove: ['hellfire sauce', 'lettuce', 'jalapeños', 'cheddar', 'chips'] },
  { id: 'golden-bite', category: 'chicken-burgers', name: 'Golden Bite', accent: 'Bite', price: k(600), addons: true,
    description: 'Honey mustard sauce · lettuce · tomato · pickles · fried chicken · mozzarella patty · Grillz crispy',
    remove: ['honey mustard sauce', 'lettuce', 'tomato', 'pickles', 'Grillz crispy'] },

  // ── Specials / Local favorite / Kids ───────────────────────
  { id: 'blaze-chicken-burger', category: 'specials', name: 'Blaze Chicken Burger', accent: 'Bla', price: k(420), addons: true,
    description: 'Honney mustard sous · lettuce · dell pickles · chips · grilled chicken · cheddar',
    remove: ['honey mustard sauce', 'lettuce', 'dill pickles', 'chips', 'cheddar'] },
  { id: 'lebanese-burger', category: 'local-favorite', name: 'Lebanese Burger', price: k(400), addons: true,
    description: 'Ketchup · fries · coleslaw · 100g Angus beef',
    remove: ['ketchup', 'fries', 'coleslaw'] },
  { id: 'kids-burger', category: 'kids-menu', name: 'Kids Burger', price: k(380), addons: true,
    description: 'Ketchup · lettuce · tomato · pickles · 100g Angus beef',
    remove: ['ketchup', 'lettuce', 'tomato', 'pickles'] },

  // ── Wraps & Quesadilla ─────────────────────────────────────
  { id: 'bbq-boneless-wrap', category: 'wraps-quesadilla', name: 'BBQ Boneless Wrap', accent: 'Boneless Wrap', price: k(450), addons: true,
    description: 'BBQ sauce · aioli mayo · mix cheese · lettuce · pickles · fried chicken strips · chips',
    remove: ['BBQ sauce', 'aioli mayo', 'mix cheese', 'lettuce', 'pickles', 'chips'] },
  { id: 'honey-mustard-wrap', category: 'wraps-quesadilla', name: 'Honey Mustard Wrap', accent: 'Wrap', price: k(450), addons: true,
    description: 'Honey mustard · BBQ sauce · mix cheese · lettuce · pickles · fried chicken strips · chips',
    remove: ['honey mustard', 'BBQ sauce', 'mix cheese', 'lettuce', 'pickles', 'chips'] },
  { id: 'grillz-quesadilla', category: 'wraps-quesadilla', name: 'Grillz Quesadilla', accent: 'Quesadilla', price: k(550), addons: true,
    description: 'Marinated chicken · mixed cheese · onion · red & green peppers · served with truffle mayo & sweet chili',
    remove: ['onion', 'red & green peppers'] },

  // ── Appetizers ─────────────────────────────────────────────
  { id: 'heavy-fries', category: 'appetizers', name: 'Heavy Fries', price: k(650),
    description: 'Fries · cheddar · breaded fried chicken · BBQ & honey mustard · chips',
    remove: ['cheddar', 'chips'] },
  { id: 'chicken-strips', category: 'appetizers', name: 'Chicken Strips', price: k(500), pieces: 4,
    description: 'Served with honey mustard dip' },
  { id: 'mozzarella-sticks', category: 'appetizers', name: 'Mozzarella Sticks', price: k(400), pieces: 4 },
  { id: 'jalapeno-spice-shots', category: 'appetizers', name: 'Jalapeño Spice Shots', price: k(400), pieces: 5, spicy: true },
  { id: 'classic-fries', category: 'appetizers', name: 'Classic Fries', price: k(300), description: 'Served with ketchup' },
  { id: 'curly-fries', category: 'appetizers', name: 'Curly Fries', price: k(400), description: 'Served with cheddar dip' },
];

/**
 * Offers from @grillz.burger.lb. `until` (inclusive, YYYY-MM-DD) hides an
 * offer automatically once it has ended.
 */
export const offers = [
  {
    id: 'offer-10',
    name: 'The $10 Duo',
    headline: 'أوفر بيشهي',
    image: 'ten-dollar',
    price: 10,
    currency: 'USD',
    includes: ['Blaze Chicken Burger', 'Lebanese Beef Burger', 'Fries', 'Pepsi', 'Sauce'],
    caption: 'Bring a friend — the saving is on us.',
  },
  {
    id: 'perfect-mushroom-combo',
    name: 'The Perfect Mushroom Combo',
    headline: 'Limited time offer',
    image: 'mushroom-combo',
    price: 790000,
    currency: 'LBP',
    includes: ['Mushroom burger', 'Fries', 'Pepsi', 'Sauce'],
    until: '2026-08-16',
  },
];

const today = () => new Date().toISOString().slice(0, 10);
export const activeOffers = () => offers.filter((o) => !o.until || o.until >= today());

/** Offers sit in the cart like menu items. */
const offerItems = offers.map((o) => ({ ...o, category: 'offers', description: o.includes.join(' + ') }));

export const itemsById = Object.fromEntries([...items, ...offerItems].map((i) => [i.id, i]));
export const categoriesById = Object.fromEntries([...categories, { id: 'offers', name: 'Offers' }].map((c) => [c.id, c]));
export const itemsByCategory = categories.map((c) => ({ ...c, items: items.filter((i) => i.category === c.id) }));
export const addonsById = Object.fromEntries(ADDONS.map((a) => [a.id, a]));

export const currencyOf = (item) => item.currency || 'LBP';
