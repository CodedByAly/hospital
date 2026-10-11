/**
 * O'snack menu — transcribed from the restaurant's current online menu.
 * Prices are in Lebanese Pounds (L.L.).
 *
 * Item fields
 *   id           unique, URL-safe
 *   category     one of the category ids below
 *   name         { en, ar }
 *   description  { en, ar } (optional)
 *   price        number in L.L.
 *   image        path under /public, or null for the placeholder
 *   promo        true for offers that cannot be ordered online (no price)
 *   extras       optional paid add-ons:   [{ id, name, price }]
 *   removable    optional ingredients the customer can leave out: [{ id, name }]
 *   choices      optional required single choice: { id, label, options: [{ id, name }] }
 */

import { asset } from '../lib/asset';

export const categories = [
  { id: 'offers', name: { en: 'Offers', ar: 'العروض' }, cover: asset('images/menu/mini-mix-box.jpg') },
  { id: 'sandwiches', name: { en: 'Sandwiches', ar: 'سندويشات' }, cover: asset('images/menu/tawouk.jpg'), dish: 'tawouk' },
  { id: 'burgers', name: { en: 'Burgers', ar: 'برغر' }, cover: asset('images/menu/american-burger.jpg'), dish: 'american-burger' },
  { id: 'salads', name: { en: 'Salads', ar: 'سلطات' }, cover: asset('images/menu/caesar-salad.jpg'), dish: 'caesar-salad' },
  { id: 'starters', name: { en: 'Starters', ar: 'مقبلات' }, cover: asset('images/menu/loaded-fries.jpg'), dish: 'loaded-fries' },
  { id: 'sodas', name: { en: 'Sodas', ar: 'مشروبات' }, cover: asset('images/menu/pepsi.jpg'), dish: 'pepsi' },
];

const img = (file) => asset(`images/menu/${file}.jpg`);

const ing = {
  coleslaw: { id: 'coleslaw', name: { en: 'Coleslaw', ar: 'كول سلو' } },
  fries: { id: 'fries', name: { en: 'Fries', ar: 'بطاطا' } },
  ketchup: { id: 'ketchup', name: { en: 'Ketchup', ar: 'كاتشب' } },
  mayo: { id: 'mayonnaise', name: { en: 'Mayonnaise', ar: 'مايونيز' } },
  pickles: { id: 'pickles', name: { en: 'Pickles', ar: 'كبيس' } },
  lettuce: { id: 'iceberg-lettuce', name: { en: 'Iceberg Lettuce', ar: 'خس آيسبرغ' } },
  grilledOnions: { id: 'grilled-onions', name: { en: 'Grilled onions', ar: 'بصل مشوي' } },
  grilledTomato: { id: 'grilled-tomato', name: { en: 'Grilled Tomato', ar: 'بندورة مشوية' } },
  cheddar: { id: 'cheddar', name: { en: 'Cheddar Cheese', ar: 'جبنة شيدر' } },
  garlic: { id: 'garlic', name: { en: 'Garlic', ar: 'ثوم' } },
  garlicSauce: { id: 'garlic-sauce', name: { en: 'Garlic sauce', ar: 'صلصة ثوم' } },
  tartar: { id: 'tartar-sauce', name: { en: 'Tartar sauce', ar: 'صلصة تارتار' } },
  cocktail: { id: 'cocktail-sauce', name: { en: 'Cocktail sauce', ar: 'صلصة كوكتيل' } },
  mushroom: { id: 'mushroom', name: { en: 'Fresh Mushroom', ar: 'فطر طازج' } },
  cheese: { id: 'cheese', name: { en: 'Cheese', ar: 'جبنة' } },
};

