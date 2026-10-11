/**
 * Qambri menu — transcribed from the restaurant's printed menu.
 *
 * Names, prices and ingredient lists follow the menu exactly (including its
 * spellings such as "Tatar Sauce", "Torator", "Sardine Sand"). Prices are in
 * Lebanese pounds (L.L) as plain integers.
 *
 * Item fields
 *   id           unique, URL-safe
 *   category     one of the category ids below
 *   name         { en, ar }
 *   price        integer, L.L
 *   note         optional short label shown next to the name, e.g. "3 pcs"
 *   ingredients  optional list printed under the name on the menu.
 *                `removable: false` keeps it out of the "Without" options.
 *   contents     optional list of what a meal includes (not removable)
 *   includedSauces  optional number of sauces the customer can pick for free
 *   image        optional file name in /public/images/food (without extension)
 */

const ing = (en, ar, removable = true) => ({ en, ar, removable });

// Shared ingredient labels
const I = {
  grilledShrimp: ['grilled shrimp', 'قريدس مشوي'],
  friedShrimp: ['fried shrimp', 'قريدس مقلي'],
  shrimp: ['shrimp', 'قريدس'],
  crab: ['crab', 'كراب'],
  dillPickle: ['dill pickle', 'كبيس خيار'],
  pickle: ['pickle', 'كبيس'],
  lettuce: ['lettuce', 'خس'],
  sweetCorn: ['sweet corn', 'ذرة'],
  mayonnaise: ['mayonnaise', 'مايونيز'],
  mozzarella: ['mozzarella cheese', 'جبنة موزاريلا'],
  tomato: ['tomato', 'بندورة'],
  lemon: ['lemon', 'حامض'],
};
const base = (key, removable = true) => ing(I[key][0], I[key][1], removable);

export const categories = [
  { id: 'appetizer', name: { en: 'Appetizer', ar: 'مقبلات' }, extras: true },
  { id: 'sandwich', name: { en: 'Sandwich', ar: 'سندويش' }, extras: true },
  { id: 'meal', name: { en: 'Meal', ar: 'وجبات' }, extras: true },
  { id: 'salad', name: { en: 'Salad', ar: 'سلطات' } },
  { id: 'pasta', name: { en: 'Pasta', ar: 'باستا' } },
  { id: 'drinks', name: { en: 'Drinks', ar: 'مشروبات' } },
  { id: 'sauces', name: { en: 'Sauces', ar: 'صلصات' } },
];

// Price of one extra sauce — "(add sauce) 50,000 L.L"
export const SAUCE_PRICE = 50000;

