/**
 * Life Kitchen menu.
 *
 * Transcribed from the printed menu. Prices are in USD.
 *
 * Item fields
 *   id           unique, used in URLs (/menu?item=<id>) and the cart
 *   category     id from `categories`
 *   name         { en, ar }
 *   description  { en, ar } (optional)
 *   price        base price
 *   image        path under /public (e.g. '/images/menu/crunch-combo.webp') or null
 *   spicy        true for items marked spicy on the menu
 *   variants     choose-one group that REPLACES the price (e.g. half portion)
 *   choices      choose-one group that does not change the price (e.g. wine colour)
 *   addons       list of add-on group ids from `addonGroups`
 *   removable    ingredient ids from `ingredients` the customer can leave out
 */

export const categories = [
  { id: 'appetizers', name: { en: 'Appetizers', ar: 'مقبلات' } },
  { id: 'sandwiches', name: { en: 'Sandwiches', ar: 'سندويشات' } },
  { id: 'burgers', name: { en: 'Burgers', ar: 'برغر' } },
  { id: 'smashed-burgers', name: { en: 'Smashed Burgers', ar: 'سماشد برغر' } },
  { id: 'salads', name: { en: 'Salads', ar: 'سلطات' } },
  { id: 'mezza', name: { en: 'Mezza', ar: 'مازة' } },
  { id: 'beverages', name: { en: 'Beverages', ar: 'مشروبات' } },
];

// "Add-On" and "Combo Upgrade" sections of the printed menu.
export const addonGroups = {
  sides: {
    id: 'sides',
    name: { en: 'Add-on', ar: 'إضافات' },
    options: [
      { id: 'small-fries', name: { en: 'Small Fries', ar: 'بطاطا صغيرة' }, price: 2.5 },
      { id: 'large-fries', name: { en: 'Large Fries', ar: 'بطاطا كبيرة' }, price: 4 },
      { id: 'wedges', name: { en: 'Seasoned Potato Wedges', ar: 'ودجز بطاطا متبّلة' }, price: 3 },
    ],
  },
  combo: {
    id: 'combo',
    name: { en: 'Combo Upgrade', ar: 'حوّلها كومبو' },
    options: [
      { id: 'fries-soft-drink', name: { en: 'Fries + Soft Drink', ar: 'بطاطا + مشروب غازي' }, price: 2.5 },
    ],
  },
};

const halfPortion = (fullPrice) => ({
  id: 'portion',
  name: { en: 'Portion', ar: 'الحصة' },
  options: [
    { id: 'full', name: { en: 'Full portion', ar: 'حصة كاملة' }, price: fullPrice },
    { id: 'half', name: { en: 'Half portion', ar: 'نص حصة' }, price: 3 },
  ],
});

export const ingredients = {
  lettuce: { en: 'Lettuce', ar: 'خس' },
  corn: { en: 'Corn', ar: 'ذرة' },
  garlicMayo: { en: 'Garlic mayo', ar: 'مايونيز بالتوم' },
  specialSauce: { en: 'Special sauce', ar: 'الصوص الخاص' },
  potatoChips: { en: 'Potato chips', ar: 'شيبس بطاطا' },
  bbq: { en: 'BBQ sauce', ar: 'صوص باربكيو' },
  onion: { en: 'Onion', ar: 'بصل' },
  pepper: { en: 'Tricolor pepper', ar: 'فليفلة ملوّنة' },
  mushroom: { en: 'Mushroom', ar: 'فطر' },
  mozzarella: { en: 'Mozzarella cheese', ar: 'جبنة موزاريلا' },
  molasses: { en: 'Pomegranate molasses', ar: 'دبس رمان' },
  pickles: { en: 'Pickles', ar: 'كبيس' },
  tomato: { en: 'Tomato', ar: 'بندورة' },
  mayo: { en: 'Mayo', ar: 'مايونيز' },
  fries: { en: 'Fries', ar: 'بطاطا' },
  garlic: { en: 'Garlic', ar: 'توم' },
  emmental: { en: 'Emmental', ar: 'جبنة إيمنتال' },
  mushroomSauce: { en: 'Mushroom sauce', ar: 'صوص الفطر' },
  cheddar: { en: 'Cheddar', ar: 'شيدر' },
  avocado: { en: 'Avocado', ar: 'أفوكادو' },
  cherryTomato: { en: 'Cherry tomato', ar: 'بندورة كرزية' },
  carrot: { en: 'Carrot', ar: 'جزر' },
  parmesan: { en: 'Parmesan', ar: 'بارميزان' },
  croutons: { en: 'Croutons', ar: 'خبز محمّص' },
  pomegranate: { en: 'Pomegranate', ar: 'رمان' },
  orange: { en: 'Orange', ar: 'برتقال' },
  feta: { en: 'Feta cheese', ar: 'جبنة فيتا' },
  pumpkinSeeds: { en: 'Pumpkin seeds', ar: 'بزر يقطين' },
  walnuts: { en: 'Walnuts', ar: 'جوز' },
  cucumber: { en: 'Cucumber', ar: 'خيار' },
};

