import tawookWrap from '../assets/images/tawook-wrap.webp'
import wingsBox from '../assets/images/wings-box.webp'

/**
 * Menu — copied from the restaurant's printed menu (Instagram highlight "Menu")
 * and the "New on the menu" post. Prices are exactly as published.
 *
 * Item fields:
 *   id          unique, stable (used in carts saved on customers' devices)
 *   name        as written on the menu
 *   category    one of the category ids below
 *   price       { amount, currency: 'LBP' | 'USD' }
 *   contents    optional list of what's included (meals / boxes)
 *   description optional short text
 *   image       optional imported image; items without one get a typographic tile
 *   review      optional note for the owner — something on the source menu was unclear
 *
 * Customisation (all optional, none provided by the restaurant yet):
 *   options   [{ id, name, required, multiple, choices: [{ id, name, price }] }]
 *   addons    [{ id, name, price }]           price in the item's currency
 *   removable ['بصل', 'كبيس', ...]             ingredients the customer can remove
 */

export const categories = [
  { id: 'new', name: 'جديد عالمنيو' },
  { id: 'sandwiches', name: 'ساندويش' },
  { id: 'meal', name: 'وجبة' },
  { id: 'family', name: 'جاط عائلي' },
]

const lbp = (amount) => ({ amount, currency: 'LBP' })
const usd = (amount) => ({ amount, currency: 'USD' })

export const menuItems = [
  {
    id: 'wings-box',
    name: 'بوكس الجوانح',
    category: 'new',
    price: usd(10),
    contents: ['12 جوانح', 'ثوم', 'كول سلو', 'بطاطا', 'مشروب غازي'],
    image: wingsBox,
    imagePosition: 'center 60%',
  },

  { id: 'fries-box', name: 'علبة بطاطا', category: 'sandwiches', price: lbp(200000) },
  { id: 'fries', name: 'بطاطا', category: 'sandwiches', price: lbp(250000) },
  { id: 'burger', name: 'برغر', category: 'sandwiches', price: lbp(350000) },
  { id: 'sujuk', name: 'سجق', category: 'sandwiches', price: lbp(300000) },
  { id: 'makanek', name: 'مقانق', category: 'sandwiches', price: lbp(300000) },
  { id: 'lamb-shish', name: 'غنم شقف', category: 'sandwiches', price: lbp(400000) },
  {
    id: 'kebab',
    name: 'كباب',
    category: 'sandwiches',
    price: lbp(350000),
    review: 'The menu lists "كباب" twice (350,000 and 300,000). Confirm the difference with the restaurant.',
  },
  { id: 'lamb-testicles', name: 'بيض غنم', category: 'sandwiches', price: lbp(350000) },
  { id: 'sweetbreads', name: 'حلويات', category: 'sandwiches', price: lbp(350000) },
  { id: 'beef-shish', name: 'بقر شقف', category: 'sandwiches', price: lbp(300000) },
  {
    id: 'kebab-2',
    name: 'كباب',
    category: 'sandwiches',
    price: lbp(300000),
    review: 'Second "كباب" line on the menu — rename once confirmed.',
  },
  {
    id: 'tawook',
    name: 'طاووق أحمر + أبيض',
    category: 'sandwiches',
    price: lbp(300000),
    image: tawookWrap,
    imagePosition: 'center 30%',
    featured: true,
  },

  {
    id: 'meal',
    name: 'وجبة',
    category: 'meal',
    price: lbp(1000000),
    contents: ['٢ شقف', '٢ كباب + سرفيس', '٢ طاووق + بيبسي'],
    featured: true,
  },

  {
    id: 'family-platter',
    name: 'جاط عائلي',
    category: 'family',
    price: usd(25),
    contents: [
      '٥ شقف',
      '٦ كباب + سرفيس',
      '٥ طاووق + ثوم + كبيس',
      '١ مقانق + بيواز',
      '١ سجق + سلطة ملفوف',
      '+ حمص',
    ],
    featured: true,
  },
]

export const getItem = (id) => menuItems.find((item) => item.id === id)
