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
 *
 * Arabic text containing a price wraps it in \u2066…\u2069 (left-to-right
 * isolate) so "1$" doesn't flip to "$1" inside a right-to-left sentence.
 */

const t = (en, ar) => ({ en, ar })

const sauces = [
  { id: 'ranch', name: t('Ranch', 'رانش') },
  { id: 'honey-mustard', name: t('Honey mustard', 'هاني ماسترد') },
  { id: 'cocktail', name: t('Cocktail', 'كوكتيل') },
]

const sauceChoice = {
  id: 'sauce',
  type: 'single',
  required: true,
  name: t('Choose your homemade sauce', 'اختار الصوص البيتي'),
  options: sauces,
}

const combo = {
  id: 'meal',
  type: 'single',
  required: true,
  listed: true,
  name: t('Make it a combo', 'بدّك ياها كومبو؟'),
  options: [
    { id: 'sandwich', name: t('Burger only', 'برغر بس'), plain: true },
    { id: 'combo', name: t('Combo', 'كومبو'), price: 4 },
  ],
}

const burgerExtras = {
  id: 'extras',
  type: 'multi',
  name: t('Extras', 'إضافات'),
  options: [
    { id: 'extra-cheese', name: t('Extra cheese', 'جبنة إضافية'), price: 1 },
    { id: 'extra-sauce', name: t('Extra sauce', 'صوص إضافي'), price: 0.5 },
  ],
}

const removable = (...items) => ({
  id: 'remove',
  type: 'remove',
  name: t('Leave anything out?', 'بدّك نشيل شي؟'),
  options: items.map(([id, en, ar]) => ({ id, name: t(en, ar) })),
})

export const categories = [
  {
    id: 'appetizers',
    name: t('Appetizers', 'مقبلات'),
    note: t('Homemade sauces: Ranch, Honey mustard, Cocktail', 'صوصات بيتية: رانش، هاني ماسترد، كوكتيل'),
  },
  {
    id: 'burgers',
    name: t('Burgers', 'برغر'),
    note: t('Extra cheese 1$  ·  Extra sauce 0.5$', 'جبنة إضافية \u20661$\u2069  ·  صوص إضافي \u20660.5$\u2069'),
  },
  {
    id: 'desserts',
    name: t('Desserts', 'حلويات'),
    by: 'Caketime',
  },
  {
    id: 'drinks',
    name: t('Drinks', 'مشروبات'),
  },
]

