/**
 * Kuku Chix Joint — full menu.
 *
 * Names, prices, struck-through prices and English descriptions are copied
 * exactly from the restaurant's ordering page (kuku.moviyum.com).
 * Arabic descriptions are translations of the English text.
 *
 * To change a price: edit `price`. To hide an item: delete its object.
 * Items with a `verify` note had part of their text hidden in the
 * screenshots — double-check them against the live menu.
 */
import type { Category, Localized, MenuItem, OptionGroup } from './types'
import { restaurant } from '../config/restaurant'

export const categories: Category[] = [
  { id: 'bundles', name: { en: 'Bundles', ar: 'البوكسات' }, blurb: { en: 'Built for sharing, priced to make sense.', ar: 'للمشاركة، وبأسعار منطقية.' } },
  { id: 'starters', name: { en: 'Starters', ar: 'المقبلات' } },
  { id: 'mac-mania', name: { en: 'Mac Mania', ar: 'ماك مانيا' } },
  { id: 'deluxe-fries', name: { en: 'Deluxe Fries', ar: 'بطاطا ديلوكس' } },
  { id: 'finest-burgers', name: { en: 'Finest Burgers', ar: 'أفخم البرغر' } },
  { id: 'grilled-bliss', name: { en: 'Grilled Bliss', ar: 'المشاوي' } },
  { id: 'kids-meal', name: { en: 'Kids Meal', ar: 'وجبات الأطفال' } },
  { id: 'combos-extras', name: { en: 'Combos & Extras', ar: 'كومبو وإضافات' } },
  { id: 'sauce-boss', name: { en: 'Sauce Boss', ar: 'الصلصات' } },
  { id: 'pudding', name: { en: 'Pudding', ar: 'بودينغ' } },
  { id: 'drinks', name: { en: 'Drinks', ar: 'المشروبات' } },
]

/* ---------- ingredient vocabulary (used for "remove" options) ---------- */
const I = {
  lettuce: { en: 'Iceberg Lettuce', ar: 'خس آيسبرغ' },
  pickles: { en: 'Dill Pickles', ar: 'مخلل' },
  jalapenos: { en: 'Jalapeños', ar: 'هالبينو' },
  cheddarSauce: { en: 'Cheddar Sauce', ar: 'صلصة الشيدر' },
  kukuSauce: { en: "KUKU's Signature Sauce", ar: 'صلصة كوكو الخاصة' },
  ranch: { en: 'Ranch Sauce', ar: 'صلصة الرانش' },
  samurai: { en: 'Spicy Samurai Sauce', ar: 'صلصة ساموراي الحارة' },
  habanero: { en: 'Habanero Sauce', ar: 'صلصة الهابانيرو' },
  crispyOnions: { en: 'Crispy Onions', ar: 'بصل مقرمش' },
  cheddarPatty: { en: 'Cheddar Patty', ar: 'قرص الشيدر' },
  coleslaw: { en: 'Coleslaw', ar: 'كول سلو' },
  mozzPatty: { en: 'Mozzarella Patty', ar: 'قرص الموزاريلا' },
  tomatoes: { en: 'Tomatoes', ar: 'بندورة' },
  onions: { en: 'Fresh Onions', ar: 'بصل طازج' },
  honeyBunny: { en: 'Honey Bunny Sauce', ar: 'صلصة هاني باني' },
  swiss: { en: 'Swiss Cheese', ar: 'جبنة سويسرية' },
  aioli: { en: 'Aioli', ar: 'أيولي' },
  arugula: { en: 'Arugula', ar: 'جرجير' },
  mushrooms: { en: 'Sauteed Mushrooms', ar: 'فطر سوتيه' },
  pineapple: { en: 'Sauteed Exotic Pineapples', ar: 'أناناس سوتيه' },
  mushroomSauce: { en: 'Mushroom Sauce', ar: 'صلصة الفطر' },
  cheddarPearls: { en: 'Cheddar Pearls', ar: 'كرات الشيدر' },
  meltedCheddar: { en: 'Melted Cheddar', ar: 'شيدر ذائب' },
  bbq: { en: 'BBQ Sauce', ar: 'صلصة باربكيو' },
  maple: { en: 'Maple Sauce', ar: 'صلصة القيقب' },
  buffalo: { en: 'Buffalo Sauce', ar: 'صلصة بافلو' },
} satisfies Record<string, Localized>

/* ---------- shared option groups ---------- */