export const menuItems = [
  /* ---------- Offers ---------- */
  {
    id: 'mini-mix-box',
    category: 'offers',
    name: { en: 'The Mini Mix Box', ar: 'ميني ميكس بوكس' },
    description: {
      en: 'Includes 2 Mini Philadelphia, 2 Mini Fajita, and 1 Mini Mexican, served with French fries & Pepsi.',
      ar: '2 ميني فيلادلفيا، 2 ميني فاهيتا و1 ميني مكسيكان، مع بطاطا مقلية وبيبسي.',
    },
    price: 900000,
    image: img('mini-mix-box'),
  },
  {
    id: 'burger-box',
    category: 'offers',
    promo: true,
    name: { en: 'The Burger Box', ar: 'برغر بوكس' },
    description: {
      en: 'Buy any two burgers from our menu and get a free chicken burger!',
      ar: 'اشترِ أي برغرين من المنيو وخود تشيكن برغر مجاناً!',
    },
    price: 0,
    image: img('burger-box'),
  },
  {
    id: 'crispy-box',
    category: 'offers',
    name: { en: 'Crispy Box', ar: 'كريسبي بوكس' },
    description: {
      en: '5 crispy strips served with fries, coleslaw, pickles, garlic sauce, ketchup, and a Pepsi.',
      ar: '5 قطع كريسبي مع بطاطا، كول سلو، كبيس، صلصة ثوم، كاتشب وبيبسي.',
    },
    price: 750000,
    image: img('crispy-box'),
    removable: [ing.coleslaw, ing.pickles, ing.garlicSauce, ing.ketchup],
  },
  {
    id: 'shrimp-box',
    category: 'offers',
    name: { en: 'Shrimp Box', ar: 'شريمب بوكس' },
    description: {
      en: 'This meal box includes 12 pieces of shrimp served with fries, pickles, tartar sauce, cocktail sauce, and a Pepsi.',
      ar: '12 قطعة قريدس مع بطاطا، كبيس، صلصة تارتار، صلصة كوكتيل وبيبسي.',
    },
    price: 750000,
    image: img('shrimp-box'),
    removable: [ing.pickles, ing.tartar, ing.cocktail],
  },
  {
    id: 'triple-magic',
    category: 'offers',
    promo: true,
    name: { en: 'Triple magic', ar: 'تريبل ماجيك' },
    description: {
      en: 'Buy any 3 sandwiches and get 1 free! (Dine-in only)',
      ar: 'اشترِ أي 3 سندويشات وخود الرابع مجاناً! (داخل المطعم فقط)',
    },
    price: 0,
    image: img('triple-magic'),
  },

  /* ---------- Sandwiches ---------- */
  { id: 'fries-baguette-bread', category: 'sandwiches', name: { en: 'Fries Baguette Bread', ar: 'بطاطا بخبز الباغيت' }, price: 200000, image: img('fries-baguette-bread') },
  { id: 'fries-arabic-bread', category: 'sandwiches', name: { en: 'Fries Arabic Bread', ar: 'بطاطا بالخبز العربي' }, price: 250000, image: img('fries-arabic-bread') },
  { id: 'tawouk', category: 'sandwiches', name: { en: 'Tawouk', ar: 'طاووق' }, price: 400000, image: img('tawouk') },
  { id: 'rosto', category: 'sandwiches', name: { en: 'Rosto', ar: 'روستو' }, price: 520000, image: img('rosto') },
  { id: 'rosto-with-cheese', category: 'sandwiches', name: { en: 'Rosto with Cheese', ar: 'روستو مع جبنة' }, price: 590000, image: img('rosto-with-cheese') },
  { id: 'nkhaat', category: 'sandwiches', name: { en: "Nkha'at", ar: 'نخاعات' }, price: 500000, image: img('nkhaat') },
  { id: 'sawda', category: 'sandwiches', name: { en: 'Sawda', ar: 'سودا' }, price: 330000, image: img('sawda') },
  { id: 'soujok', category: 'sandwiches', name: { en: 'Soujok', ar: 'سجق' }, price: 450000, image: img('soujok') },
  { id: 'makanik', category: 'sandwiches', name: { en: 'Makanik', ar: 'مقانق' }, price: 450000, image: img('makanik') },
  { id: 'shrimp-sandwich', category: 'sandwiches', name: { en: 'Shrimp', ar: 'قريدس' }, price: 550000, image: img('shrimp-sandwich') },
  { id: 'fajita', category: 'sandwiches', name: { en: 'Fajita', ar: 'فاهيتا' }, price: 600000, image: img('fajita') },
  { id: 'chicken-sub', category: 'sandwiches', name: { en: 'Chicken Sub', ar: 'تشيكن ساب' }, price: 500000, image: img('chicken-sub') },
  { id: 'philadelphia', category: 'sandwiches', name: { en: 'Philadelphia', ar: 'فيلادلفيا' }, price: 670000, image: img('philadelphia') },
  { id: 'francisco', category: 'sandwiches', name: { en: 'Francisco', ar: 'فرانسيسكو' }, price: 500000, image: img('francisco') },
  { id: 'mexican', category: 'sandwiches', name: { en: 'Mexican', ar: 'مكسيكان' }, price: 500000, image: img('mexican') },
  { id: 'crispy-sandwich', category: 'sandwiches', name: { en: 'Crispy Sandwich', ar: 'سندويش كريسبي' }, price: 450000, image: img('crispy-sandwich') },

  /* ---------- Burgers ---------- */
  {
    id: 'lebanese-burger',
    category: 'burgers',
    name: { en: 'Lebanese Burger', ar: 'برغر لبناني' },
    description: {
      en: '130g Grilled Meat Patty, Coleslaw, Fries, Ketchup.',
      ar: 'قطعة لحم مشوية 130غ، كول سلو، بطاطا، كاتشب.',
    },
    price: 470000,
    image: img('lebanese-burger'),
    removable: [ing.coleslaw, ing.fries, ing.ketchup],
  },
  {
    id: 'american-burger',
    category: 'burgers',
    name: { en: 'American Burger', ar: 'برغر أميركي' },
    description: {
      en: '130g Grilled Meat Patty, Grilled onions, Grilled Tomato, Iceberg Lettuce, Mayonnaise, ketchup, Pickles, Cheddar Cheese.',
      ar: 'قطعة لحم مشوية 130غ، بصل مشوي، بندورة مشوية، خس آيسبرغ، مايونيز، كاتشب، كبيس، جبنة شيدر.',
    },
    price: 520000,
    image: img('american-burger'),
    extras: [{ id: 'add-cheese', name: { en: 'Add Cheese', ar: 'إضافة جبنة' }, price: 50000 }],
    removable: [ing.grilledOnions, ing.grilledTomato, ing.lettuce, ing.mayo, ing.ketchup, ing.pickles, ing.cheddar],
  },
  {
    id: 'chicken-breast-burger',
    category: 'burgers',
    name: { en: 'Chicken Breast Burger', ar: 'برغر صدر دجاج' },
    description: {
      en: 'Grilled Chicken, Garlic, Mayonnaise, Pickles, Iceberg Lettuce, ketchup, Coleslaw',
      ar: 'دجاج مشوي، ثوم، مايونيز، كبيس، خس آيسبرغ، كاتشب، كول سلو.',
    },
    price: 490000,
    image: img('chicken-breast-burger'),
    extras: [{ id: 'add-cheese', name: { en: 'Add Cheese', ar: 'إضافة جبنة' }, price: 60000 }],
    removable: [ing.garlic, ing.mayo, ing.pickles, ing.lettuce, ing.ketchup, ing.coleslaw],
  },
  {
    id: 'mushroom-burger',
    category: 'burgers',
    name: { en: 'Mushroom Burger', ar: 'برغر مشروم' },
    description: {
      en: '130g Grilled Meat Patty, Fresh Mushroom, Cheese.',
      ar: 'قطعة لحم مشوية 130غ، فطر طازج، جبنة.',
    },
    price: 670000,
    image: img('mushroom-burger'),
    removable: [ing.mushroom, ing.cheese],
  },
  { id: 'cheese-burger', category: 'burgers', name: { en: 'Cheese Burger', ar: 'تشيز برغر' }, price: 540000, image: img('cheese-burger') },
  { id: 'zinger-burger', category: 'burgers', name: { en: 'Zinger Burger', ar: 'زنجر برغر' }, price: 500000, image: img('zinger-burger') },
  { id: 'chicken-burger', category: 'burgers', name: { en: 'Chicken Burger', ar: 'تشيكن برغر' }, price: 300000, image: img('chicken-burger') },

  /* ---------- Salads ---------- */
  { id: 'caesar-salad', category: 'salads', name: { en: 'Caesar Salad', ar: 'سلطة سيزر' }, price: 550000, image: img('caesar-salad') },
  { id: 'tuna-pasta-salad', category: 'salads', name: { en: 'Tuna Pasta Salad', ar: 'سلطة باستا تونة' }, price: 450000, image: img('tuna-pasta-salad') },
  { id: 'crab-salad', category: 'salads', name: { en: 'Crab Salad', ar: 'سلطة كراب' }, price: 450000, image: img('crab-salad') },
  { id: 'rocca-beetroot-salad', category: 'salads', name: { en: 'Rocca Beetroot Salad', ar: 'سلطة روكا وشمندر' }, price: 450000, image: img('rocca-beetroot-salad') },
  { id: 'quinoa-salad', category: 'salads', name: { en: 'Quinoa Salad', ar: 'سلطة كينوا' }, price: 700000, image: img('quinoa-salad') },

  /* ---------- Starters ---------- */
  {
    id: 'loaded-fries',
    category: 'starters',
    name: { en: 'The Loaded Fries', ar: 'لوديد فرايز' },
    description: { en: 'Hot Dog / Sojok / Chicken', ar: 'هوت دوغ / سجق / دجاج' },
    price: 550000,
    image: img('loaded-fries'),
    choices: {
      id: 'topping',
      label: { en: 'Choose your topping', ar: 'اختار الإضافة' },
      options: [
        { id: 'hot-dog', name: { en: 'Hot Dog', ar: 'هوت دوغ' } },
        { id: 'sojok', name: { en: 'Sojok', ar: 'سجق' } },
        { id: 'chicken', name: { en: 'Chicken', ar: 'دجاج' } },
      ],
    },
  },
  { id: 'french-fries', category: 'starters', name: { en: 'French Fries', ar: 'بطاطا مقلية' }, price: 270000, image: img('french-fries') },
  { id: 'loaded-crispy', category: 'starters', name: { en: 'Loaded Crispy', ar: 'لوديد كريسبي' }, price: 550000, image: img('loaded-crispy') },

  /* ---------- Sodas ---------- */
  { id: 'mirinda', category: 'sodas', name: { en: 'Mirinda', ar: 'ميرندا' }, price: 100000, image: img('mirinda') },
  { id: 'pepsi-diet', category: 'sodas', name: { en: 'Pepsi Diet', ar: 'بيبسي دايت' }, price: 100000, image: img('pepsi-diet') },
  { id: 'pepsi', category: 'sodas', name: { en: 'Pepsi', ar: 'بيبسي' }, price: 100000, image: img('pepsi') },
  { id: '7up', category: 'sodas', name: { en: '7up', ar: 'سفن أب' }, price: 100000, image: img('7up') },
  { id: '7up-diet', category: 'sodas', name: { en: '7up Diet', ar: 'سفن أب دايت' }, price: 100000, image: img('7up-diet') },
  { id: 'laban-ayran', category: 'sodas', name: { en: 'Laban Ayran', ar: 'لبن عيران' }, price: 100000, image: null },
];

