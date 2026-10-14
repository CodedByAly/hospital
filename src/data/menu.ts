/**
 * Kuku Chix Joint — full menu.
 *
 * Names, prices, struck-through prices and English descriptions are copied
 * exactly from the restaurant's ordering page (kuku.moviyum.com).
 *
 * To change a price: edit `price`. To hide an item: delete its object.
 * Items with a `verify` note had part of their text hidden in the
 * screenshots — double-check them against the live menu.
 */
import type { Category, MenuItem, OptionGroup } from './types'
import { restaurant } from '../config/restaurant'

export const categories: Category[] = [
  { id: 'bundles', name: 'Bundles', blurb: 'Built for sharing, priced to make sense.' },
  { id: 'starters', name: 'Starters' },
  { id: 'mac-mania', name: 'Mac Mania' },
  { id: 'deluxe-fries', name: 'Deluxe Fries' },
  { id: 'finest-burgers', name: 'Finest Burgers' },
  { id: 'grilled-bliss', name: 'Grilled Bliss' },
  { id: 'kids-meal', name: 'Kids Meal' },
  { id: 'combos-extras', name: 'Combos & Extras' },
  { id: 'sauce-boss', name: 'Sauce Boss' },
  { id: 'pudding', name: 'Pudding' },
  { id: 'drinks', name: 'Drinks' },
]

/* ---------- ingredient vocabulary (used for "remove" options) ---------- */
const I = {
  lettuce: 'Iceberg Lettuce',
  pickles: 'Dill Pickles',
  jalapenos: 'Jalapeños',
  cheddarSauce: 'Cheddar Sauce',
  kukuSauce: "KUKU's Signature Sauce",
  ranch: 'Ranch Sauce',
  samurai: 'Spicy Samurai Sauce',
  habanero: 'Habanero Sauce',
  crispyOnions: 'Crispy Onions',
  cheddarPatty: 'Cheddar Patty',
  coleslaw: 'Coleslaw',
  mozzPatty: 'Mozzarella Patty',
  tomatoes: 'Tomatoes',
  onions: 'Fresh Onions',
  honeyBunny: 'Honey Bunny Sauce',
  swiss: 'Swiss Cheese',
  aioli: 'Aioli',
  arugula: 'Arugula',
  mushrooms: 'Sauteed Mushrooms',
  pineapple: 'Sauteed Exotic Pineapples',
  mushroomSauce: 'Mushroom Sauce',
  cheddarPearls: 'Cheddar Pearls',
  meltedCheddar: 'Melted Cheddar',
  bbq: 'BBQ Sauce',
  maple: 'Maple Sauce',
  buffalo: 'Buffalo Sauce',
} satisfies Record<string, string>

/* ---------- shared option groups ---------- */

/** The eight sauces from the "Sauce Boss" section. */
const sauceChoices = [
  { id: 'aioli', label: 'Aioli' },
  { id: 'kukus', label: "Kuku's" },
  { id: 'ranch', label: 'Ranch' },
  { id: 'habanero', label: 'Habanero' },
  { id: 'honey-bunny', label: 'Honey Bunny' },
  { id: 'honey-bbq', label: 'Honey BBQ' },
  { id: 'spicy-samurai', label: 'Spicy Samurai' },
  { id: 'honey-maple', label: 'Honey Maple' },
]

const includedSauces = (n: number): OptionGroup => ({
  id: 'included-sauces',
  label: `Your ${n} sauces`,
  hint: `Included — pick ${n}`,
  type: 'count',
  required: true,
  min: n,
  max: n,
  choices: sauceChoices,
})

const freeDip: OptionGroup = {
  id: 'free-dip',
  label: 'Free 2 oz dip',
  type: 'single',
  required: true,
  choices: sauceChoices,
}

/** Flavours listed on Strips and Chicken Wings. */
const dippedIn: OptionGroup = {
  id: 'dipped-in',
  label: 'Dipped in',
  type: 'single',
  required: true,
  choices: [
    { id: 'buffalo', label: 'Buffalo' },
    { id: 'honey-bbq', label: 'Honey BBQ' },
    { id: 'honey-bunny', label: 'Honey Bunny' },
    { id: 'honey-chipotle', label: 'Honey Chipotle' },
    { id: 'honey-maple', label: 'Honey Maple' },
    { id: 'nashville', label: 'Nashville' },
  ],
}