/** The eight sauces from the "Sauce Boss" section. */
const sauceChoices = [
  { id: 'aioli', label: { en: 'Aioli', ar: 'أيولي' } },
  { id: 'kukus', label: { en: "Kuku's", ar: 'كوكو' } },
  { id: 'ranch', label: { en: 'Ranch', ar: 'رانش' } },
  { id: 'habanero', label: { en: 'Habanero', ar: 'هابانيرو' } },
  { id: 'honey-bunny', label: { en: 'Honey Bunny', ar: 'هاني باني' } },
  { id: 'honey-bbq', label: { en: 'Honey BBQ', ar: 'هاني باربكيو' } },
  { id: 'spicy-samurai', label: { en: 'Spicy Samurai', ar: 'ساموراي حار' } },
  { id: 'honey-maple', label: { en: 'Honey Maple', ar: 'هاني مايبل' } },
]

const includedSauces = (n: number): OptionGroup => ({
  id: 'included-sauces',
  label: { en: `Your ${n} sauces`, ar: `اختر ${n} صلصات` },
  hint: { en: `Included — pick ${n}`, ar: `مشمولة — اختر ${n}` },
  type: 'count',
  required: true,
  min: n,
  max: n,
  choices: sauceChoices,
})

const freeDip: OptionGroup = {
  id: 'free-dip',
  label: { en: 'Free 2 oz dip', ar: 'صلصة مجانية ٢ أونصة' },
  type: 'single',
  required: true,
  choices: sauceChoices,
}

/** Flavours listed on Strips and Chicken Wings. */
const dippedIn: OptionGroup = {
  id: 'dipped-in',
  label: { en: 'Dipped in', ar: 'مغمّسة بـ' },
  type: 'single',
  required: true,
  choices: [
    { id: 'buffalo', label: { en: 'Buffalo', ar: 'بافلو' } },
    { id: 'honey-bbq', label: { en: 'Honey BBQ', ar: 'هاني باربكيو' } },
    { id: 'honey-bunny', label: { en: 'Honey Bunny', ar: 'هاني باني' } },
    { id: 'honey-chipotle', label: { en: 'Honey Chipotle', ar: 'هاني شيبوتلي' } },
    { id: 'honey-maple', label: { en: 'Honey Maple', ar: 'هاني مايبل' } },
    { id: 'nashville', label: { en: 'Nashville', ar: 'ناشفيل' } },
  ],
}

const spiceLevel: OptionGroup = {
  id: 'spice-level',
  label: { en: 'Spice level', ar: 'درجة الحرّ' },
  type: 'single',
  required: true,
  choices: restaurant.spiceLevels.map((s) => ({ id: s.id, label: { en: s.en, ar: s.ar } })),
}

/** Paid extras — priced exactly as their own menu entries. */
const extraSauces: OptionGroup = {
  id: 'extra-sauces',
  label: { en: 'Extra sauces', ar: 'صلصات إضافية' },
  hint: { en: '$1.00 each, 2 oz', ar: '١٫٠٠$ للواحدة، ٢ أونصة' },
  type: 'count',
  max: 6,
  choices: sauceChoices.map((c) => ({ ...c, price: 1 })),
}

const brioche: OptionGroup = {
  id: 'brioche',
  label: { en: 'Add a side', ar: 'أضف جانبياً' },
  type: 'multi',
  max: 1,
  choices: [{ id: 'butter-grilled-brioche', label: { en: 'Butter-Grilled Brioche', ar: 'بريوش مشوي بالزبدة' }, price: 1.5 }],
}

const drinkHint: Localized = { en: 'Which soft drink would you like?', ar: 'أي مشروب غازي تفضّل؟' }
const minisHint: Localized = { en: 'Tell us which mini burgers you want', ar: 'أخبرنا أي ميني برغر تريد' }

/* ---------- items ---------- */