/** Items with a transparent cut-out photo in /public/images/cutouts (used for motion). */
const CUTOUTS = new Set([
  '7up-diet', '7up', 'american-burger', 'caesar-salad', 'chicken-breast-burger', 'chicken-burger',
  'crab-salad', 'crispy-sandwich', 'fajita', 'francisco', 'french-fries', 'fries-arabic-bread',
  'fries-baguette-bread', 'lebanese-burger', 'loaded-crispy', 'loaded-fries', 'makanik', 'mexican',
  'mirinda', 'mushroom-burger', 'nkhaat', 'pepsi-diet', 'pepsi', 'philadelphia', 'quinoa-salad',
  'rocca-beetroot-salad', 'rosto-with-cheese', 'rosto', 'shrimp-sandwich', 'soujok', 'tawouk',
  'tuna-pasta-salad', 'zinger-burger',
]);

menuItems.forEach((item) => {
  item.cutout = CUTOUTS.has(item.id) ? asset(`images/cutouts/${item.id}.webp`) : null;
});

/** Dishes that rotate through the home page showcase, in order. */
export const showcaseIds = ['american-burger', 'tawouk', 'zinger-burger', 'loaded-fries', 'makanik', 'crispy-sandwich'];

export const itemsById = Object.fromEntries(menuItems.map((item) => [item.id, item]));

export const itemsByCategory = categories.map((category) => ({
  ...category,
  items: menuItems.filter((item) => item.category === category.id),
}));