export const items = [
  // ── Appetizer ──────────────────────────────────────────────
  { id: 'shrimp-roll', category: 'appetizer', name: { en: 'Shrimp roll', ar: 'رول قريدس' }, note: { en: '3 pcs', ar: '3 قطع' }, price: 180000 },
  { id: 'feta-ball', category: 'appetizer', name: { en: 'Feta ball', ar: 'كرات فيتا' }, note: { en: '3 pcs', ar: '3 قطع' }, price: 180000 },
  { id: 'calamari-ring', category: 'appetizer', name: { en: 'Calamari ring', ar: 'حلقات كاليماري' }, note: { en: '3 pcs', ar: '3 قطع' }, price: 250000 },
  { id: 'small-fries', category: 'appetizer', name: { en: 'Small french fries', ar: 'بطاطا مقلية صغيرة' }, price: 200000 },
  { id: 'large-fries', category: 'appetizer', name: { en: 'Large fries', ar: 'بطاطا مقلية كبيرة' }, price: 300000 },

  // ── Sandwich ───────────────────────────────────────────────
  {
    id: 'shrimp-sub', category: 'sandwich', name: { en: 'Shrimp Sub', ar: 'ساب قريدس' }, price: 550000,
    ingredients: [base('grilledShrimp', false), base('dillPickle'), base('lettuce'), ing('soya sauce', 'صويا صوص'), base('sweetCorn'), base('mayonnaise'), base('mozzarella')],
  },
  {
    id: 'samke-7arra-wrap', category: 'sandwich', name: { en: 'Samke 7arra Wrap', ar: 'راب سمكة حرّة' }, price: 450000,
    ingredients: [ing('grilled fish', 'سمك مشوي', false), ing('tajen sauce', 'صلصة طاجن'), base('tomato'), base('dillPickle'), ing('garlic paste', 'توم'), base('lettuce'), base('lemon')],
  },
  {
    id: 'dynamite-wrap', category: 'sandwich', name: { en: 'Dynamite wrap', ar: 'راب داينامايت' }, price: 550000, image: 'dynamite-wrap',
    ingredients: [base('friedShrimp', false), ing('dynamite sauce', 'صلصة داينامايت'), ing('jalapeno', 'هالابينو'), base('tomato'), base('lettuce')],
  },
  {
    id: 'provencal-wrap', category: 'sandwich', name: { en: 'Provencal wrap', ar: 'راب بروفنسال' }, price: 550000,
    ingredients: [base('lemon'), base('lettuce'), ing('garlic', 'توم'), ing('coriander', 'كزبرة'), ing('cumin', 'كمون'), base('grilledShrimp', false)],
  },
  {
    id: 'fajita-shrimp', category: 'sandwich', name: { en: 'Fajita shrimp', ar: 'فاهيتا قريدس' }, price: 550000,
    ingredients: [base('grilledShrimp', false), ing('green pepper', 'فليفلة خضرا'), ing('onions', 'بصل'), base('mozzarella'), ing('fajita sauce', 'صلصة فاهيتا')],
  },
  {
    id: 'crab-sandwich', category: 'sandwich', name: { en: 'Crab Sandwich', ar: 'سندويش كراب' }, price: 450000,
    ingredients: [base('crab', false), base('grilledShrimp', false), base('pickle'), base('lettuce'), base('sweetCorn'), base('mayonnaise')],
  },
  {
    id: 'fish-burger', category: 'sandwich', name: { en: 'Fish Burger', ar: 'برغر سمك' }, price: 550000, image: 'fish-burger',
    ingredients: [ing('fried fish', 'سمك مقلي', false), ing('tartar sauce', 'صلصة تارتار'), base('lettuce'), base('dillPickle')],
  },
  {
    id: 'mix-burger', category: 'sandwich', name: { en: 'Mix burger', ar: 'ميكس برغر' }, price: 550000, image: 'mix-burger',
    ingredients: [base('crab', false), base('shrimp', false), base('lettuce'), base('dillPickle'), base('lemon'), base('sweetCorn'), ing('qambri sauce', 'صلصة كامبري')],
  },
  {
    id: 'sardine-sand', category: 'sandwich', name: { en: 'Sardine Sand', ar: 'سندويش سردين' }, price: 300000,
    ingredients: [ing('sardine', 'سردين', false), ing('rocca', 'روكا'), ing('tarator', 'طراطور')],
  },
  { id: 'crab-w-shrimp', category: 'sandwich', name: { en: 'Crab w Shrimp', ar: 'كراب وقريدس' }, price: 550000 },

  // ── Meal ───────────────────────────────────────────────────
  {
    id: 'qambri-meal', category: 'meal', name: { en: 'Qambri meal', ar: 'وجبة كامبري' }, price: 800000,
    contents: [
      { en: '4 pcs fried fish', ar: '4 قطع سمك مقلي' },
      { en: '8 pcs fried shrimp', ar: '8 قطع قريدس مقلي' },
      { en: 'cole slaw', ar: 'كول سلو' },
      { en: 'qambri sauce', ar: 'صلصة كامبري' },
      { en: 'tartar sauce', ar: 'صلصة تارتار' },
      { en: 'french fries', ar: 'بطاطا مقلية' },
      { en: 'bun', ar: 'خبز برغر' },
    ],
  },
  {
    // Photo from Qambri's Instagram showing crispy shrimp, fries, coleslaw and sauces.
    id: 'crispy-shrimp-meal', category: 'meal', name: { en: 'Crispy Shrimp meal', ar: 'وجبة قريدس كريسبي' }, price: 800000, image: 'crispy-shrimp-meal',
    contents: [
      { en: '10 pcs crispy shrimp', ar: '10 قطع قريدس كريسبي' },
      { en: 'French fries', ar: 'بطاطا مقلية' },
      { en: 'cole slaw', ar: 'كول سلو' },
      { en: 'tartar sauce', ar: 'صلصة تارتار' },
      { en: 'dynamite sauce', ar: 'صلصة داينامايت' },
      { en: 'bun', ar: 'خبز برغر' },
    ],
  },
  {
    id: 'grilled-shrimp-meal', category: 'meal', name: { en: 'Grilled shrimp meal', ar: 'وجبة قريدس مشوي' }, price: 800000, image: 'grilled-shrimp-meal',
    includedSauces: 2,
    contents: [
      { en: '8 grilled shrimp', ar: '8 حبات قريدس مشوي' },
      { en: 'french fries', ar: 'بطاطا مقلية' },
      { en: '2 sauce', ar: 'صلصتين' },
      { en: 'bun', ar: 'خبز برغر' },
      { en: 'cole slaw', ar: 'كول سلو' },
    ],
  },
  {
    id: 'family-meal', category: 'meal', name: { en: 'Family meal', ar: 'وجبة العيلة' }, price: 2700000, image: 'family-meal',
    contents: [
      { en: '25 pcs fried shrimp', ar: '25 قطعة قريدس مقلي' },
      { en: '4 pcs calamary ring', ar: '4 حلقات كاليماري' },
      { en: '10 pcs fried fish', ar: '10 قطع سمك مقلي' },
      { en: '2 cole slaw', ar: '2 كول سلو' },
      { en: '4 bun', ar: '4 خبز برغر' },
      { en: 'french fries', ar: 'بطاطا مقلية' },
      { en: '8 sauces', ar: '8 صلصات' },
    ],
  },

  // ── Salad ──────────────────────────────────────────────────
  {
    // "osakicrab" is printed as one word on the menu.
    id: 'qambri-crab-salad', category: 'salad', name: { en: 'Qambri crab salad', ar: 'سلطة كراب كامبري' }, price: 550000, image: 'crab-salad',
    ingredients: [base('crab', false), ing('cucumber', 'خيار'), ing('osakicrab', 'أوساكي كراب'), ing('mango sesame', 'مانغا وسمسم'), ing('crab sauce', 'صلصة الكراب')],
  },
  {
    id: 'shrimp-caesar-salad', category: 'salad', name: { en: 'Shrimp caesar salad', ar: 'سلطة سيزر بالقريدس' }, price: 600000, image: 'shrimp-caesar',
    ingredients: [base('lettuce'), ing('croutons', 'خبز محمّص'), base('grilledShrimp', false), ing('parmesan cheese', 'جبنة بارميزان')],
  },
  { id: 'coleslaw', category: 'salad', name: { en: 'Coleslaw', ar: 'كول سلو' }, price: 150000 },

  // ── Pasta ──────────────────────────────────────────────────
  { id: 'shrimp-tagliatelle', category: 'pasta', name: { en: 'Shrimp tagliatelle', ar: 'تالياتيلي قريدس' }, note: { en: 'white sauce', ar: 'صلصة بيضاء' }, price: 750000 },
  { id: 'pesto-pasta-shrimp', category: 'pasta', name: { en: 'Pesto pasta shrimp', ar: 'باستا بيستو بالقريدس' }, price: 750000 },

  // ── Drinks ─────────────────────────────────────────────────
  { id: 'pepsi', category: 'drinks', name: { en: 'Pepsi', ar: 'بيبسي' }, price: 80000 },
  { id: '7up', category: 'drinks', name: { en: '7up', ar: 'سفن أب' }, price: 80000 },
  { id: 'small-water', category: 'drinks', name: { en: 'Small water', ar: 'مي صغيرة' }, price: 30000 },

  // ── Sauces ─────────────────────────────────────────────────
  { id: 'honey-mustard', category: 'sauces', name: { en: 'Honey Mustard', ar: 'هوني ماسترد' }, price: SAUCE_PRICE, image: 'sauces' },
  { id: 'dynamite-sauce', category: 'sauces', name: { en: 'Dynamite Sauce', ar: 'صلصة داينامايت' }, price: SAUCE_PRICE, image: 'sauces' },
  { id: 'tatar-sauce', category: 'sauces', name: { en: 'Tatar Sauce', ar: 'صلصة تارتار' }, price: SAUCE_PRICE, image: 'sauces' },
  { id: 'qambri-sauce', category: 'sauces', name: { en: 'Qambri Sauce', ar: 'صلصة كامبري' }, price: SAUCE_PRICE, image: 'sauces' },
  { id: 'torator', category: 'sauces', name: { en: 'Torator', ar: 'طراطور' }, price: SAUCE_PRICE, image: 'sauces' },
];

export const sauces = items.filter((i) => i.category === 'sauces');

export const itemsById = Object.fromEntries(items.map((i) => [i.id, i]));
export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));

export const itemsByCategory = categories.map((c) => ({
  ...c,
  items: items.filter((i) => i.category === c.id),
}));

/** Whether an item can take paid extra sauces. */
export const allowsExtras = (item) => Boolean(categoriesById[item.category]?.extras);