const MAINS_ADDONS = ['sides', 'combo'];

export const items = [
  // Appetizers
  {
    id: 'mozzarella-sticks',
    category: 'appetizers',
    name: { en: 'Mozzarella Sticks', ar: 'أصابع موزاريلا' },
    description: {
      en: 'Breaded mozzarella cheese sticks fried until perfectly crisp and gooey inside, served with special dipping sauce.',
      ar: 'أصابع جبنة موزاريلا بالبقسماط، مقلية لتصير مقرمشة من برّا وذايبة من جوّا، مع صوص خاص للتغميس.',
    },
    price: 5.5,
    variants: halfPortion(5.5),
  },
  {
    id: 'chicken-strips',
    category: 'appetizers',
    name: { en: 'Chicken Strips', ar: 'ستريبس دجاج' },
    description: {
      en: 'Crispy breaded chicken strips fried to golden perfection, served with your choice of sauce.',
      ar: 'قطع دجاج بالبقسماط مقلية لحدّ ما تصير ذهبية ومقرمشة، مع الصوص يلّي بتختارو.',
    },
    price: 6,
    variants: halfPortion(6),
    noteHint: { en: 'Which sauce would you like?', ar: 'شو الصوص يلّي بتحبّو؟' },
  },
  {
    id: 'crispy-crab-bites',
    category: 'appetizers',
    name: { en: 'Crispy Crab Bites', ar: 'كراب بايتس مقرمشة' },
    description: {
      en: 'Golden-fried crab bites with a crispy coating and soft center, served with cocktail sauce.',
      ar: 'لقمات كراب مقلية، مقرمشة من برّا وطريّة من جوّا، مع صوص كوكتيل.',
    },
    price: 6,
    variants: halfPortion(6),
  },
  {
    id: 'mixed-wings-basket',
    category: 'appetizers',
    name: { en: 'Mixed Wings Basket', ar: 'سلّة جوانح مشكّلة' },
    description: {
      en: 'An assortment of 12 wings (3 Honey Mustard, 3 BBQ, 3 Buffalo and 3 Plain), served with crunchy fries.',
      ar: '12 جوانح مشكّلة (3 هاني ماسترد، 3 باربكيو، 3 بافلو و3 سادة)، مع بطاطا مقلية مقرمشة.',
    },
    price: 7,
  },
  {
    id: 'crunch-combo',
    category: 'appetizers',
    name: { en: 'Crunch Combo', ar: 'كرانش كومبو' },
    description: {
      en: 'A mix of your favorite bites: 3 crispy crab bites, 3 mozzarella sticks, 3 chicken strips and 3 wings, served with golden potato wedges and your choice of dip on the side.',
      ar: 'تشكيلة من اللقمات المفضّلة: 3 كراب بايتس، 3 أصابع موزاريلا، 3 ستريبس دجاج و3 جوانح، مع ودجز بطاطا ذهبية والصوص يلّي بتختارو عالجنب.',
    },
    price: 12,
    noteHint: { en: 'Which dip would you like?', ar: 'شو الصوص يلّي بتحبّو؟' },
  },
  {
    id: 'small-fries-box',
    category: 'appetizers',
    name: { en: 'Small Fries Box', ar: 'علبة بطاطا صغيرة' },
    description: { en: 'Crispy golden fries, served with ketchup.', ar: 'بطاطا مقلية ذهبية ومقرمشة، مع كاتشب.' },
    price: 2.5,
  },
  {
    id: 'large-fries-box',
    category: 'appetizers',
    name: { en: 'Large Fries Box', ar: 'علبة بطاطا كبيرة' },
    description: {
      en: 'Large portion of crispy golden fries, served with ketchup.',
      ar: 'حصة كبيرة من البطاطا المقلية الذهبية، مع كاتشب.',
    },
    price: 4,
  },
  {
    id: 'wedges-box',
    category: 'appetizers',
    name: { en: 'Wedges Box', ar: 'علبة ودجز' },
    description: { en: 'Seasoned potato wedges, served with cocktail sauce.', ar: 'ودجز بطاطا متبّلة، مع صوص كوكتيل.' },
    price: 3,
  },

  // Sandwiches
  {
    id: 'crispy-chicken-sub',
    category: 'sandwiches',
    name: { en: 'Crispy Chicken Sub', ar: 'كريسبي تشيكن ساب' },
    description: {
      en: 'Crispy chicken, lettuce, corn, garlic mayo, special sauce',
      ar: 'دجاج كريسبي، خس، ذرة، مايونيز بالتوم، صوص خاص',
    },
    price: 5.5,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'corn', 'garlicMayo', 'specialSauce'],
  },
  {
    id: 'spicy-crispy-chicken-sub',
    category: 'sandwiches',
    name: { en: 'Spicy Crispy Chicken Sub', ar: 'سبايسي كريسبي تشيكن ساب' },
    description: {
      en: 'Spicy crispy chicken, lettuce, corn, garlic mayo, special sauce',
      ar: 'دجاج كريسبي حار، خس، ذرة، مايونيز بالتوم، صوص خاص',
    },
    price: 5.5,
    spicy: true,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'corn', 'garlicMayo', 'specialSauce'],
  },
  {
    id: 'crispy-chicken-wrap',
    category: 'sandwiches',
    name: { en: 'Crispy Chicken Wrap', ar: 'كريسبي تشيكن راب' },
    description: {
      en: 'Crispy chicken, lettuce, potato chips, barbecue, garlic mayo',
      ar: 'دجاج كريسبي، خس، شيبس بطاطا، باربكيو، مايونيز بالتوم',
    },
    price: 6,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'potatoChips', 'bbq', 'garlicMayo'],
  },
  {
    id: 'spicy-crispy-chicken-wrap',
    category: 'sandwiches',
    name: { en: 'Spicy Crispy Chicken Wrap', ar: 'سبايسي كريسبي تشيكن راب' },
    description: {
      en: 'Spicy crispy chicken, lettuce, potato chips, BBQ sauce, garlic mayo',
      ar: 'دجاج كريسبي حار، خس، شيبس بطاطا، صوص باربكيو، مايونيز بالتوم',
    },
    price: 6,
    spicy: true,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'potatoChips', 'bbq', 'garlicMayo'],
  },
  {
    id: 'chicken-fajita-sandwich',
    category: 'sandwiches',
    name: { en: 'Chicken Fajita Sandwich', ar: 'سندويش فاهيتا دجاج' },
    description: {
      en: 'Chicken, onion, tricolor pepper, fresh mushroom, corn, mozzarella cheese',
      ar: 'دجاج، بصل، فليفلة ملوّنة، فطر طازج، ذرة، جبنة موزاريلا',
    },
    price: 6.5,
    addons: MAINS_ADDONS,
    removable: ['onion', 'pepper', 'mushroom', 'corn', 'mozzarella'],
  },
  {
    id: 'philly-steak-cheese-sub',
    category: 'sandwiches',
    name: { en: 'Philly Steak & Cheese Sub', ar: 'فيلي ستيك أند تشيز ساب' },
    description: {
      en: 'Beef, onion, tricolor pepper, fresh mushroom, corn, mozzarella cheese',
      ar: 'لحمة، بصل، فليفلة ملوّنة، فطر طازج، ذرة، جبنة موزاريلا',
    },
    price: 6.5,
    addons: MAINS_ADDONS,
    removable: ['onion', 'pepper', 'mushroom', 'corn', 'mozzarella'],
  },
  {
    id: 'steak-mushroom-sandwich',
    category: 'sandwiches',
    name: { en: 'Steak Mushroom Sandwich', ar: 'سندويش ستيك ومشروم' },
    description: {
      en: 'Beef steak, fresh mushroom, onion, mozzarella cheese',
      ar: 'ستيك لحمة، فطر طازج، بصل، جبنة موزاريلا',
    },
    price: 7,
    addons: MAINS_ADDONS,
    removable: ['mushroom', 'onion', 'mozzarella'],
  },
  {
    id: 'grilled-makanik-sandwich',
    category: 'sandwiches',
    name: { en: 'Grilled Makanik Sandwich', ar: 'سندويش مقانق مشوية' },
    description: {
      en: 'Makanik sausage, pomegranate molasses, pickles, tomato, mayo',
      ar: 'مقانق، دبس رمان، كبيس، بندورة، مايونيز',
    },
    price: 4,
    addons: MAINS_ADDONS,
    removable: ['molasses', 'pickles', 'tomato', 'mayo'],
  },
  {
    id: 'spicy-sujuk-sandwich',
    category: 'sandwiches',
    name: { en: 'Spicy Sujuk Sandwich', ar: 'سندويش سجق حار' },
    description: { en: 'Sujuk sausage, pickles, tomato, mayo', ar: 'سجق، كبيس، بندورة، مايونيز' },
    price: 4,
    spicy: true,
    addons: MAINS_ADDONS,
    removable: ['pickles', 'tomato', 'mayo'],
  },
  {
    id: 'lebanese-tawouk-sandwich',
    category: 'sandwiches',
    name: { en: 'Lebanese Tawouk Sandwich', ar: 'سندويش طاووق لبناني' },
    description: {
      en: 'Grilled tawouk, fries, lettuce, pickles, garlic',
      ar: 'طاووق مشوي، بطاطا، خس، كبيس، توم',
    },
    price: 5,
    addons: MAINS_ADDONS,
    removable: ['fries', 'lettuce', 'pickles', 'garlic'],
  },

  // Burgers
  {
    id: 'classic-beef-burger',
    category: 'burgers',
    name: { en: 'Classic Beef Burger', ar: 'كلاسيك بيف برغر' },
    description: {
      en: 'Beef, lettuce, tomato, onion, special sauce',
      ar: 'لحمة، خس، بندورة، بصل، صوص خاص',
    },
    price: 6.5,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'tomato', 'onion', 'specialSauce'],
  },
  {
    id: 'classic-chicken-burger',
    category: 'burgers',
    name: { en: 'Classic Chicken Burger', ar: 'كلاسيك تشيكن برغر' },
    description: {
      en: 'Grilled chicken, lettuce, melted emmental, garlic mayo',
      ar: 'دجاج مشوي، خس، جبنة إيمنتال ذايبة، مايونيز بالتوم',
    },
    price: 6.5,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'emmental', 'garlicMayo'],
  },
  {
    id: 'mozzarella-beef-burger',
    category: 'burgers',
    name: { en: 'Mozzarella Beef Burger', ar: 'موزاريلا بيف برغر' },
    description: {
      en: 'Beef, mozzarella patty, lettuce, onion, mushroom, special sauce',
      ar: 'لحمة، قرص موزاريلا، خس، بصل، فطر، صوص خاص',
    },
    price: 8,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'onion', 'mushroom', 'specialSauce'],
  },
  {
    id: 'zinger-burger',
    category: 'burgers',
    name: { en: 'Zinger Burger', ar: 'زنجر برغر' },
    description: {
      en: 'Crispy chicken, lettuce, garlic mayo, special sauce',
      ar: 'دجاج كريسبي، خس، مايونيز بالتوم، صوص خاص',
    },
    price: 7,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'garlicMayo', 'specialSauce'],
  },
  {
    id: 'spicy-zinger-burger',
    category: 'burgers',
    name: { en: 'Spicy Zinger Burger', ar: 'سبايسي زنجر برغر' },
    description: {
      en: 'Spicy crispy chicken, lettuce, garlic mayo, special sauce',
      ar: 'دجاج كريسبي حار، خس، مايونيز بالتوم، صوص خاص',
    },
    price: 7,
    spicy: true,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'garlicMayo', 'specialSauce'],
  },
  {
    id: 'swiss-mushroom-burger',
    category: 'burgers',
    name: { en: 'Swiss Mushroom Burger', ar: 'سويس مشروم برغر' },
    description: {
      en: 'Beef, lettuce, melted emmental, fresh mushroom, mushroom sauce',
      ar: 'لحمة، خس، جبنة إيمنتال ذايبة، فطر طازج، صوص فطر',
    },
    price: 8,
    addons: MAINS_ADDONS,
    removable: ['lettuce', 'emmental', 'mushroom', 'mushroomSauce'],
  },

  // Smashed Burgers
  {
    id: 'single-smashed',
    category: 'smashed-burgers',
    name: { en: 'Single Smashed', ar: 'سينغل سماشد' },
    description: {
      en: 'Single patty, cheddar slice, special sauce',
      ar: 'قرص لحمة واحد، شريحة شيدر، صوص خاص',
    },
    price: 7,
    addons: MAINS_ADDONS,
    removable: ['cheddar', 'specialSauce'],
  },
  {
    id: 'double-smashed',
    category: 'smashed-burgers',
    name: { en: 'Double Smashed', ar: 'دبل سماشد' },
    description: {
      en: 'Double patty, double cheddar, special sauce',
      ar: 'قرصين لحمة، دبل شيدر، صوص خاص',
    },
    price: 9,
    addons: MAINS_ADDONS,
    removable: ['cheddar', 'specialSauce'],
  },
  {
    id: 'single-oklahoma',
    category: 'smashed-burgers',
    name: { en: 'Single Oklahoma', ar: 'سينغل أوكلاهوما' },
    description: {
      en: 'Single patty, cheddar, onion, special sauce',
      ar: 'قرص لحمة واحد، شيدر، بصل، صوص خاص',
    },
    price: 7.25,
    addons: MAINS_ADDONS,
    removable: ['cheddar', 'onion', 'specialSauce'],
  },
  {
    id: 'double-oklahoma',
    category: 'smashed-burgers',
    name: { en: 'Double Oklahoma', ar: 'دبل أوكلاهوما' },
    description: {
      en: 'Double patty, double cheddar, onion, special sauce',
      ar: 'قرصين لحمة، دبل شيدر، بصل، صوص خاص',
    },
    price: 9.25,
    addons: MAINS_ADDONS,
    removable: ['cheddar', 'onion', 'specialSauce'],
  },

  // Salads
  {
    id: 'fresh-crab-salad',
    category: 'salads',
    name: { en: 'Fresh Crab Salad', ar: 'سلطة كراب' },
    description: {
      en: 'Crab, avocado, cherry tomato, carrot, corn, lettuce, mustard dressing',
      ar: 'كراب، أفوكادو، بندورة كرزية، جزر، ذرة، خس، صلصة خردل',
    },
    price: 8,
    removable: ['avocado', 'cherryTomato', 'carrot', 'corn'],
  },
  {
    id: 'grilled-chicken-caesar-salad',
    category: 'salads',
    name: { en: 'Grilled Chicken Caesar Salad', ar: 'سلطة سيزر بالدجاج المشوي' },
    description: {
      en: 'Grilled chicken, lettuce, parmesan, croutons, Caesar dressing',
      ar: 'دجاج مشوي، خس، بارميزان، خبز محمّص، صلصة سيزر',
    },
    price: 9,
    removable: ['parmesan', 'croutons'],
  },
  {
    id: 'fresh-kale-energy-bowl',
    category: 'salads',
    name: { en: 'Fresh Kale Energy Bowl', ar: 'كايل إنرجي بول' },
    description: {
      en: 'Kale, pomegranate, orange, feta cheese, pumpkin seeds, walnuts, sweet lemon dressing',
      ar: 'كايل، رمان، برتقال، جبنة فيتا، بزر يقطين، جوز، صلصة حامض حلوة',
    },
    price: 9,
    removable: ['pomegranate', 'orange', 'feta', 'pumpkinSeeds', 'walnuts'],
  },
  {
    id: 'seasonal-salad',
    category: 'salads',
    name: { en: 'Seasonal Salad', ar: 'سلطة الموسم' },
    description: {
      en: 'Lettuce, cherry tomato, cucumber, lemon-oil dressing',
      ar: 'خس، بندورة كرزية، خيار، صلصة حامض وزيت',
    },
    price: 5,
    removable: ['cherryTomato', 'cucumber'],
  },

  // Mezza
  { id: 'kibbeh-mekliye', category: 'mezza', name: { en: 'Kibbeh Mekliye', ar: 'كبة مقلية' }, price: 6 },
  { id: 'makanik-bel-fekhara', category: 'mezza', name: { en: 'Makanik bel Fekhara', ar: 'مقانق بالفخارة' }, price: 4 },
  { id: 'sujuk-bel-fekhara', category: 'mezza', name: { en: 'Sujuk bel Fekhara', ar: 'سجق بالفخارة' }, price: 4, spicy: true },
  { id: 'sawdet-djej-bel-fekhara', category: 'mezza', name: { en: 'Sawdet Djej bel Fekhara', ar: 'سودة دجاج بالفخارة' }, price: 4 },
  { id: 'tawouk-bel-fekhara', category: 'mezza', name: { en: 'Tawouk bel Fekhara', ar: 'طاووق بالفخارة' }, price: 5 },
  { id: 'kafta-meshwiyi', category: 'mezza', name: { en: 'Kafta Meshwiyi', ar: 'كفتة مشوية' }, price: 5 },
  { id: 'wings-provencal', category: 'mezza', name: { en: 'Wings Provençal', ar: 'جوانح بروفنسال' }, price: 6 },
  { id: 'batata-harra', category: 'mezza', name: { en: 'Batata Harra', ar: 'بطاطا حرّة' }, price: 3, spicy: true },
  { id: 'batata-meklieh', category: 'mezza', name: { en: 'Batata Meklieh', ar: 'بطاطا مقلية' }, price: 4 },
  { id: 'rkakat-jebneh', category: 'mezza', name: { en: 'Rkakat Jebneh', ar: 'رقاقات جبنة' }, price: 6 },
  { id: 'hommos', category: 'mezza', name: { en: 'Hommos', ar: 'حمّص' }, price: 4 },
  { id: 'green-salad', category: 'mezza', name: { en: 'Green Salad', ar: 'سلطة خضرا' }, price: 4 },

  // Beverages
  { id: 'soft-drinks', category: 'beverages', name: { en: 'Soft Drinks', ar: 'مشروبات غازية' }, price: 1.15, noteHint: { en: 'Which drink would you like?', ar: 'أي مشروب بتحب؟' } },
  { id: 'chilled-ice-tea', category: 'beverages', name: { en: 'Chilled Ice Tea', ar: 'آيس تي' }, price: 1.3 },
  { id: 'sparkling-water', category: 'beverages', name: { en: 'Sparkling Water', ar: 'مياه فوّارة' }, price: 1.3 },
  { id: 'small-bottled-water', category: 'beverages', name: { en: 'Small Bottled Water', ar: 'قنينة مي صغيرة' }, price: 0.5 },
  { id: 'large-bottled-water', category: 'beverages', name: { en: 'Large Bottled Water', ar: 'قنينة مي كبيرة' }, price: 1 },
  { id: 'local-beer', category: 'beverages', name: { en: 'Local Beer', ar: 'بيرة محلية' }, price: 2.5 },
  { id: 'mexican-beer', category: 'beverages', name: { en: 'Mexican Beer', ar: 'بيرة مكسيكية' }, price: 3.5 },
  {
    id: 'wine-bottle',
    category: 'beverages',
    name: { en: 'Wine Bottle', ar: 'قنينة نبيذ' },
    description: { en: 'Red, rosé or white', ar: 'أحمر، روزيه أو أبيض' },
    price: 15,
    choices: {
      id: 'wine',
      name: { en: 'Wine', ar: 'النبيذ' },
      options: [
        { id: 'red', name: { en: 'Red', ar: 'أحمر' } },
        { id: 'rose', name: { en: 'Rosé', ar: 'روزيه' } },
        { id: 'white', name: { en: 'White', ar: 'أبيض' } },
      ],
    },
  },
];

export const itemsById = Object.fromEntries(items.map((item) => [item.id, item]));

export const itemsByCategory = categories.map((category) => ({
  ...category,
  items: items.filter((item) => item.category === category.id),
}));

/** True when the item needs a choice before it can go in the cart. */
export function needsChoice(item) {
  return Boolean(item.variants || item.choices);
}
