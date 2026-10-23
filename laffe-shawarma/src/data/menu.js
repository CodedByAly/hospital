import chickenWrap from '../assets/images/chicken-wrap.webp'
import meatWrap from '../assets/images/meat-wrap.webp'
import chickenCombo from '../assets/images/chicken-combo.webp'
import meatCombo from '../assets/images/meat-combo.webp'

/**
 * Menu — English names and prices copied from the printed menu (Instagram
 * highlight "menu"); offers from the restaurant's Instagram posts.
 * All prices are in Lebanese pounds. Arabic names are translations of the
 * English menu — adjust them freely.
 *
 * Item fields:
 *   id          unique, stable (used in carts saved on customers' devices)
 *   name        { en, ar }
 *   note        optional size / bread note shown under the name, { en, ar }
 *   category    one of the category ids below
 *   price       amount in LBP
 *   contents    optional list of what's included, [{ en, ar }]
 *   image       optional imported photo; items without one get a brand tile
 *   review      optional note for the owner — something to confirm
 *
 * Customisation (optional):
 *   options   [{ id, name: {en, ar}, required, multiple, choices: [{ id, name: {en, ar}, price }] }]
 *   addons    [{ id, name: {en, ar}, price }]
 *   removable [{ en, ar }]
 */

export const categories = [
  { id: 'offers', name: { en: 'Offers', ar: 'العروض' } },
  { id: 'wraps', name: { en: 'Shawarma Wraps', ar: 'سندويشات شاورما' } },
  { id: 'meals', name: { en: 'Shawarma Meals', ar: 'وجبات شاورما' } },
  { id: 'kebbeh', name: { en: 'Kebbeh', ar: 'كبة' } },
  { id: 'tawook', name: { en: 'Tawook', ar: 'طاووق' } },
  { id: 'hummus', name: { en: 'Hummus', ar: 'حمص' } },
  { id: 'potatoes', name: { en: 'Potatoes', ar: 'بطاطا' } },
  { id: 'burger', name: { en: 'Burger', ar: 'برغر' } },
  { id: 'sauces', name: { en: 'Sauces', ar: 'صلصات' } },
  { id: 'drinks', name: { en: 'Drinks', ar: 'مشروبات' } },
]

const ARABIC_CUT = { en: 'Arabic cut', ar: 'عربي' }
const QUARTER = { en: '1/4 kilo', ar: 'ربع كيلو' }
const HALF = { en: '1/2 kilo', ar: 'نص كيلو' }
const KILO = { en: '1 kilo', ar: 'كيلو' }
const KHARTOUSHE = { en: 'Khartoushe', ar: 'خرطوشة' }

const FRIES_AND_PEPSI = [
  { en: 'Fries', ar: 'بطاطا' },
  { en: 'Pepsi', ar: 'بيبسي' },
]

