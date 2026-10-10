/**
 * Adam's Burger menu — transcribed from the Thrubits digital menu (rest.thrubits.com).
 *
 * Prices are in US dollars exactly as listed. The menu's "Add on" section
 * (Combo, Add chicken, Add Mozzarella patty, Add Beef patty, Dip Sauce) is
 * offered here as extras on the burgers it applies to, so guests pick them
 * while building their order; Dip Sauce is also sold on its own under Sides.
 * Item names keep the menu's spelling ("Carmalized onion"), descriptions
 * are lightly tidied.
 *
 * Item shape:
 *   id, category, name {en, ar}, description? {en, ar}
 *   price            – single price, or
 *   sizes            – [{ id, label {en, ar}, price, listedAs }]
 *   options          – [{ id, label, required, choices: [{ id, label }] }]   pick one, no extra cost
 *   extras           – [{ id, label, price, sizes? }]                        paid add-ons (sizes = limit to those size ids)
 *   removable        – [{ id, label }]                                       ingredients the guest can ask to leave out
 *   image            – file name in /public/img/menu (without .webp); null shows a placeholder
 *   featured         – shown in the homepage highlights
 */
import { asset } from '../lib/asset'

const L = (en, ar) => ({ en, ar })

export const categories = [
  { id: 'beef-burger', name: L('Beef Burger', 'برغر لحمة'), cover: 'adams-burger' },
  { id: 'chicken-burger', name: L('Chicken Burger', 'برغر دجاج'), cover: 'cheesy-chicken' },
  { id: 'sides', name: L('Sides', 'مقبلات'), cover: 'french-fries' },
  { id: 'soft-drink', name: L('Soft Drink', 'مشروبات غازية'), cover: 'pepsi' },
]

// ── Add-ons (the menu's "Add on" section) ──────────────────────
const combo = {
  id: 'combo', label: L('Make it a combo (Fries, Pepsi, Dip sauce)', 'خليه كومبو (بطاطا، بيبسي، صوص)'), price: 3,
}
const addBeef = { id: 'add-beef', label: L('Add Beef patty', 'زيادة قطعة لحمة'), price: 2 }
const addChicken = { id: 'add-chicken', label: L('Add chicken', 'زيادة دجاج'), price: 2 }
const addMozzarella = { id: 'add-mozzarella', label: L('Add Mozzarella patty', 'زيادة قرص موزاريلا'), price: 1.5 }
const dipSauce = { id: 'dip-sauce', label: L('Dip Sauce', 'صوص للتغميس'), price: 0.5 }

const beefExtras = [combo, addBeef, addMozzarella, dipSauce]
const chickenExtras = [combo, addChicken, addMozzarella, dipSauce]

// ── Ingredients guests can leave out ──────────────────────────
const no = {
  tomato: { id: 'tomato', label: L('Tomato', 'بندورة') },
  lettuce: { id: 'lettuce', label: L('Lettuce', 'خس') },
  pickles: { id: 'pickles', label: L('Pickles', 'كبيس') },
  onion: { id: 'onion', label: L('Onion', 'بصل') },
  grilledOnions: { id: 'grilled-onions', label: L('Grilled onions', 'بصل مشوي') },
  arugula: { id: 'arugula', label: L('Arugula', 'جرجير') },
  mushroom: { id: 'mushroom', label: L('Mushroom', 'فطر') },
  blueberry: { id: 'blueberry-jam', label: L('Blueberry jam', 'مربّى التوت') },
  sauce: { id: 'sauce', label: L('Sauce', 'الصوص') },
}