export const menuItems = [
  // Appetizers
  {
    id: 'mozzarella-sticks',
    category: 'appetizers',
    name: t('Mozzarella Sticks (4 pcs)', 'موزاريلا ستيكس (4 قطع)'),
    description: t(
      'Fresh mozzarella cheese fried to perfection, served with your choice of our homemade sauces',
      'جبنة موزاريلا طازجة مقليّة على أصولها، مع صوص من اختيارك من صوصاتنا البيتية',
    ),
    price: 6,
    image: '/images/mozzarella-sticks.webp',
    groups: [sauceChoice],
  },
  {
    id: 'onion-rings',
    category: 'appetizers',
    name: t('Onion Rings (8 pcs)', 'أونيون رينغز (8 قطع)'),
    description: t(
      'Fresh fried hand cut onions, served with your choice of our homemade sauces',
      'بصل طازج مقطّع عالإيد ومقلي، مع صوص من اختيارك من صوصاتنا البيتية',
    ),
    price: 6,
    groups: [sauceChoice],
  },
  {
    id: 'wings',
    category: 'appetizers',
    name: t('Wings / Boneless (6 or 9 pcs)', 'وينغز / بونلس (6 أو 9 قطع)'),
    description: t(
      'Choose from Buffalo, BBQ or honey mustard, dipped or on the side. Served with ranch, cocktail or honey mustard',
      'اختار بافلو، باربكيو أو هاني ماسترد، مغمّسين أو عالجنب. بينخدموا مع رانش، كوكتيل أو هاني ماسترد',
    ),
    price: 7,
    image: '/images/wings.webp',
    groups: [
      {
        id: 'cut',
        type: 'single',
        required: true,
        name: t('Wings or boneless', 'وينغز أو بونلس'),
        options: [
          { id: 'wings', name: t('Wings', 'وينغز') },
          { id: 'boneless', name: t('Boneless', 'بونلس') },
        ],
      },
      {
        id: 'size',
        type: 'single',
        required: true,
        listed: true,
        name: t('How many pieces', 'قدّيش قطعة'),
        options: [
          { id: '6', name: t('6 pcs', '6 قطع'), plain: true },
          { id: '9', name: t('9 pcs', '9 قطع'), price: 3 },
        ],
      },
      {
        id: 'flavour',
        type: 'single',
        required: true,
        name: t('Flavour', 'النكهة'),
        options: [
          { id: 'buffalo', name: t('Buffalo', 'بافلو') },
          { id: 'bbq', name: t('BBQ', 'باربكيو') },
          { id: 'honey-mustard', name: t('Honey mustard', 'هاني ماسترد') },
        ],
      },
      {
        id: 'style',
        type: 'single',
        required: true,
        name: t('Sauce on the wings', 'الصوص'),
        options: [
          { id: 'dipped', name: t('Dipped', 'مغمّسين') },
          { id: 'side', name: t('On the side', 'عالجنب') },
        ],
      },
      {
        id: 'dip',
        type: 'single',
        required: true,
        name: t('Served with', 'بينخدموا مع'),
        options: [
          { id: 'ranch', name: t('Ranch', 'رانش') },
          { id: 'cocktail', name: t('Cocktail', 'كوكتيل') },
          { id: 'honey-mustard', name: t('Honey mustard', 'هاني ماسترد') },
        ],
      },
    ],
  },
  {
    id: 'house-fries',
    category: 'appetizers',
    name: t('House Fries', 'هاوس فرايز'),
    description: t(
      'Seasoned with MOODS spices and served with cocktail sauce',
      'متبّلة ببهارات MOODS وبتنخدم مع صوص كوكتيل',
    ),
    price: 4,
  },
  {
    id: 'caesar-salad',
    category: 'appetizers',
    name: t('Caesar Salad', 'سلطة سيزر'),
    description: t(
      'Fresh romaine lettuce, croutons, parmesan, Caesar dressing',
      'خس روماني طازج، كروتون، بارميزان وصوص سيزر',
    ),
    price: 6,
    groups: [
      {
        id: 'add',
        type: 'multi',
        name: t('Add', 'زيد'),
        options: [{ id: 'chicken', name: t('Add chicken', 'زيد دجاج'), price: 3 }],
      },
      removable(['croutons', 'Croutons', 'كروتون'], ['parmesan', 'Parmesan', 'بارميزان']),
    ],
  },

  // Burgers
  {
    id: 'the-smasher',
    category: 'burgers',
    name: t('The Smasher', 'ذا سماشر'),
    description: t(
      '2x smashed beef, cheddar cheese, pickles, onions and our special sauce',
      'قطعتين لحمة سماش، جبنة شيدر، كبيس، بصل وصوصنا الخاص',
    ),
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
        name: t('Patties', 'عدد القطع'),
        options: [
          { id: 'double', name: t('Double patty', 'دبل'), plain: true },
          { id: 'triple', name: t('Triple patty', 'تريبل'), price: 2 },
        ],
      },
      combo,
      burgerExtras,
      removable(
        ['cheddar', 'Cheddar cheese', 'جبنة شيدر'],
        ['pickles', 'Pickles', 'كبيس'],
        ['onions', 'Onions', 'بصل'],
        ['special-sauce', 'Special sauce', 'الصوص الخاص'],
      ),
    ],
  },
  {
    id: 'swiss-shroom',
    category: 'burgers',
    name: t('Swiss Shroom', 'سويس شروم'),
    description: t(
      'Beef patty, swiss cheese, sautéed mushrooms, onion, mayo',
      'قطعة لحمة، جبنة سويسرية، فطر سوتيه، بصل ومايونيز',
    ),
    price: 9,
    image: '/images/swiss-shroom.webp',
    imageStyle: 'studio',
    featured: true,
    groups: [
      combo,
      burgerExtras,
      removable(
        ['swiss', 'Swiss cheese', 'جبنة سويسرية'],
        ['mushrooms', 'Mushrooms', 'فطر'],
        ['onion', 'Onion', 'بصل'],
        ['mayo', 'Mayo', 'مايونيز'],
      ),
    ],
  },
  {
    id: 'grilled-chick',
    category: 'burgers',
    name: t('Grilled Chick', 'غريلد تشيك'),
    description: t(
      'Grilled chicken, iceberg lettuce, tomato, red onions and mayo',
      'دجاج مشوي، خس آيسبرغ، بندورة، بصل أحمر ومايونيز',
    ),
    price: 8,
    image: '/images/grilled-chick.webp',
    featured: true,
    groups: [
      combo,
      burgerExtras,
      removable(
        ['lettuce', 'Iceberg lettuce', 'خس آيسبرغ'],
        ['tomato', 'Tomato', 'بندورة'],
        ['red-onions', 'Red onions', 'بصل أحمر'],
        ['mayo', 'Mayo', 'مايونيز'],
      ),
    ],
  },
  {
    id: 'fried-chick',
    category: 'burgers',
    name: t('Fried Chick', 'فرايد تشيك'),
    description: t(
      'Crispy chicken breast, pickles, shredded lettuce, special sauce',
      'صدر دجاج مقرمش، كبيس، خس مفروم وصوص خاص',
    ),
    price: 8,
    image: '/images/fried-chick.webp',
    imageStyle: 'studio',
    featured: true,
    groups: [
      combo,
      burgerExtras,
      removable(
        ['pickles', 'Pickles', 'كبيس'],
        ['lettuce', 'Shredded lettuce', 'خس مفروم'],
        ['special-sauce', 'Special sauce', 'الصوص الخاص'],
      ),
    ],
  },

  // Desserts by Caketime
  {
    id: 'cookie',
    category: 'desserts',
    name: t('Cookie (1 pc)', 'كوكي (قطعة)'),
    price: 3,
  },
  {
    id: 'smores',
    category: 'desserts',
    name: t('S’mores (2 pcs)', 'سمورز (قطعتين)'),
    description: t(
      'Butter biscuit, flamed marshmallow, chocolate spread',
      'بسكوت بالزبدة، مارشميلو محروق وسبريد شوكولا',
    ),
    price: 4,
  },
  {
    id: 'burger-cupcake',
    category: 'desserts',
    name: t('Burger Cupcake', 'برغر كب كيك'),
    description: t('Upside down cupcake', 'كب كيك مقلوب'),
    price: 3.5,
  },

  // Drinks
  {
    id: 'pepsi',
    category: 'drinks',
    name: t('Pepsi / Diet', 'بيبسي / دايت'),
    price: 1.2,
    groups: [
      {
        id: 'type',
        type: 'single',
        required: true,
        name: t('Regular or diet', 'عادي أو دايت'),
        options: [
          { id: 'regular', name: t('Pepsi', 'بيبسي') },
          { id: 'diet', name: t('Diet Pepsi', 'بيبسي دايت') },
        ],
      },
    ],
  },
  { id: 'mirinda', category: 'drinks', name: t('Miranda', 'ميرندا'), price: 1.2 },
  {
    id: '7up',
    category: 'drinks',
    name: t('7Up / Diet', 'سفن أب / دايت'),
    price: 1.2,
    groups: [
      {
        id: 'type',
        type: 'single',
        required: true,
        name: t('Regular or diet', 'عادي أو دايت'),
        options: [
          { id: 'regular', name: t('7Up', 'سفن أب') },
          { id: 'diet', name: t('Diet 7Up', 'سفن أب دايت') },
        ],
      },
    ],
  },
  { id: 'iced-tea', category: 'drinks', name: t('Iced Tea', 'آيس تي'), price: 1.5 },
  { id: 'water', category: 'drinks', name: t('Water', 'مي'), price: 0.6 },
]

/** "Order the full menu for 65$ — excluding combos and drinks." */
export const fullMenuOffer = {
  id: 'full-menu',
  category: 'offer',
  name: t('The Full Menu', 'المنيو كلّو'),
  description: t(
    'Everything on our menu, excluding combos and drinks.',
    'كل المنيو، ما عدا الكومبو والمشروبات.',
  ),
  price: 65,
}

const allItems = [...menuItems, fullMenuOffer]

export const getItem = (id) => allItems.find((item) => item.id === id)