const spiceLevel: OptionGroup = {
  id: 'spice-level',
  label: 'Spice level',
  type: 'single',
  required: true,
  choices: restaurant.spiceLevels.map((s) => ({ id: s.id, label: s.label })),
}

/** Paid extras — priced exactly as their own menu entries. */
const extraSauces: OptionGroup = {
  id: 'extra-sauces',
  label: 'Extra sauces',
  hint: '$1.00 each, 2 oz',
  type: 'count',
  max: 6,
  choices: sauceChoices.map((c) => ({ ...c, price: 1 })),
}

const brioche: OptionGroup = {
  id: 'brioche',
  label: 'Add a side',
  type: 'multi',
  max: 1,
  choices: [{ id: 'butter-grilled-brioche', label: 'Butter-Grilled Brioche', price: 1.5 }],
}

const drinkHint = 'Which soft drink would you like?'
const minisHint = 'Tell us which mini burgers you want'

/* ---------- items ---------- */

export const menu: MenuItem[] = [
  // BUNDLES
  {
    id: 'abou-kukus-combo', category: 'bundles', name: "ABOU KUKU's COMBO", price: 23, compareAt: 30.6, image: 'abou-kukus-combo',
    description: '8 Wings. 4 Strips. 2 Mac n Cheese. 2 Nashville Mozzarella Bricks. Fries. 4 Sauces. (Perfect for two people or more)',
    options: [includedSauces(4), extraSauces],
  },
  {
    id: 'crispy-meal', category: 'bundles', name: 'CRISPY MEAL', price: 11, compareAt: 14.65, image: 'crispy-meal',
    description: '5 Chkn Strips, Fries, Coleslaw, Toast Brioche, Cheddar & Aioli Dip.',
    options: [extraSauces],
  },
  {
    id: 'the-burger-combo', category: 'bundles', name: 'THE BURGER COMBO', price: 15, compareAt: 18.5, image: 'the-burger-combo',
    description: "Any burger of your choice, served with crispy fries, a Mozzarella Brick, and a side of creamy Mac 'n Cheese. Comes with 2 sauces of your choice.",
    verify: 'Menu does not say whether pricier burgers cost extra in this combo.',
    options: [
      {
        id: 'burger', label: 'Your burger', type: 'single', required: true,
        choices: ['Classic', 'Ranch', 'Risky', 'Maple', 'Nasty', 'Buffalo Bomb', 'BBQ Freak', 'Honey Trap', 'Nashvillicious', 'Ranch Royal', 'Heatwave', 'Bee Glory', 'Shroom Lord']
          .map((n) => ({ id: n.toLowerCase().replace(/\s+/g, '-'), label: n })),
      },
      includedSauces(2),
      extraSauces,
    ],
  },
  {
    id: 'nerdy-bundle-2-minis', category: 'bundles', name: "NERDY BUNDLE | 2 MINI's", price: 14, compareAt: 17, image: 'nerdy-bundle-2-minis',
    description: 'Pick any 2 Mini Burgers, served with classic fries, 1 Mozzarella Brick, 3 Mini Corn Ribs and 2 sauces.',
    notesHint: minisHint,
    options: [includedSauces(2), extraSauces],
  },
  {
    id: 'ez-bundle-4-minis', category: 'bundles', name: "E Z BUNDLE | 4 MINI's", price: 26, compareAt: 30.5, image: 'ez-bundle-4-minis',
    description: 'Pick any 4 Mini Burgers, served with classic fries, 2 Mozzarella Bricks, 6 Mini Corn Ribs and 4 sauces.',
    notesHint: minisHint,
    options: [includedSauces(4), extraSauces],
  },
  {
    id: 'no-brainer-bundle-9-minis', category: 'bundles', name: "NO BRAINER BUNDLE | 9 MINI's", price: 55, compareAt: 66.1, image: 'no-brainer-bundle-9-minis',
    description: 'Pick any 9 Mini Burgers, served with classic fries, curly fries, 4 Mozzarella Bricks, 12 Mini Corn Ribs, and 4 sauces.',
    notesHint: minisHint,
    options: [includedSauces(4), extraSauces],
  },

  // STARTERS
  {
    id: 'nashville-mozzarella-bricks', category: 'starters', name: 'NASHVILLE MOZZARELLA BRICKS', price: 7.5, image: 'nashville-mozzarella-bricks',
    description: 'Two Nashville Mega Mozzarella Sticks with 2 oz. free dip (Choose your spice level!)',
    options: [spiceLevel, freeDip, extraSauces],
  },
  {
    id: 'nashville-jalapenos-bites', category: 'starters', name: 'NASHVILLE JALAPENOS BITES', price: 5.5, image: 'nashville-jalapenos-bites',
    description: 'Two Mega Nashville Jalapenos Bites with 2 oz. free dip. (Choose your Spice Level!)',
    options: [spiceLevel, freeDip, extraSauces],
  },
  {
    id: 'strips', category: 'starters', name: 'STRIPS', price: 6.5, image: 'strips',
    description: 'FOUR Chkn Strips dipped with your choice of: Buffalo, Honey BBQ, Honey Bunny, Honey Chipotle, Honey Maple, or Nashville -- Comes with 2 oz. free dip',
    options: [dippedIn, freeDip, brioche, extraSauces],
  },
  {
    id: 'kukus-chix', category: 'starters', name: "KUKU's CHIX", price: 12, image: 'kukus-chix',
    description: 'Two breaded Chkn Steaks, brushed with our infused HOT butter-oil and coated with our signature Nashville Spices. Includes 2 "4oz" Dipping Sauce -- CHOOSE your spice level!',
    verify: 'Includes 2 x 4oz dipping sauces — modeled as "pick 2" from the sauce list.',
    options: [spiceLevel, includedSauces(2), brioche, extraSauces],
  },
  {
    id: 'chicken-wings', category: 'starters', name: 'CHICKEN WINGS', price: 6.8, image: 'chicken-wings',
    description: 'EIGHT Chkn wings dipped with your choice of: Buffalo, Honey BBQ, Honey Bunny, Honey Chipotle, Honey Maple, or Nashville -- Comes with 2 oz. free dip',
    verify: 'Second half of the description was hidden; assumed identical to Strips.',
    options: [dippedIn, freeDip, extraSauces],
  },
  {
    id: 'holy-stripinity', category: 'starters', name: 'HOLY STRIPINITY', price: 8, image: 'holy-stripinity',
    description: 'A holy trio of Nashville hot chicken strips on buttery brioche toast, diced dill pickles & Jalapenos, served with ranch, honey bunny, and honey maple dip.',
    removable: [I.pickles, I.jalapenos],
    options: [extraSauces],
  },
  {
    id: 'mini-corn-ribs', category: 'starters', name: 'MINI CORN RIBS', price: 3.8, image: 'mini-corn-ribs',
    description: '6 mini corn ribs hit with Nashville heat, served with a cool ranch dip.',
    options: [extraSauces],
  },

  // MAC MANIA
  {
    id: 'original-mac', category: 'mac-mania', name: 'ORIGINAL MAC', price: 10, image: 'original-mac',
    description: "Cavatappi Pasta, Cheese Blend, Chkn Pops & KUKU's Signature Sauce.",
    removable: [I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'sweet-n-fire-mac', category: 'mac-mania', name: "SWEET N' FIRE MAC", price: 12, image: 'sweet-n-fire-mac',
    description: 'Cavatappi Pasta, Cheese Blend, Nashville Chkn Pops, Diced Jalapeños, Honey Bunny, Spicy Samurai & Ranch Sauce.',
    removable: [I.jalapenos, I.honeyBunny, I.samurai, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'ranch-rush-mac', category: 'mac-mania', name: 'RANCH RUSH MAC', price: 12, image: 'ranch-rush-mac',
    description: "Cavatappi Pasta, Cheese Blend, Chkn Pops, Crispy Onions, Dill Pickles, Ranch & KUKU's Signature Sauce.",
    removable: [I.crispyOnions, I.pickles, I.ranch, I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'side-mac', category: 'mac-mania', name: 'SIDE MAC', price: 3, image: 'side-mac',
    description: "8 Oz of Creamy, Mouth-watering Mac n' Cheese.",
  },

  // DELUXE FRIES
  {
    id: 'heroes-fries', category: 'deluxe-fries', name: 'HEROES FRIES', price: 8.5, image: 'heroes-fries',
    description: "Crispy Fries, Chkn Pops, Melted Cheddar, Dill Pickles, Ranch & KUKU's Signature.",
    removable: [I.pickles, I.ranch, I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'habaneros-fries', category: 'deluxe-fries', name: 'HABANEROS FRIES', price: 8.5, image: 'habaneros-fries',
    description: 'Crispy Fries, Chkn Pops, Melted Cheddar, Diced Jalapeños, Crispy Onions, Spicy Samurai & Habaneros Sauce.',
    removable: [I.jalapenos, I.crispyOnions, I.samurai, I.habanero],
    options: [extraSauces],
  },
  {
    id: 'healers-fries', category: 'deluxe-fries', name: 'HEALERS FRIES', price: 10, image: 'healers-fries',
    description: 'Crispy Fries, Chkn Pops, Cavatappi Pasta, Cheese Blend, Melted Cheddar, Cheddar Pearls, Crispy Onions, Honey Bunny & Ranch Sauce.',
    removable: [I.cheddarPearls, I.crispyOnions, I.honeyBunny, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'regular-fries', category: 'deluxe-fries', name: 'REGULAR FRIES', price: 3, image: 'regular-fries',
    description: "Comes with Kuku's Sauce.",
    options: [extraSauces],
  },
  {
    id: 'curly-fries', category: 'deluxe-fries', name: 'CURLY FRIES', price: 4, image: 'curly-fries',
    description: 'Comes with a Cheddar Dip',
    options: [extraSauces],
  },

  // FINEST BURGERS
  {
    id: 'classic', category: 'finest-burgers', name: 'CLASSIC', price: 7, image: 'classic',
    description: "Iceberg Lettuce, Dill Pickles, Batter-Fried Chix, Cheddar Sauce & KUKU's Signature Sauce.",
    removable: [I.lettuce, I.pickles, I.cheddarSauce, I.kukuSauce],
    options: [extraSauces],
  },
  {
    id: 'ranch', category: 'finest-burgers', name: 'RANCH', price: 0, image: 'ranch',
    description: 'Iceberg Lettuce, Dill Pickles, Batter-Fried Chix, Cheddar Patty, Ranch, Maple, Buffalo & Honey Bunny Sauce.',
    verify: 'PRICE MISSING — the price row was cut off in every screenshot. Set `price` (0 = shown as "Ask us" and not orderable). Description also partly hidden.',
    removable: [I.lettuce, I.pickles, I.cheddarPatty],
    options: [extraSauces],
  },
  {
    id: 'risky', category: 'finest-burgers', name: 'RISKY', price: 8.5, image: 'risky',
    description: 'Iceberg Lettuce, Jalapeños, Batter-Fried Chix, Cheddar Sauce, Spicy Samurai & Habanero Sauce.',
    removable: [I.lettuce, I.jalapenos, I.cheddarSauce, I.samurai, I.habanero],
    options: [extraSauces],
  },
  {
    id: 'maple', category: 'finest-burgers', name: 'MAPLE', price: 8.8, image: 'maple',
    description: 'Iceberg Lettuce, Dill Pickles, Batter-Fried Chix Dipped in Honey-Maple Sauce, Crispy Onions, Cheddar Sauce & Ranch Sauce.',
    removable: [I.lettuce, I.pickles, I.crispyOnions, I.cheddarSauce, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'nasty', category: 'finest-burgers', name: 'NASTY', price: 8, image: 'nasty',
    description: 'Iceberg Lettuce, Dill Pickles, Batter-Fried Chix, Cheddar Sauce, Cheddar Pearls, Honey Bunny & Spicy Samurai Sauce.',
    verify: 'Description start was partly hidden — confirm.',
    removable: [I.lettuce, I.pickles, I.cheddarSauce, I.cheddarPearls, I.honeyBunny, I.samurai],
    options: [extraSauces],
  },
  {
    id: 'buffalo-bomb', category: 'finest-burgers', name: 'BUFFALO BOMB', price: 7.8, image: 'buffalo-bomb',
    description: 'Iceberg Lettuce, Jalapenos, Batter-Fried Chix Dipped in Buffalo Sauce, Cheddar Sauce, Spicy Samurai & Ranch Sauce.',
    removable: [I.lettuce, I.jalapenos, I.cheddarSauce, I.samurai, I.ranch],
    options: [extraSauces],
  },
  {
    id: 'bbq-freak', category: 'finest-burgers', name: 'BBQ FREAK', price: 8.8, image: 'bbq-freak',
    description: 'Mozzarella Patty, Batter-Fried Chix Dipped in Honey BBQ Sauce, Cheddar Sauce & Honey Bunny Sauce.',
    removable: [I.mozzPatty, I.cheddarSauce, I.honeyBunny],
    options: [extraSauces],
  },
  {
    id: 'honey-trap', category: 'finest-burgers', name: 'HONEY TRAP', price: 9.2, image: 'honey-trap',
    description: 'Mozzarella Patty, Batter-Fried Chix Dipped in Honey Bunny Sauce, Cheddar Sauce & BBQ Sauce.',
    removable: [I.mozzPatty, I.cheddarSauce, I.bbq],
    options: [extraSauces],
  },
  {
    id: 'nashvillicious', category: 'finest-burgers', name: 'NASHVILLICIOUS', price: 9.5, image: 'nashvillicious',
    description: 'Dill Pickles, Jalapenos, Coleslaw, Nashville Batter-Fried Chix, Cheddar Sauce, Ranch & Honey Maple Sauce.',
    removable: [I.pickles, I.jalapenos, I.coleslaw, I.cheddarSauce, I.ranch],
    options: [extraSauces],
  },

  // GRILLED BLISS
  {
    id: 'ranch-royal', category: 'grilled-bliss', name: 'RANCH ROYAL', price: 6.8, image: 'ranch-royal',
    description: 'Tender Grilled Chicken topped with Cheddar Sauce, Iceberg Lettuce, Tomatoes, Fresh Onions, Ranch & Honey Bunny Sauce.',
    removable: [I.cheddarSauce, I.lettuce, I.tomatoes, I.onions, I.ranch, I.honeyBunny],
    options: [extraSauces],
  },
  {
    id: 'heatwave', category: 'grilled-bliss', name: 'HEATWAVE', price: 7.5, image: 'heatwave',
    description: 'Tender Grilled Chicken topped with Melted Swiss Cheese, Jalapeños, Iceberg Lettuce, Aioli & Spicy Samurai Sauce.',
    removable: [I.swiss, I.jalapenos, I.lettuce, I.aioli, I.samurai],
    options: [extraSauces],
  },
  {
    id: 'bee-glory', category: 'grilled-bliss', name: 'BEE GLORY', price: 8.5, image: 'bee-glory',
    description: 'Tender Grilled Chicken, Dill Pickles, Iceberg Lettuce, Mozzarella Patty, Aioli & Honey Bunny Sauce.',
    removable: [I.pickles, I.lettuce, I.mozzPatty, I.aioli, I.honeyBunny],
    options: [extraSauces],
  },
  {
    id: 'shroom-lord', category: 'grilled-bliss', name: 'SHROOM LORD', price: 10.5, image: 'shroom-lord',
    description: 'Tender Grilled Chicken topped with Double Swiss Cheese, Arugula, Sauteed Mushrooms, Sauteed Exotic Pineapples, Aioli & Home-made Mushroom Sauce.',
    removable: [I.arugula, I.mushrooms, I.pineapple, I.aioli, I.mushroomSauce],
    options: [extraSauces],
  },

  // KIDS MEAL
  {
    id: 'mini-burger', category: 'kids-meal', name: 'MINI BURGER', price: 7, image: 'mini-burger',
    description: "A crispy mini chicken burger with iceberg lettuce, dill pickles, KUKU's sauce, and cheddar sauce, served with fries, ketchup dip, juice, and a Kinder Joy surprise.",
    removable: [I.lettuce, I.pickles, "KUKU's Sauce", I.cheddarSauce],
  },
  {
    id: 'mini-crispy', category: 'kids-meal', name: 'MINI CRISPY', price: 7.5, image: 'mini-crispy',
    description: 'Three chicken strips, served with fries, ketchup dip, juice, and a Kinder Joy surprise.',
  },
  {
    id: 'chicken-nuggets', category: 'kids-meal', name: 'CHICKEN NUGGETS', price: 7, image: 'chicken-nuggets',
    description: 'Chicken Nuggets Served with fries, ketchup dip, juice, and a Kinder Joy.',
  },

  // COMBOS & EXTRAS
  {
    id: 'butter-grilled-brioche', category: 'combos-extras', name: 'BUTTER-GRILLED BRIOCHE', price: 1.5,
    description: "Lightly sweet brioche, buttered & grilled until golden, crisp and ridiculously good with chicken. (Most compatible with Kuku's Chix and Chicken Strips)",
  },
  {
    id: 'fries-drink', category: 'combos-extras', name: 'FRIES + DRINK', price: 4, image: 'fries-drink',
    description: "Regular fries, Kuku's sauce, and your choice of drink.",
    notesHint: drinkHint,
  },
  {
    id: 'mac-drink', category: 'combos-extras', name: 'MAC + DRINK', price: 4, image: 'mac-drink',
    description: "8 Oz Mac n' Cheese and your choice of drink.",
    notesHint: drinkHint,
  },
  {
    id: 'curly-fries-drink', category: 'combos-extras', name: 'CURLY FRIES + DRINK', price: 5, image: 'curly-fries-drink',
    description: 'Comes with your choice of soft drink + cheddar dip.',
    notesHint: drinkHint,
  },
  {
    id: 'coleslaw', category: 'combos-extras', name: 'COLESLAW', price: 2, image: 'coleslaw',
    description: '4 Oz of sweet, mouth-watering coleslaw',
  },

  // SAUCE BOSS
  {
    id: 'sauce-aioli', category: 'sauce-boss', name: 'Aioli', price: 1, image: 'sauce-aioli',
    description: 'Mayonnaise with a hint of garlic. Compatible with plain chicken. 2 Oz size.',
  },
  {
    id: 'sauce-kukus', category: 'sauce-boss', name: "Kuku's", price: 1, image: 'sauce-kukus',
    description: 'A cocktail sauce with a twist. Compatible with almost anything. 2 Oz size.',
  },
  {
    id: 'sauce-ranch', category: 'sauce-boss', name: 'Ranch', price: 1, image: 'sauce-ranch',
    description: 'Creamy, Herby, and a bit Acidic. Compatible with Spicy Food. 2 Oz size.',
  },
  {
    id: 'sauce-habanero', category: 'sauce-boss', name: 'Habanero', price: 1, image: 'sauce-habanero',
    description: 'A mayo-based spicy sauce. Perfect in a burger, not as a stand-alone dip. 2 Oz size.',
  },
  {
    id: 'sauce-honey-bunny', category: 'sauce-boss', name: 'Honey Bunny', price: 1, image: 'sauce-honey-bunny',
    description: 'The Famous Honey Mustard sauce. Compatible with almost everything. 2 Oz size.',
  },
  {
    id: 'sauce-honey-bbq', category: 'sauce-boss', name: 'Honey BBQ', price: 1, image: 'sauce-honey-bbq',
    description: 'The famous BBQ sauce, with an in-house twist. 2 Oz size.',
  },
  {
    id: 'sauce-spicy-samurai', category: 'sauce-boss', name: 'Spicy Samurai', price: 1, image: 'sauce-spicy-samurai',
    description: 'A mayo-based spicy sauce with an asian hint. NOT very compatible with Nashville Chicken. 2 Oz size.',
  },
  {
    id: 'sauce-honey-maple', category: 'sauce-boss', name: 'Honey Maple', price: 1, image: 'sauce-honey-maple',
    description: 'Sweet, Intense, and Full of Flavors. Perfect with Nashville Chicken IF you like the taste of maple syrup. 2 Oz size.',
  },

  // PUDDING
  {
    id: 'banana-caramel-pudding', category: 'pudding', name: 'BANANA CARAMEL PUDDING', price: 4.5, image: 'banana-caramel-pudding',
    description: 'Size: 8oz',
  },

  // DRINKS
  { id: 'still-water', category: 'drinks', name: 'Still Water 0.6L', price: 0.56, image: 'still-water', description: '' },
  { id: 'soft-drinks', category: 'drinks', name: 'Soft Drinks', price: 1.5, image: 'soft-drinks', description: '', notesHint: drinkHint },
  { id: 'rim-sparkling-water', category: 'drinks', name: 'Rim Sparkling Water 0.33L', price: 2.22, image: 'rim-sparkling-water', description: '' },
]

export const isOrderable = (item: MenuItem) => item.price > 0

export const itemsByCategory = (id: string) => menu.filter((m) => m.category === id)

export const findItem = (id: string) => menu.find((m) => m.id === id)

/** Items featured on the home page — all real items, picked for their photos. */
export const featuredIds = ['kukus-chix', 'abou-kukus-combo', 'nashvillicious', 'ranch-rush-mac', 'holy-stripinity', 'healers-fries', 'shroom-lord', 'strips']