export const menu: MenuItem[] = [
  // BUNDLES
  {
    id: 'abou-kukus-combo', category: 'bundles', name: "ABOU KUKU's COMBO", price: 23, compareAt: 30.6, image: 'abou-kukus-combo',
    description: {
      en: '8 Wings. 4 Strips. 2 Mac n Cheese. 2 Nashville Mozzarella Bricks. Fries. 4 Sauces. (Perfect for two people or more)',
      ar: '٨ وينغز، ٤ ستريبس، ٢ ماك أند تشيز، ٢ أصابع موزاريلا ناشفيل، بطاطا و٤ صلصات. (مثالي لشخصين أو أكثر)',
    },
    options: [includedSauces(4), extraSauces],
  },
  {
    id: 'crispy-meal', category: 'bundles', name: 'CRISPY MEAL', price: 11, compareAt: 14.65, image: 'crispy-meal',
    description: {
      en: '5 Chkn Strips, Fries, Coleslaw, Toast Brioche, Cheddar & Aioli Dip.',
      ar: '٥ ستريبس دجاج، بطاطا، كول سلو، توست بريوش، وصلصتا شيدر وأيولي.',
    },
    options: [extraSauces],
  },
  {
    id: 'the-burger-combo', category: 'bundles', name: 'THE BURGER COMBO', price: 15, compareAt: 18.5, image: 'the-burger-combo',
    description: {
      en: "Any burger of your choice, served with crispy fries, a Mozzarella Brick, and a side of creamy Mac 'n Cheese. Comes with 2 sauces of your choice.",
      ar: 'أي برغر تختاره، مع بطاطا مقرمشة، إصبع موزاريلا وجانب من الماك أند تشيز الكريمي. مع صلصتين من اختيارك.',
    },
    verify: 'Menu does not say whether pricier burgers cost extra in this combo.',
    options: [
      {
        id: 'burger', label: { en: 'Your burger', ar: 'البرغر' }, type: 'single', required: true,
        choices: ['Classic', 'Ranch', 'Risky', 'Maple', 'Nasty', 'Buffalo Bomb', 'BBQ Freak', 'Honey Trap', 'Nashvillicious', 'Ranch Royal', 'Heatwave', 'Bee Glory', 'Shroom Lord']
          .map((n) => ({ id: n.toLowerCase().replace(/\s+/g, '-'), label: { en: n, ar: n } })),
      },
      includedSauces(2),
      extraSauces,
    ],
  },
  {
    id: 'nerdy-bundle-2-minis', category: 'bundles', name: "NERDY BUNDLE | 2 MINI's", price: 14, compareAt: 17, image: 'nerdy-bundle-2-minis',
    description: {
      en: 'Pick any 2 Mini Burgers, served with classic fries, 1 Mozzarella Brick, 3 Mini Corn Ribs and 2 sauces.',
      ar: 'اختر أي ٢ ميني برغر، مع بطاطا كلاسيك، إصبع موزاريلا، ٣ قطع ذرة ميني وصلصتين.',
    },
    notesHint: minisHint,
    options: [includedSauces(2), extraSauces],
  },
  {
    id: 'ez-bundle-4-minis', category: 'bundles', name: "E Z BUNDLE | 4 MINI's", price: 26, compareAt: 30.5, image: 'ez-bundle-4-minis',
    description: {
      en: 'Pick any 4 Mini Burgers, served with classic fries, 2 Mozzarella Bricks, 6 Mini Corn Ribs and 4 sauces.',
      ar: 'اختر أي ٤ ميني برغر، مع بطاطا كلاسيك، ٢ أصابع موزاريلا، ٦ قطع ذرة ميني و٤ صلصات.',
    },
    notesHint: minisHint,
    options: [includedSauces(4), extraSauces],
  },
  {
    id: 'no-brainer-bundle-9-minis', category: 'bundles', name: "NO BRAINER BUNDLE | 9 MINI's", price: 55, compareAt: 66.1, image: 'no-brainer-bundle-9-minis',
    description: {
      en: 'Pick any 9 Mini Burgers, served with classic fries, curly fries, 4 Mozzarella Bricks, 12 Mini Corn Ribs, and 4 sauces.',
      ar: 'اختر أي ٩ ميني برغر، مع بطاطا كلاسيك، بطاطا كيرلي، ٤ أصابع موزاريلا، ١٢ قطعة ذرة ميني و٤ صلصات.',
    },
    notesHint: minisHint,
    options: [includedSauces(4), extraSauces],
  },

  // STARTERS
  {
    id: 'nashville-mozzarella-bricks', category: 'starters', name: 'NASHVILLE MOZZARELLA BRICKS', price: 7.5, image: 'nashville-mozzarella-bricks',
    description: {
      en: 'Two Nashville Mega Mozzarella Sticks with 2 oz. free dip (Choose your spice level!)',
      ar: 'إصبعا موزاريلا ميغا على طريقة ناشفيل مع صلصة مجانية ٢ أونصة (اختر درجة الحرّ!)',
    },
    options: [spiceLevel, freeDip, extraSauces],
  },
  {
    id: 'nashville-jalapenos-bites', category: 'starters', name: 'NASHVILLE JALAPENOS BITES', price: 5.5, image: 'nashville-jalapenos-bites',
    description: {
      en: 'Two Mega Nashville Jalapenos Bites with 2 oz. free dip. (Choose your Spice Level!)',
      ar: 'قطعتا هالبينو ميغا على طريقة ناشفيل مع صلصة مجانية ٢ أونصة. (اختر درجة الحرّ!)',
    },
    options: [spiceLevel, freeDip, extraSauces],
  },
  {
    id: 'strips', category: 'starters', name: 'STRIPS', price: 6.5, image: 'strips',
    description: {
      en: 'FOUR Chkn Strips dipped with your choice of: Buffalo, Honey BBQ, Honey Bunny, Honey Chipotle, Honey Maple, or Nashville -- Comes with 2 oz. free dip',
      ar: 'أربع ستريبس دجاج مغمّسة بالنكهة التي تختارها: بافلو، هاني باربكيو، هاني باني، هاني شيبوتلي، هاني مايبل أو ناشفيل — مع صلصة مجانية ٢ أونصة.',
    },
    options: [dippedIn, freeDip, brioche, extraSauces],
  },
  {
    id: 'kukus-chix', category: 'starters', name: "KUKU's CHIX", price: 12, image: 'kukus-chix',
    description: {
      en: 'Two breaded Chkn Steaks, brushed with our infused HOT butter-oil and coated with our signature Nashville Spices. Includes 2 "4oz" Dipping Sauce -- CHOOSE your spice level!',
      ar: 'قطعتا ستيك دجاج مقرمشتان، مدهونتان بزيت الزبدة الحار الخاص بنا ومغطّاتان ببهارات ناشفيل المميزة. مع صلصتي تغميس ٤ أونصة — اختر درجة الحرّ!',
    },
    verify: 'Includes 2 x 4oz dipping sauces — modeled as "pick 2" from the sauce list.',
    options: [spiceLevel, includedSauces(2), brioche, extraSauces],
  },
  {
    id: 'chicken-wings', category: 'starters', name: 'CHICKEN WINGS', price: 6.8, image: 'chicken-wings',
    description: {
      en: 'EIGHT Chkn wings dipped with your choice of: Buffalo, Honey BBQ, Honey Bunny, Honey Chipotle, Honey Maple, or Nashville -- Comes with 2 oz. free dip',
      ar: 'ثمانية أجنحة دجاج مغمّسة بالنكهة التي تختارها: بافلو، هاني باربكيو، هاني باني، هاني شيبوتلي، هاني مايبل أو ناشفيل — مع صلصة مجانية ٢ أونصة.',
    },
    verify: 'Second half of the description was hidden; assumed identical to Strips.',
    options: [dippedIn, freeDip, extraSauces],
  },
  {
    id: 'holy-stripinity', category: 'starters', name: 'HOLY STRIPINITY', price: 8, image: 'holy-stripinity',
    description: {
      en: 'A holy trio of Nashville hot chicken strips on buttery brioche toast, diced dill pickles & Jalapenos, served with ranch, honey bunny, and honey maple dip.',
      ar: 'ثلاثية مقدّسة من ستريبس دجاج ناشفيل الحار على توست بريوش بالزبدة، مع مخلل وهالبينو مقطّع، تُقدَّم مع صلصات الرانش والهاني باني والهاني مايبل.',
    },
    removable: [I.pickles, I.jalapenos],
    options: [extraSauces],
  },
  {
    id: 'mini-corn-ribs', category: 'starters', name: 'MINI CORN RIBS', price: 3.8, image: 'mini-corn-ribs',
    description: {
      en: '6 mini corn ribs hit with Nashville heat, served with a cool ranch dip.',
      ar: '٦ قطع ذرة ميني بحرارة ناشفيل، تُقدَّم مع صلصة رانش باردة.',
    },
    options: [extraSauces],
  },

  // MAC MANIA
  {
    id: 'original-mac', category: 'mac-mania', name: 'ORIGINAL MAC', price: 10, image: 'original-mac',
    description: {
      en: "Cavatappi Pasta, Cheese Blend, Chkn Pops & KUKU's Signature Sauce.",
      ar: 'معكرونة كافاتابي، مزيج أجبان، قطع دجاج بوب وصلصة كوكو الخاصة.',
    },
    removable: [I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'sweet-n-fire-mac', category: 'mac-mania', name: "SWEET N' FIRE MAC", price: 12, image: 'sweet-n-fire-mac',
    description: {
      en: 'Cavatappi Pasta, Cheese Blend, Nashville Chkn Pops, Diced Jalapeños, Honey Bunny, Spicy Samurai & Ranch Sauce.',
      ar: 'معكرونة كافاتابي، مزيج أجبان، قطع دجاج بوب ناشفيل، هالبينو مقطّع، صلصات هاني باني وساموراي الحارة والرانش.',
    },
    removable: [I.jalapenos, I.honeyBunny, I.samurai, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'ranch-rush-mac', category: 'mac-mania', name: 'RANCH RUSH MAC', price: 12, image: 'ranch-rush-mac',
    description: {
      en: "Cavatappi Pasta, Cheese Blend, Chkn Pops, Crispy Onions, Dill Pickles, Ranch & KUKU's Signature Sauce.",
      ar: 'معكرونة كافاتابي، مزيج أجبان، قطع دجاج بوب، بصل مقرمش، مخلل، صلصة رانش وصلصة كوكو الخاصة.',
    },
    removable: [I.crispyOnions, I.pickles, I.ranch, I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'side-mac', category: 'mac-mania', name: 'SIDE MAC', price: 3, image: 'side-mac',
    description: {
      en: "8 Oz of Creamy, Mouth-watering Mac n' Cheese.",
      ar: '٨ أونصة من الماك أند تشيز الكريمي اللذيذ.',
    },
  },

  // DELUXE FRIES
  {
    id: 'heroes-fries', category: 'deluxe-fries', name: 'HEROES FRIES', price: 8.5, image: 'heroes-fries',
    description: {
      en: "Crispy Fries, Chkn Pops, Melted Cheddar, Dill Pickles, Ranch & KUKU's Signature.",
      ar: 'بطاطا مقرمشة، قطع دجاج بوب، شيدر ذائب، مخلل، رانش وصلصة كوكو الخاصة.',
    },
    removable: [I.pickles, I.ranch, I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'habaneros-fries', category: 'deluxe-fries', name: 'HABANEROS FRIES', price: 8.5, image: 'habaneros-fries',
    description: {
      en: 'Crispy Fries, Chkn Pops, Melted Cheddar, Diced Jalapeños, Crispy Onions, Spicy Samurai & Habaneros Sauce.',
      ar: 'بطاطا مقرمشة، قطع دجاج بوب، شيدر ذائب، هالبينو مقطّع، بصل مقرمش، صلصة ساموراي الحارة وصلصة الهابانيرو.',
    },
    removable: [I.jalapenos, I.crispyOnions, I.samurai, I.habanero],
    options: [extraSauces],
  },
  {
    id: 'healers-fries', category: 'deluxe-fries', name: 'HEALERS FRIES', price: 10, image: 'healers-fries',
    description: {
      en: 'Crispy Fries, Chkn Pops, Cavatappi Pasta, Cheese Blend, Melted Cheddar, Cheddar Pearls, Crispy Onions, Honey Bunny & Ranch Sauce.',
      ar: 'بطاطا مقرمشة، قطع دجاج بوب، معكرونة كافاتابي، مزيج أجبان، شيدر ذائب، كرات الشيدر، بصل مقرمش، صلصة هاني باني ورانش.',
    },
    removable: [I.cheddarPearls, I.crispyOnions, I.honeyBunny, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'regular-fries', category: 'deluxe-fries', name: 'REGULAR FRIES', price: 3, image: 'regular-fries',
    description: { en: "Comes with Kuku's Sauce.", ar: 'تُقدَّم مع صلصة كوكو.' },
    options: [extraSauces],
  },
  {
    id: 'curly-fries', category: 'deluxe-fries', name: 'CURLY FRIES', price: 4, image: 'curly-fries',
    description: { en: 'Comes with a Cheddar Dip', ar: 'تُقدَّم مع صلصة الشيدر.' },
    options: [extraSauces],
  },

  // FINEST BURGERS
  {
    id: 'classic', category: 'finest-burgers', name: 'CLASSIC', price: 7, image: 'classic',
    description: {
      en: "Iceberg Lettuce, Dill Pickles, Batter-Fried Chix, Cheddar Sauce & KUKU's Signature Sauce.",
      ar: 'خس آيسبرغ، مخلل، دجاج مقلي بالخليط، صلصة الشيدر وصلصة كوكو الخاصة.',
    },
    removable: [I.lettuce, I.pickles, I.cheddarSauce, I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'ranch', category: 'finest-burgers', name: 'RANCH', price: 0, image: 'ranch',
    description: {
      en: 'Iceberg Lettuce, Dill Pickles, Batter-Fried Chix, Cheddar Patty, Ranch, Maple, Buffalo & Honey Bunny Sauce.',
      ar: 'خس آيسبرغ، مخلل، دجاج مقلي بالخليط، قرص الشيدر، صلصات رانش، مايبل، بافلو وهاني باني.',
    },
    verify: 'PRICE MISSING — the price row was cut off in every screenshot. Set `price` (0 = shown as "Ask us" and not orderable). Description also partly hidden.',
    removable: [I.lettuce, I.pickles, I.cheddarPatty],
    options: [extraSauces],
  },
  {
    id: 'risky', category: 'finest-burgers', name: 'RISKY', price: 8.5, image: 'risky',
    description: {
      en: 'Iceberg Lettuce, Jalapeños, Batter-Fried Chix, Cheddar Sauce, Spicy Samurai & Habanero Sauce.',
      ar: 'خس آيسبرغ، هالبينو، دجاج مقلي بالخليط، صلصة الشيدر، صلصة ساموراي الحارة وصلصة الهابانيرو.',
    },
    removable: [I.lettuce, I.jalapenos, I.cheddarSauce, I.samurai, I.habanero],
    options: [extraSauces],
  },
  {
    id: 'maple', category: 'finest-burgers', name: 'MAPLE', price: 8.8, image: 'maple',
    description: {
      en: 'Iceberg Lettuce, Dill Pickles, Batter-Fried Chix Dipped in Honey-Maple Sauce, Crispy Onions, Cheddar Sauce & Ranch Sauce.',
      ar: 'خس آيسبرغ، مخلل، دجاج مقلي مغمّس بصلصة العسل والقيقب، بصل مقرمش، صلصة الشيدر وصلصة الرانش.',
    },
    removable: [I.lettuce, I.pickles, I.crispyOnions, I.cheddarSauce, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'nasty', category: 'finest-burgers', name: 'NASTY', price: 8, image: 'nasty',
    description: {
      en: 'Iceberg Lettuce, Dill Pickles, Batter-Fried Chix, Cheddar Sauce, Cheddar Pearls, Honey Bunny & Spicy Samurai Sauce.',
      ar: 'خس آيسبرغ، مخلل، دجاج مقلي بالخليط، صلصة الشيدر، كرات الشيدر، صلصة هاني باني وصلصة ساموراي الحارة.',
    },
    verify: 'Description start was partly hidden — confirm.',
    removable: [I.lettuce, I.pickles, I.cheddarSauce, I.cheddarPearls, I.honeyBunny, I.samurai],
    options: [extraSauces],
  },
  {
    id: 'buffalo-bomb', category: 'finest-burgers', name: 'BUFFALO BOMB', price: 7.8, image: 'buffalo-bomb',
    description: {
      en: 'Iceberg Lettuce, Jalapenos, Batter-Fried Chix Dipped in Buffalo Sauce, Cheddar Sauce, Spicy Samurai & Ranch Sauce.',
      ar: 'خس آيسبرغ، هالبينو، دجاج مقلي مغمّس بصلصة البافلو، صلصة الشيدر، صلصة ساموراي الحارة وصلصة الرانش.',
    },
    removable: [I.lettuce, I.jalapenos, I.cheddarSauce, I.samurai, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'bbq-freak', category: 'finest-burgers', name: 'BBQ FREAK', price: 8.8, image: 'bbq-freak',
    description: {
      en: 'Mozzarella Patty, Batter-Fried Chix Dipped in Honey BBQ Sauce, Cheddar Sauce & Honey Bunny Sauce.',
      ar: 'قرص موزاريلا، دجاج مقلي مغمّس بصلصة هاني باربكيو، صلصة الشيدر وصلصة هاني باني.',
    },
    removable: [I.mozzPatty, I.cheddarSauce, I.honeyBunny],
    options: [extraSauces],
  },
  {
    id: 'honey-trap', category: 'finest-burgers', name: 'HONEY TRAP', price: 9.2, image: 'honey-trap',
    description: {
      en: 'Mozzarella Patty, Batter-Fried Chix Dipped in Honey Bunny Sauce, Cheddar Sauce & BBQ Sauce.',
      ar: 'قرص موزاريلا، دجاج مقلي مغمّس بصلصة هاني باني، صلصة الشيدر وصلصة الباربكيو.',
    },
    removable: [I.mozzPatty, I.cheddarSauce, I.bbq],
    options: [extraSauces],
  },
  {
    id: 'nashvillicious', category: 'finest-burgers', name: 'NASHVILLICIOUS', price: 9.5, image: 'nashvillicious',
    description: {
      en: 'Dill Pickles, Jalapenos, Coleslaw, Nashville Batter-Fried Chix, Cheddar Sauce, Ranch & Honey Maple Sauce.',
      ar: 'مخلل، هالبينو، كول سلو، دجاج ناشفيل مقلي بالخليط، صلصة الشيدر، رانش وصلصة هاني مايبل.',
    },
    removable: [I.pickles, I.jalapenos, I.coleslaw, I.cheddarSauce, I.ranch],
    options: [extraSauces],
  },

  // GRILLED BLISS
  {
    id: 'ranch-royal', category: 'grilled-bliss', name: 'RANCH ROYAL', price: 6.8, image: 'ranch-royal',
    description: {
      en: 'Tender Grilled Chicken topped with Cheddar Sauce, Iceberg Lettuce, Tomatoes, Fresh Onions, Ranch & Honey Bunny Sauce.',
      ar: 'دجاج مشوي طري مع صلصة الشيدر، خس آيسبرغ، بندورة، بصل طازج، صلصة رانش وهاني باني.',
    },
    removable: [I.cheddarSauce, I.lettuce, I.tomatoes, I.onions, I.ranch, I.honeyBunny],
    options: [extraSauces],
  },
  {
    id: 'heatwave', category: 'grilled-bliss', name: 'HEATWAVE', price: 7.5, image: 'heatwave',
    description: {
      en: 'Tender Grilled Chicken topped with Melted Swiss Cheese, Jalapeños, Iceberg Lettuce, Aioli & Spicy Samurai Sauce.',
      ar: 'دجاج مشوي طري مع جبنة سويسرية ذائبة، هالبينو، خس آيسبرغ، أيولي وصلصة ساموراي الحارة.',
    },
    removable: [I.swiss, I.jalapenos, I.lettuce, I.aioli, I.samurai],
    options: [extraSauces],
  },
  {
    id: 'bee-glory', category: 'grilled-bliss', name: 'BEE GLORY', price: 8.5, image: 'bee-glory',
    description: {
      en: 'Tender Grilled Chicken, Dill Pickles, Iceberg Lettuce, Mozzarella Patty, Aioli & Honey Bunny Sauce.',
      ar: 'دجاج مشوي طري، مخلل، خس آيسبرغ، قرص موزاريلا، أيولي وصلصة هاني باني.',
    },
    removable: [I.pickles, I.lettuce, I.mozzPatty, I.aioli, I.honeyBunny],
    options: [extraSauces],
  },
  {
    id: 'shroom-lord', category: 'grilled-bliss', name: 'SHROOM LORD', price: 10.5, image: 'shroom-lord',
    description: {
      en: 'Tender Grilled Chicken topped with Double Swiss Cheese, Arugula, Sauteed Mushrooms, Sauteed Exotic Pineapples, Aioli & Home-made Mushroom Sauce.',
      ar: 'دجاج مشوي طري مع طبقتين جبنة سويسرية، جرجير، فطر سوتيه، أناناس سوتيه، أيولي وصلصة الفطر المنزلية.',
    },
    removable: [I.arugula, I.mushrooms, I.pineapple, I.aioli, I.mushroomSauce],
    options: [extraSauces],
  },

  // KIDS MEAL
  {
    id: 'mini-burger', category: 'kids-meal', name: 'MINI BURGER', price: 7, image: 'mini-burger',
    description: {
      en: "A crispy mini chicken burger with iceberg lettuce, dill pickles, KUKU's sauce, and cheddar sauce, served with fries, ketchup dip, juice, and a Kinder Joy surprise.",
      ar: 'ميني برغر دجاج مقرمش مع خس آيسبرغ، مخلل، صلصة كوكو وصلصة الشيدر، مع بطاطا، كاتشب، عصير ومفاجأة كيندر جوي.',
    },
    removable: [I.lettuce, I.pickles, { en: "KUKU's Sauce", ar: 'صلصة كوكو' }, I.cheddarSauce],
  },
  {
    id: 'mini-crispy', category: 'kids-meal', name: 'MINI CRISPY', price: 7.5, image: 'mini-crispy',
    description: {
      en: 'Three chicken strips, served with fries, ketchup dip, juice, and a Kinder Joy surprise.',
      ar: 'ثلاث ستريبس دجاج مع بطاطا، كاتشب، عصير ومفاجأة كيندر جوي.',
    },
  },
  {
    id: 'chicken-nuggets', category: 'kids-meal', name: 'CHICKEN NUGGETS', price: 7, image: 'chicken-nuggets',
    description: {
      en: 'Chicken Nuggets Served with fries, ketchup dip, juice, and a Kinder Joy.',
      ar: 'ناغتس دجاج مع بطاطا، كاتشب، عصير وكيندر جوي.',
    },
  },

  // COMBOS & EXTRAS
  {
    id: 'butter-grilled-brioche', category: 'combos-extras', name: 'BUTTER-GRILLED BRIOCHE', price: 1.5,
    description: {
      en: "Lightly sweet brioche, buttered & grilled until golden, crisp and ridiculously good with chicken. (Most compatible with Kuku's Chix and Chicken Strips)",
      ar: 'بريوش خفيف الحلاوة، مدهون بالزبدة ومشوي حتى يصير ذهبياً ومقرمشاً — رائع مع الدجاج. (الأنسب مع كوكو تشيكس وستريبس الدجاج)',
    },
  },
  {
    id: 'fries-drink', category: 'combos-extras', name: 'FRIES + DRINK', price: 4, image: 'fries-drink',
    description: { en: "Regular fries, Kuku's sauce, and your choice of drink.", ar: 'بطاطا عادية، صلصة كوكو ومشروب من اختيارك.' },
    notesHint: drinkHint,
  },
  {
    id: 'mac-drink', category: 'combos-extras', name: 'MAC + DRINK', price: 4, image: 'mac-drink',
    description: { en: "8 Oz Mac n' Cheese and your choice of drink.", ar: '٨ أونصة ماك أند تشيز ومشروب من اختيارك.' },
    notesHint: drinkHint,
  },
  {
    id: 'curly-fries-drink', category: 'combos-extras', name: 'CURLY FRIES + DRINK', price: 5, image: 'curly-fries-drink',
    description: { en: 'Comes with your choice of soft drink + cheddar dip.', ar: 'مع مشروب غازي من اختيارك وصلصة الشيدر.' },
    notesHint: drinkHint,
  },
  {
    id: 'coleslaw', category: 'combos-extras', name: 'COLESLAW', price: 2, image: 'coleslaw',
    description: { en: '4 Oz of sweet, mouth-watering coleslaw', ar: '٤ أونصة من الكول سلو الحلو واللذيذ.' },
  },

  // SAUCE BOSS
  {
    id: 'sauce-aioli', category: 'sauce-boss', name: 'Aioli', price: 1, image: 'sauce-aioli',
    description: { en: 'Mayonnaise with a hint of garlic. Compatible with plain chicken. 2 Oz size.', ar: 'مايونيز بلمسة ثوم. يناسب الدجاج العادي. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-kukus', category: 'sauce-boss', name: "Kuku's", price: 1, image: 'sauce-kukus',
    description: { en: 'A cocktail sauce with a twist. Compatible with almost anything. 2 Oz size.', ar: 'صلصة كوكتيل بلمسة مختلفة. تناسب كل شيء تقريباً. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-ranch', category: 'sauce-boss', name: 'Ranch', price: 1, image: 'sauce-ranch',
    description: { en: 'Creamy, Herby, and a bit Acidic. Compatible with Spicy Food. 2 Oz size.', ar: 'كريمية، بالأعشاب وحامضة قليلاً. تناسب الأكل الحار. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-habanero', category: 'sauce-boss', name: 'Habanero', price: 1, image: 'sauce-habanero',
    description: { en: 'A mayo-based spicy sauce. Perfect in a burger, not as a stand-alone dip. 2 Oz size.', ar: 'صلصة حارة أساسها المايونيز. مثالية داخل البرغر، لا كصلصة تغميس وحدها. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-honey-bunny', category: 'sauce-boss', name: 'Honey Bunny', price: 1, image: 'sauce-honey-bunny',
    description: { en: 'The Famous Honey Mustard sauce. Compatible with almost everything. 2 Oz size.', ar: 'صلصة العسل والخردل الشهيرة. تناسب كل شيء تقريباً. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-honey-bbq', category: 'sauce-boss', name: 'Honey BBQ', price: 1, image: 'sauce-honey-bbq',
    description: { en: 'The famous BBQ sauce, with an in-house twist. 2 Oz size.', ar: 'صلصة الباربكيو الشهيرة بلمستنا الخاصة. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-spicy-samurai', category: 'sauce-boss', name: 'Spicy Samurai', price: 1, image: 'sauce-spicy-samurai',
    description: { en: 'A mayo-based spicy sauce with an asian hint. NOT very compatible with Nashville Chicken. 2 Oz size.', ar: 'صلصة حارة أساسها المايونيز بلمسة آسيوية. لا تناسب كثيراً دجاج ناشفيل. حجم ٢ أونصة.' },
  },
  {
    id: 'sauce-honey-maple', category: 'sauce-boss', name: 'Honey Maple', price: 1, image: 'sauce-honey-maple',
    description: { en: 'Sweet, Intense, and Full of Flavors. Perfect with Nashville Chicken IF you like the taste of maple syrup. 2 Oz size.', ar: 'حلوة، قوية ومليئة بالنكهات. مثالية مع دجاج ناشفيل إذا كنت تحب طعم شراب القيقب. حجم ٢ أونصة.' },
  },

  // PUDDING
  {
    id: 'banana-caramel-pudding', category: 'pudding', name: 'BANANA CARAMEL PUDDING', price: 4.5, image: 'banana-caramel-pudding',
    description: { en: 'Size: 8oz', ar: 'الحجم: ٨ أونصة' },
  },

  // DRINKS
  { id: 'still-water', category: 'drinks', name: 'Still Water 0.6L', price: 0.56, image: 'still-water', description: { en: '', ar: '' } },
  { id: 'soft-drinks', category: 'drinks', name: 'Soft Drinks', price: 1.5, image: 'soft-drinks', description: { en: '', ar: '' }, notesHint: drinkHint },
  { id: 'rim-sparkling-water', category: 'drinks', name: 'Rim Sparkling Water 0.33L', price: 2.22, image: 'rim-sparkling-water', description: { en: '', ar: '' } },
]

export const isOrderable = (item: MenuItem) => item.price > 0

export const itemsByCategory = (id: string) => menu.filter((m) => m.category === id)

export const findItem = (id: string) => menu.find((m) => m.id === id)

/** Items featured on the home page — all real items, picked for their photos. */
export const featuredIds = ['kukus-chix', 'abou-kukus-combo', 'nashvillicious', 'ranch-rush-mac', 'holy-stripinity', 'healers-fries', 'shroom-lord', 'strips']