export const menu = [
  // ── Beef Burger ──────────────────────────────────────────────
  {
    id: 'adams-burger', category: 'beef-burger', name: L("Adam's Burger", 'برغر آدم'), price: 7, image: 'adams-burger', featured: true,
    description: L(
      '140g Beef patty, grilled onions, arugula, Emmental cheese, mayo sauce, blueberry jam',
      'قطعة لحمة 140غ، بصل مشوي، جرجير، جبنة إمنتال، صوص مايونيز، مربّى التوت',
    ),
    extras: beefExtras, removable: [no.grilledOnions, no.arugula, no.blueberry, no.sauce],
  },
  {
    id: 'cheesy-beef', category: 'beef-burger', name: L('Cheesy Beef', 'تشيزي بيف'), price: 6.5, image: 'cheesy-beef', featured: true,
    description: L(
      '140g Beef patty, tomato, lettuce, Mozzarella patty, signature sauce',
      'قطعة لحمة 140غ، بندورة، خس، قرص موزاريلا، صوص سيغنتشر',
    ),
    extras: beefExtras, removable: [no.tomato, no.lettuce, no.sauce],
  },
  {
    id: 'beef-mushroom', category: 'beef-burger', name: L('Beef mushroom', 'بيف مشروم'), price: 6.5, image: 'beef-mushroom', featured: true,
    description: L(
      '140g Beef patty, mushroom slices, Emmental cheese, signature sauce',
      'قطعة لحمة 140غ، شرحات فطر، جبنة إمنتال، صوص سيغنتشر',
    ),
    extras: beefExtras, removable: [no.mushroom, no.sauce],
  },
  {
    id: 'carmalized-onion', category: 'beef-burger', name: L('Carmalized onion', 'بصل مكرمل'), price: 5, image: 'caramelized-onion',
    description: L(
      '140g Beef patty, caramelized onions, Emmental cheese, signature sauce',
      'قطعة لحمة 140غ، بصل مكرمل، جبنة إمنتال، صوص سيغنتشر',
    ),
    extras: beefExtras, removable: [no.onion, no.sauce],
  },
  {
    id: 'smashed-burger', category: 'beef-burger', name: L('Smashed Burger', 'سماشد برغر'), price: 7, image: 'smashed-burger', featured: true,
    description: L(
      'Double Beef patty (280g), onion, double cheddar slices, signature sauce',
      'قطعتين لحمة (280غ)، بصل، شريحتين جبنة شيدر، صوص سيغنتشر',
    ),
    extras: beefExtras, removable: [no.onion, no.sauce],
  },

  // ── Chicken Burger ───────────────────────────────────────────
  {
    id: 'cheesy-chicken', category: 'chicken-burger', name: L('Cheesy Chicken', 'تشيزي تشيكن'), price: 5.5, image: 'cheesy-chicken', featured: true,
    description: L(
      '120g Chicken breast, tomato, pickles, lettuce, Mozzarella patty, signature sauce',
      'صدر دجاج 120غ، بندورة، كبيس، خس، قرص موزاريلا، صوص سيغنتشر',
    ),
    extras: chickenExtras, removable: [no.tomato, no.pickles, no.lettuce, no.sauce],
  },
  {
    id: 'spicy-zinger', category: 'chicken-burger', name: L('Spicy Zinger', 'سبايسي زنجر'), price: 5, image: 'spicy-zinger', featured: true,
    description: L(
      '120g Coated chicken breast, Zinger spicy sauce, pickles, cheddar cheese',
      'صدر دجاج مقرمش 120غ، صوص زنجر حار، كبيس، جبنة شيدر',
    ),
    extras: chickenExtras, removable: [no.pickles, no.sauce],
  },
  {
    // The price sits just off-screen in the menu screenshots; $5.00 is the price shown under this card — confirm with the restaurant.
    id: 'crunchy-master', category: 'chicken-burger', name: L('Crunchy Master', 'كرانشي ماستر'), price: 5, image: 'crunchy-master',
    description: L(
      '120g Coated chicken breast, honey mustard sauce, cheddar cheese, tomato, lettuce',
      'صدر دجاج مقرمش 120غ، صوص هاني ماستارد، جبنة شيدر، بندورة، خس',
    ),
    extras: chickenExtras, removable: [no.tomato, no.lettuce, no.sauce],
  },

  // ── Sides ────────────────────────────────────────────────────
  {
    id: 'french-fries', category: 'sides', name: L('French Fries', 'بطاطا مقلية'), price: 2.5, image: 'french-fries',
    extras: [dipSauce],
  },
  {
    id: 'mozzarella-sticks', category: 'sides', name: L('Mozzarella sticks', 'أصابع موزاريلا'), price: 3, image: 'mozzarella-sticks',
    description: L('4 pcs of Mozzarella sticks + Dip sauce', '4 أصابع موزاريلا + صوص'),
  },
  {
    id: 'onion-rings', category: 'sides', name: L('Onion Rings', 'حلقات بصل'), price: 2.5, image: 'onion-rings',
    description: L('4 pcs of Onion Rings + Dip sauce', '4 حلقات بصل + صوص'),
  },
  {
    id: 'dip-sauce', category: 'sides', name: L('Dip Sauce', 'صوص للتغميس'), price: 0.5, image: null,
    options: [{
      id: 'sauce', label: L('Sauce', 'الصوص'), required: true,
      choices: [
        { id: 'signature', label: L('Signature', 'سيغنتشر') },
        { id: 'honey', label: L('Honey mustard', 'هاني ماستارد') },
        { id: 'zinger', label: L('Zinger', 'زنجر') },
      ],
    }],
  },

  // ── Soft Drink ───────────────────────────────────────────────
  { id: 'ice-tea', category: 'soft-drink', name: L('Ice tea', 'آيس تي'), price: 1, image: 'ice-tea' },
  { id: 'pepsi', category: 'soft-drink', name: L('Pepsi', 'بيبسي'), price: 1, image: 'pepsi' },
  { id: '7up', category: 'soft-drink', name: L('7up', 'سفن أب'), price: 1, image: '7up' },
  { id: 'miranda', category: 'soft-drink', name: L('Miranda', 'ميراندا'), price: 1, image: 'miranda' },
  { id: 'small-water', category: 'soft-drink', name: L('Small water', 'مي صغيرة'), price: 0.5, image: 'small-water' },
]

/** Menu photos that also have a background-free cutout (used by the add-to-cart animation). */
const CUTOUTS = new Set([
  '7up', 'adams-burger', 'beef-mushroom', 'caramelized-onion', 'cheesy-beef', 'cheesy-chicken', 'crunchy-master',
  'french-fries', 'ice-tea', 'miranda', 'mozzarella-sticks', 'onion-rings', 'pepsi', 'small-water', 'smashed-burger',
  'spicy-zinger',
])

export const imageUrl = (slug) => (slug ? asset(`img/menu/${slug}.webp`) : null)
export const cutoutUrl = (slug) => (slug && CUTOUTS.has(slug) ? asset(`img/cut/${slug}.webp`) : null)

export const getItem = (id) => menu.find((item) => item.id === id)
export const itemsIn = (categoryId) => menu.filter((item) => item.category === categoryId)

/** Lowest price of an item, used for "from" labels. */
export const basePrice = (item) => (item.sizes ? Math.min(...item.sizes.map((s) => s.price)) : item.price)