export const menuItems = [
  // Offers (Instagram posts)
  {
    id: 'offer-chicken-combo',
    name: { en: 'Large Chicken Shawarma + Fries + Pepsi', ar: 'شاورما دجاج لارج مع بطاطا و بيبسي' },
    category: 'offers',
    price: 550000,
    contents: [{ en: 'Large chicken shawarma', ar: 'شاورما دجاج لارج' }, ...FRIES_AND_PEPSI],
    image: chickenCombo,
    featured: true,
  },
  {
    id: 'offer-meat-combo',
    name: { en: 'Large Meat Shawarma + Fries + Pepsi', ar: 'شاورما لحمة لارج مع بطاطا و بيبسي' },
    category: 'offers',
    price: 850000,
    contents: [{ en: 'Large meat shawarma', ar: 'شاورما لحمة لارج' }, ...FRIES_AND_PEPSI],
    image: meatCombo,
    featured: true,
  },

  // Shawarma Wraps
  { id: 'wrap-chicken-small', name: { en: 'Small Chicken Shawarma Wrap', ar: 'شاورما دجاج صغير' }, note: KHARTOUSHE, category: 'wraps', price: 200000 },
  { id: 'wrap-lamb-small', name: { en: 'Small Lamb Shawarma Wrap', ar: 'شاورما غنم صغير' }, note: KHARTOUSHE, category: 'wraps', price: 350000 },
  {
    id: 'wrap-chicken-large',
    name: { en: 'Large Chicken Shawarma Wrap', ar: 'شاورما دجاج كبير' },
    category: 'wraps',
    price: 350000,
    image: chickenWrap,
    featured: true,
  },
  {
    id: 'wrap-lamb-large',
    name: { en: 'Large Lamb Shawarma Wrap', ar: 'شاورما غنم كبير' },
    category: 'wraps',
    price: 650000,
    image: meatWrap,
    featured: true,
    review: 'Photo is from the Instagram post captioned "Beef shawarma" — confirm it fits the lamb wrap.',
  },
  { id: 'wrap-chicken-french', name: { en: 'Chicken Shawarma in French Bread', ar: 'شاورما دجاج بخبز فرنجي' }, category: 'wraps', price: 400000 },
  { id: 'wrap-lamb-french', name: { en: 'Lamb Shawarma in French Bread', ar: 'شاورما غنم بخبز فرنجي' }, category: 'wraps', price: 700000 },

  // Shawarma Meals
  { id: 'meal-chicken-arabic', name: { en: 'Chicken Shawarma Meal', ar: 'وجبة شاورما دجاج' }, note: ARABIC_CUT, category: 'meals', price: 600000 },
  { id: 'meal-meat-arabic', name: { en: 'Meat Shawarma Meal', ar: 'وجبة شاورما لحمة' }, note: ARABIC_CUT, category: 'meals', price: 900000 },
  { id: 'meal-chicken-quarter', name: { en: 'Chicken Shawarma Meal', ar: 'وجبة شاورما دجاج' }, note: QUARTER, category: 'meals', price: 750000 },
  { id: 'meal-meat-quarter', name: { en: 'Meat Shawarma Meal', ar: 'وجبة شاورما لحمة' }, note: QUARTER, category: 'meals', price: 1250000 },
  { id: 'meal-mix-quarter', name: { en: 'Shawarma Mix Meal', ar: 'وجبة شاورما مشكّل' }, note: QUARTER, category: 'meals', price: 1150000 },
  { id: 'plate-chicken-half', name: { en: 'Chicken Shawarma Plate', ar: 'صحن شاورما دجاج' }, note: HALF, category: 'meals', price: 1500000 },
  { id: 'plate-lamb-half', name: { en: 'Lamb Meat Shawarma Plate', ar: 'صحن شاورما لحم غنم' }, note: HALF, category: 'meals', price: 2250000 },
  { id: 'plate-chicken-kilo', name: { en: 'Chicken Shawarma Plate', ar: 'صحن شاورما دجاج' }, note: KILO, category: 'meals', price: 3000000 },
  { id: 'plate-lamb-kilo', name: { en: 'Lamb Shawarma Plate', ar: 'صحن شاورما غنم' }, note: KILO, category: 'meals', price: 4500000 },

  // Kebbeh
  { id: 'kebbeh-grilled', name: { en: 'Grilled Kebbeh', ar: 'كبة مشوية' }, category: 'kebbeh', price: 250000 },
  { id: 'kebbeh-fried', name: { en: 'Fried Kebbeh', ar: 'كبة مقلية' }, category: 'kebbeh', price: 250000 },
  { id: 'kebbeh-chicken', name: { en: 'Kebbeh with Chicken Shawarma', ar: 'كبة مع شاورما دجاج' }, category: 'kebbeh', price: 500000 },
  { id: 'kebbeh-lamb', name: { en: 'Kebbeh with Lamb Shawarma', ar: 'كبة مع شاورما غنم' }, category: 'kebbeh', price: 750000 },
  { id: 'kebbeh-wrap-chicken', name: { en: 'Kebbeh Wrap with Chicken Shawarma', ar: 'لفّة كبة مع شاورما دجاج' }, category: 'kebbeh', price: 600000 },
  { id: 'kebbeh-wrap-lamb', name: { en: 'Kebbeh Wrap with Lamb Shawarma', ar: 'لفّة كبة مع شاورما غنم' }, category: 'kebbeh', price: 900000 },
  {
    id: 'kebbeh-stuffed-meal',
    name: { en: 'Fried Kibbeh Stuffed with Beef Shawarma Meal', ar: 'وجبة كبة مقلية محشية شاورما لحمة' },
    category: 'kebbeh',
    price: 1600000,
  },

  // Tawook
  { id: 'tawook-sandwich', name: { en: 'Tawook Sandwich', ar: 'سندويش طاووق' }, category: 'tawook', price: 450000 },
  { id: 'tawook-meal', name: { en: 'Tawook Meal', ar: 'وجبة طاووق' }, category: 'tawook', price: 1000000 },

  // Hummus
  { id: 'hummus-plate', name: { en: 'Hummus Plate', ar: 'صحن حمص' }, category: 'hummus', price: 400000 },
  { id: 'hummus-chicken', name: { en: 'Hummus Plate with Chicken Shawarma', ar: 'صحن حمص مع شاورما دجاج' }, category: 'hummus', price: 750000 },
  { id: 'hummus-lamb', name: { en: 'Hummus Plate with Lamb Shawarma', ar: 'صحن حمص مع شاورما غنم' }, category: 'hummus', price: 900000 },

  // Potatoes
  { id: 'fries-small', name: { en: 'Small Fries Box', ar: 'علبة بطاطا صغيرة' }, category: 'potatoes', price: 200000 },
  { id: 'fries-sandwich', name: { en: 'Fries Sandwich', ar: 'سندويش بطاطا' }, category: 'potatoes', price: 250000 },
  { id: 'fries-large', name: { en: 'Large Fries Box', ar: 'علبة بطاطا كبيرة' }, category: 'potatoes', price: 450000 },
  { id: 'fries-plate-chicken', name: { en: 'Fries Plate with Chicken Shawarma', ar: 'صحن بطاطا مع شاورما دجاج' }, category: 'potatoes', price: 900000 },

  // Burger
  { id: 'cheese-burger', name: { en: 'Cheese Burger', ar: 'تشيز برغر' }, category: 'burger', price: 550000 },

  // Sauces
  { id: 'sauce-cocktail', name: { en: 'Cocktail', ar: 'كوكتيل' }, category: 'sauces', price: 100000 },
  { id: 'sauce-sweet-smoke', name: { en: 'Sweet & Smoke', ar: 'سويت أند سموك' }, category: 'sauces', price: 100000 },
  { id: 'sauce-bbq', name: { en: 'Barbecue', ar: 'باربكيو' }, category: 'sauces', price: 100000 },
  { id: 'sauce-buffalo', name: { en: 'Buffalo', ar: 'بافلو' }, category: 'sauces', price: 100000 },
  { id: 'sauce-tarator', name: { en: 'Tarator', ar: 'طرطور' }, category: 'sauces', price: 100000 },
  { id: 'sauce-garlic', name: { en: 'Garlic', ar: 'ثوم' }, category: 'sauces', price: 100000 },
  { id: 'sauce-pomegranate', name: { en: 'Pomegranate Molasses', ar: 'دبس رمان' }, category: 'sauces', price: 100000 },
  { id: 'sauce-ketchup', name: { en: 'Ketchup', ar: 'كاتشب' }, category: 'sauces', price: 100000 },

  // Drinks
  { id: 'water-small', name: { en: 'Small Water', ar: 'مي صغيرة' }, category: 'drinks', price: 50000 },
  { id: 'tea', name: { en: 'Tea', ar: 'شاي' }, category: 'drinks', price: 100000 },
  { id: 'tropicana', name: { en: 'Tropicana Juice', ar: 'عصير تروبيكانا' }, category: 'drinks', price: 100000 },
  {
    id: 'soft-drink',
    name: { en: 'Pepsi – Mirinda – 7UP', ar: 'بيبسي – ميرندا – سفن أب' },
    category: 'drinks',
    price: 130000,
    options: [
      {
        id: 'drink',
        name: { en: 'Choose your drink', ar: 'اختار المشروب' },
        required: true,
        choices: [
          { id: 'pepsi', name: { en: 'Pepsi', ar: 'بيبسي' }, price: 0 },
          { id: 'mirinda', name: { en: 'Mirinda', ar: 'ميرندا' }, price: 0 },
          { id: '7up', name: { en: '7UP', ar: 'سفن أب' }, price: 0 },
        ],
      },
    ],
  },
  { id: 'lipton', name: { en: 'Lipton Iced Tea', ar: 'ليبتون آيس تي' }, category: 'drinks', price: 150000 },
  { id: 'water-sparkling', name: { en: 'Sparkling Water', ar: 'مي غازية' }, category: 'drinks', price: 150000 },
  { id: 'ayran', name: { en: 'Ayran (Yogurt Drink)', ar: 'عيران' }, category: 'drinks', price: 175000 },
  { id: 'lentil-soup', name: { en: 'Lentil Soup', ar: 'شوربة عدس' }, category: 'drinks', price: 250000 },
  { id: 'ayran-liter', name: { en: 'Ayran 1 Liter', ar: 'عيران ليتر' }, category: 'drinks', price: 500000 },
]

export const getItem = (id) => menuItems.find((item) => item.id === id)
