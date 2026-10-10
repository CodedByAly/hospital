/**
 * Streets menu — transcribed from the Thrubits digital menu (rest.thrubits.com/restaurant/streets).
 *
 * Prices are in Lebanese pounds exactly as listed. Where the menu has separate
 * "medium" / "large" (or regular / large) entries for the same drink, they are
 * grouped into one item with sizes; the original listing names are kept in
 * `listedAs` so every price can be traced back to the menu.
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

const MEDIUM = L('Medium', 'وسط')
const LARGE = L('Large', 'كبير')
const REGULAR = L('Regular', 'عادي')

export const categories = [
  { id: 'hot-drinks', name: L('Hot Drinks', 'مشروبات ساخنة'), cover: 'cappuccino' },
  { id: 'smoothies', name: L('Smoothies', 'سموذي'), cover: 'smoothie-large' },
  { id: 'refresher', name: L('Refresher', 'منعشات'), cover: 'ice-tea-medium' },
  { id: 'cold-coffee', name: L('Cold Coffee', 'قهوة باردة'), cover: 'mocha-frappe-medium' },
  { id: 'shakes', name: L('Shakes', 'ميلك شيك'), cover: 'milkshake-medium' },
  { id: 'crepe', name: L('Crepe', 'كريب'), cover: 'nutella-fruits-crepe' },
  { id: 'desserts', name: L('Desserts', 'حلويات'), cover: 'oreo-cream-pie' },
  { id: 'bubble-tea', name: L('Bubble tea', 'بابل تي'), cover: 'brown-sugar-bubble-tea' },
]

const syrup = { id: 'syrup', label: L('Add syrup', 'إضافة سيروب'), price: 30000 }

export const menu = [
  // ── Hot Drinks ───────────────────────────────────────────────
  { id: 'espresso', category: 'hot-drinks', name: L('Espresso', 'إسبريسو'), price: 50000, image: 'espresso' },
  {
    id: 'cappuccino', category: 'hot-drinks', name: L('Cappuccino', 'كابتشينو'),
    price: 150000, extras: [syrup], image: 'cappuccino', featured: true,
  },
  {
    id: 'latte', category: 'hot-drinks', name: L('Latte', 'لاتيه'), image: 'latte',
    sizes: [
      { id: 'regular', label: REGULAR, price: 150000, listedAs: 'Latte' },
      { id: 'large', label: LARGE, price: 250000, listedAs: 'Large Latte' },
    ],
    // The menu lists the syrup extra on the regular Latte only.
    extras: [{ ...syrup, sizes: ['regular'] }],
  },
  { id: 'flat-white', category: 'hot-drinks', name: L('Flat White', 'فلات وايت'), price: 150000, image: 'flat-white' },
  { id: 'americano', category: 'hot-drinks', name: L('Americano', 'أميركانو'), price: 120000, image: 'americano' },
  { id: 'machiato', category: 'hot-drinks', name: L('Machiato', 'ماكياتو'), price: 120000, image: 'machiato' },
  {
    id: 'mocha', category: 'hot-drinks', name: L('Mocha', 'موكا'), image: 'mocha',
    sizes: [
      { id: 'regular', label: REGULAR, price: 250000, listedAs: 'Mocha' },
      { id: 'large', label: LARGE, price: 350000, listedAs: 'Large Mocha' },
    ],
  },
  {
    id: 'hot-chocolate-belgium', category: 'hot-drinks',
    name: L('Hot Chocolate Belgium', 'هوت شوكولا بلجيكي'), image: 'hot-chocolate-belgium',
    sizes: [
      { id: 'regular', label: REGULAR, price: 200000, listedAs: 'Hot Chocolate Belgium' },
      { id: 'large', label: LARGE, price: 300000, listedAs: 'Large belgium hot chocolate' },
    ],
  },
  { id: 'hot-chocolate', category: 'hot-drinks', name: L('Hot Chocolate normal', 'هوت شوكولا عادي'), price: 150000, image: 'hot-chocolate' },
  { id: 'cortado', category: 'hot-drinks', name: L('Cortado', 'كورتادو'), price: 120000, image: 'cortado' },
  { id: 'white-mocha', category: 'hot-drinks', name: L('White mocha', 'وايت موكا'), price: 250000, image: 'white-mocha' },
  { id: 'nescafe-milk', category: 'hot-drinks', name: L('Nescafe milk', 'نسكافيه بالحليب'), price: 150000, image: 'nescafe-milk' },
  {
    id: 'hot-lotus', category: 'hot-drinks', name: L('Hot Lotus', 'هوت لوتس'), price: 200000, image: 'hot-lotus',
    description: L(
      'A cozy blend of steamed milk and Lotus Biscoff cream, perfect for chilly days',
      'حليب مبخّر مع كريمة لوتس بيسكوف، دافي ومثالي للأيام الباردة',
    ),
  },
  {
    id: 'golden-glow', category: 'hot-drinks', name: L('Golden Glow', 'غولدن غلو'), price: 200000, image: 'golden-glow', featured: true,
    description: L(
      'A rich hot chocolate with a fudgy brownie base, topped with whipped cream and a sprinkle of edible gold glitter. Sip it or scoop it — pure indulgence in every cup.',
      'هوت شوكولا غنية على قاعدة براوني طرية، مع كريمة مخفوقة ورشّة لمعة ذهبية صالحة للأكل. اشربها أو كُلها بالمعلقة — دلال بكل كباية.',
    ),
  },
  { id: 'nescafe-coffee-mate', category: 'hot-drinks', name: L('Nescafe coffee mate', 'نسكافيه كوفي ميت'), price: 120000, image: 'nescafe-coffee-mate' },

  // ── Smoothies ────────────────────────────────────────────────
  {
    id: 'smoothie', category: 'smoothies', name: L('Smoothie', 'سموذي'), image: 'smoothie-large',
    sizes: [
      { id: 'medium', label: MEDIUM, price: 250000, listedAs: 'Smoothie medium size' },
      { id: 'large', label: LARGE, price: 300000, listedAs: 'Smoothie Large size' },
    ],
    options: [{
      id: 'flavour', label: L('Flavour', 'النكهة'), required: true,
      choices: [
        { id: 'strawberry', label: L('Strawberry', 'فريز') },
        { id: 'mango', label: L('Mango', 'مانغو') },
        { id: 'blueberry', label: L('Blueberry', 'توت أزرق') },
        { id: 'passion-fruit', label: L('Passion fruit', 'باشن فروت') },
      ],
    }],
  },
  {
    id: 'streets-smoothie', category: 'smoothies', name: L('Streets Smoothie', 'سموذي ستريتس'), image: 'streets-smoothie', featured: true,
    description: L(
      'Sweet mango and tangy kiwi blended with a burst of fresh mint. Cool, creamy, and instantly refreshing',
      'مانغو حلو وكيوي حامض مخفوقين مع نعنع طازة. بارد، كريمي، وبينعشك من أول شفّة',
    ),
    sizes: [
      { id: 'medium', label: MEDIUM, price: 280000, listedAs: 'Streets smoothie medium' },
      { id: 'large', label: LARGE, price: 320000, listedAs: 'Streets smoothie large' },
    ],
  },

  // ── Refresher ────────────────────────────────────────────────
  {
    id: 'ice-tea', category: 'refresher', name: L('Ice Tea', 'آيس تي'), image: 'ice-tea-medium',
    sizes: [
      { id: 'medium', label: MEDIUM, price: 200000, listedAs: 'Ice Tea medium' },
      { id: 'large', label: LARGE, price: 250000, listedAs: 'Ice tea Large' },
    ],
  },
  {
    id: 'lemon-mint', category: 'refresher', name: L('Lemon mint / Lemonade (Basil)', 'ليموناضة نعنع / ليموناضة حبق'),
    price: 250000, image: 'lemon-mint',
    options: [{
      id: 'type', label: L('Choose one', 'اختار وحدة'), required: true,
      choices: [
        { id: 'lemon-mint', label: L('Lemon mint', 'ليموناضة نعنع') },
        { id: 'lemonade-basil', label: L('Lemonade (Basil)', 'ليموناضة حبق') },
      ],
    }],
  },
  {
    id: 'hello-mango', category: 'refresher', name: L('Hello Mango', 'هالو مانغو'), image: 'hello-mango-large',
    description: L('A special mixture of mango juice with additional flavours', 'خلطة خاصة من عصير المانغو مع نكهات إضافية'),
    sizes: [
      { id: 'medium', label: MEDIUM, price: 250000, listedAs: 'Hello mango medium size' },
      { id: 'large', label: LARGE, price: 300000, listedAs: 'Hello mango large size' },
    ],
  },
  {
    id: 'mix-berries-yuzu', category: 'refresher', name: L('Mix berries yuzu', 'ميكس بيريز يوزو'), price: 250000, image: 'mix-berries-yuzu',
    description: L('A refreshing blend of sweet berries and citrusy yuzu', 'مزيج منعش من التوت الحلو وحموضة اليوزو'),
  },

  // ── Cold Coffee ──────────────────────────────────────────────
  {
    id: 'mocha-frappe', category: 'cold-coffee', name: L('Mocha Frappe', 'موكا فرابيه'), image: 'mocha-frappe-medium',
    sizes: [
      { id: 'medium', label: MEDIUM, price: 290000, listedAs: 'Mocha Frappe medium' },
      { id: 'large', label: LARGE, price: 340000, listedAs: 'Mocha Frappe large' },
    ],
    options: [{
      id: 'flavour', label: L('Flavour', 'النكهة'), required: true,
      choices: [
        { id: 'tiramisu', label: L('Tiramisu', 'تيراميسو') },
        { id: 'caramel', label: L('Caramel', 'كراميل') },
        { id: 'hazelnut', label: L('Hazelnut', 'بندق') },
        { id: 'vanille', label: L('Vanille', 'فانيلا') },
      ],
    }],
  },
  {
    id: 'special-streets-frappe', category: 'cold-coffee', name: L('Special Streets Frappe', 'فرابيه ستريتس الخاص'),
    image: 'special-streets-frappe-large', featured: true,
    sizes: [
      { id: 'medium', label: MEDIUM, price: 300000, listedAs: 'Special Streets Frappe medium' },
      { id: 'large', label: LARGE, price: 350000, listedAs: 'Special Streets frappe large' },
    ],
  },
  {
    id: 'ice-latte', category: 'cold-coffee', name: L('Ice Latte', 'آيس لاتيه'), image: 'ice-latte-large',
    sizes: [
      { id: 'medium', label: MEDIUM, price: 150000, listedAs: 'Ice Latte medium' },
      { id: 'large', label: LARGE, price: 220000, listedAs: 'Ice latte large' },
    ],
  },

  // ── Shakes ───────────────────────────────────────────────────
  {
    id: 'milkshake', category: 'shakes', name: L('Milkshake', 'ميلك شيك'), image: 'milkshake-medium',
    sizes: [
      { id: 'medium', label: MEDIUM, price: 300000, listedAs: 'Milkshake medium size' },
      { id: 'large', label: LARGE, price: 350000, listedAs: 'Milkshake large size' },
    ],
    // The menu prints these flavours under the medium size; confirm they also apply to large.
    options: [{
      id: 'flavour', label: L('Flavour', 'النكهة'), required: true,
      choices: [
        { id: 'strawberry', label: L('Strawberry', 'فريز') },
        { id: 'caramel', label: L('Caramel', 'كراميل') },
        { id: 'cookies', label: L('Cookies', 'كوكيز') },
      ],
    }],
  },
  {
    id: 'signature-milkshake', category: 'shakes',
    name: L('Lotus / Nutella / Royal white milkshake', 'ميلك شيك لوتس / نوتيلا / رويال وايت'),
    image: 'lotus-nutella-royal-large', featured: true,
    sizes: [
      { id: 'medium', label: MEDIUM, price: 340000, listedAs: 'Lotus milkshake / Nutella milkshake / Royal white medium size' },
      { id: 'large', label: LARGE, price: 390000, listedAs: 'Lotus milkshake / Nutella milkshake / Royal white large size' },
    ],
    options: [{
      id: 'type', label: L('Choose one', 'اختار وحدة'), required: true,
      choices: [
        { id: 'lotus', label: L('Lotus milkshake', 'ميلك شيك لوتس') },
        { id: 'nutella', label: L('Nutella milkshake', 'ميلك شيك نوتيلا') },
        { id: 'royal-white', label: L('Royal white', 'رويال وايت') },
      ],
    }],
  },

  // ── Crepe ────────────────────────────────────────────────────
  { id: 'nutella-crepe', category: 'crepe', name: L('Nutella regular crepe', 'كريب نوتيلا عادي'), price: 300000, image: 'nutella-crepe' },
  { id: 'nutella-fruits-crepe', category: 'crepe', name: L('Nutella + Fruits', 'نوتيلا + فواكه'), price: 350000, image: 'nutella-fruits-crepe', featured: true },
  {
    id: 'customized-crepe', category: 'crepe', name: L('Customized Crepe', 'كريب على ذوقك'), price: 350000, image: 'customized-crepe',
    description: L(
      "Kinder Bueno, Oreo, Hershey's, White Chocolate, Lotus, Galaxy",
      'كيندر بوينو، أوريو، هيرشيز، شوكولا بيضا، لوتس، غالاكسي',
    ),
    // Single choice for now — switch to several if the shop allows mixing at the same price.
    options: [{
      id: 'filling', label: L('Your pick', 'اختيارك'), required: true,
      choices: [
        { id: 'kinder-bueno', label: L('Kinder Bueno', 'كيندر بوينو') },
        { id: 'oreo', label: L('Oreo', 'أوريو') },
        { id: 'hersheys', label: L("Hershey's", 'هيرشيز') },
        { id: 'white-chocolate', label: L('White Chocolate', 'شوكولا بيضا') },
        { id: 'lotus', label: L('Lotus', 'لوتس') },
        { id: 'galaxy', label: L('Galaxy', 'غالاكسي') },
      ],
    }],
  },
  {
    id: 'nutty-crepe', category: 'crepe', name: L('Nutty Crepe', 'كريب نَتّي'), price: 350000, image: 'nutty-crepe',
    description: L(
      'A rich and indulgent treat packed with the nutty goodness of peanuts, inspired by the classic Snickers bar. Perfect for every peanut butter lover',
      'كريب غني مليان طعم الفستق السوداني، مستوحى من لوح السنيكرز. لكل يلّي بيحبوا زبدة الفستق',
    ),
  },
  {
    id: 'crepe-cake', category: 'crepe', name: L('Crepe Cake', 'كريب كيك'), price: 420000, image: 'crepe-cake',
    description: L(
      'A masterpiece of delicate layers stacked like a Swiss roll, offering a melt-in-your-mouth experience with every bite. A crepe lover’s dream!',
      'طبقات رقيقة ملفوفة متل السويس رول، بتدوب بالتمّ مع كل لقمة. حلم كل يلّي بيحبّ الكريب',
    ),
  },
  {
    id: 'cloud-crepe', category: 'crepe', name: L('Cloud crepe', 'كلاود كريب'), price: 350000, image: 'cloud-crepe',
    description: L(
      'Soft, warm, and dreamy, this crepe is loaded with gooey marshmallows that melt like a cloud on your tongue. Sweet comfort in every bite',
      'طري ودافي، محشي مارشملو ذايب بيدوب متل الغيمة على لسانك. راحة حلوة بكل لقمة',
    ),
  },
  {
    id: 'waffle-sticks', category: 'crepe', name: L('Waffle sticks', 'وافل ستيكس'), price: 200000, image: 'waffle-sticks',
    description: L(
      'Golden, crispy waffle sticks served warm with your favorite dip or topping',
      'أصابع وافل ذهبية ومقرمشة، بتنقدّم سخنة مع الصوص أو التوبينغ يلّي بتحبّه',
    ),
  },

  // ── Desserts ─────────────────────────────────────────────────
  {
    id: 'cheesecake', category: 'desserts', name: L('Cheesecake', 'تشيز كيك'), price: 200000, image: 'cheesecake',
    options: [{
      id: 'topping', label: L('Topping', 'الصوص'), required: true,
      choices: [
        { id: 'strawberry', label: L('Strawberry', 'فريز') },
        { id: 'caramel', label: L('Caramel', 'كراميل') },
        { id: 'chocolate', label: L('Chocolate', 'شوكولا') },
        { id: 'cherry', label: L('Cherry', 'كرز') },
      ],
    }],
  },
  { id: 'oreo-cream-pie', category: 'desserts', name: L('Oreo cream pie', 'أوريو كريم باي'), price: 200000, image: 'oreo-cream-pie' },

  // ── Bubble tea ───────────────────────────────────────────────
  {
    id: 'brown-sugar-bubble-tea', category: 'bubble-tea', name: L('Brown sugar bubble tea', 'بابل تي سكر أسمر'),
    price: 400000, image: 'brown-sugar-bubble-tea', featured: true,
    description: L(
      'Frothy drink made with tapioca pearls at the base of the drink',
      'مشروب كريمي مع حبّات التابيوكا بأسفل الكباية',
    ),
  },
  {
    id: 'streets-popping-pearls', category: 'bubble-tea', name: L('Streets popping pearls', 'ستريتس بوبينغ بيرلز'),
    price: 400000, image: 'streets-popping-pearls',
    description: L(
      'Fruit juice flavoring inside that “pop”s once bitten into',
      'حبّات فيها عصير فواكه بتفقع بتمّك أول ما تعضّها',
    ),
    options: [{
      id: 'flavour', label: L('Flavour', 'النكهة'), required: true,
      choices: [
        { id: 'mango', label: L('Mango', 'مانغو') },
        { id: 'strawberry', label: L('Strawberry', 'فريز') },
        { id: 'blueberry', label: L('Blueberry', 'توت أزرق') },
      ],
    }],
  },
]

/** Menu photos that also have a background-free cutout (used by the add-to-cart animation). */
const CUTOUTS = new Set([
  'brown-sugar-bubble-tea', 'cappuccino', 'cloud-crepe', 'cortado', 'crepe-cake', 'espresso', 'flat-white',
  'golden-glow', 'hello-mango-large', 'hello-mango-medium', 'hot-chocolate-belgium', 'hot-chocolate', 'hot-lotus',
  'ice-latte-large', 'ice-latte-medium', 'ice-tea-large', 'ice-tea-medium', 'large-belgium-hot-chocolate',
  'large-mocha', 'latte', 'lotus-nutella-royal-large', 'machiato', 'milkshake-large', 'milkshake-medium',
  'mocha-frappe-large', 'mocha-frappe-medium', 'mocha', 'nescafe-coffee-mate', 'nutella-crepe',
  'nutella-fruits-crepe', 'nutty-crepe', 'smoothie-large', 'smoothie-medium', 'special-streets-frappe-large',
  'special-streets-frappe-medium', 'streets-popping-pearls', 'streets-smoothie', 'waffle-sticks',
])

export const imageUrl = (slug) => (slug ? asset(`img/menu/${slug}.webp`) : null)
export const cutoutUrl = (slug) => (slug && CUTOUTS.has(slug) ? asset(`img/cut/${slug}.webp`) : null)

export const getItem = (id) => menu.find((item) => item.id === id)
export const itemsIn = (categoryId) => menu.filter((item) => item.category === categoryId)

/** Lowest price of an item, used for "from" labels. */
export const basePrice = (item) => (item.sizes ? Math.min(...item.sizes.map((s) => s.price)) : item.price)
