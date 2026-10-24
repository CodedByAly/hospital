// The Bean Avenue menu, copied from the printed menu (Instagram "MENU" highlight).
//
// Item shapes:
//   { name, price }                 single price
//   { name, prices: [a, b, c] }     several prices; labelled with the category's `sizes`
//                                   when the counts match, otherwise shown as "a / b"
//   { name, price, note }           short line printed under the name
//
// Spelling slips on the printed menu were corrected (Earl Grey, Jasmine, Phoenix,
// Turmeric, Triple, Salted Caramel). Prices are exactly as printed, including 3.23
// (Double Macchiato) and 4.44 (Nescafé) — confirm those two with the café.

export const groups = [
  { id: 'coffee', title: 'Coffee' },
  { id: 'drinks', title: 'Tea, shakes & more' },
  { id: 'food', title: 'Food & desserts' },
]

export const menu = [
  {
    id: 'specials',
    group: null, // shown on its own band above the rest of the menu
    title: 'Special items',
    items: [
      { name: 'Illy Cream', prices: [4, 6] },
      { name: 'Collagen Matcha', price: 7 },
      { name: 'Dubai Chocolate Cup', price: 8 },
      { name: 'Strawberry Dubai Chocolate', price: 8 },
    ],
  },
  {
    id: 'espresso',
    group: 'coffee',
    title: 'Espresso based',
    sizes: ['S', 'M', 'L'],
    note: 'All of our coffee can be served as decaf.',
    items: [
      { name: 'Cappuccino', prices: [3.5, 4, 4.5] },
      { name: 'Latte', prices: [3.5, 4, 4.5] },
      { name: 'Espresso', price: 2.4 },
      { name: 'Double Espresso', price: 3 },
      { name: 'Single Macchiato', price: 3 },
      { name: 'Double Macchiato', price: 3.23 },
      { name: 'Cortado', price: 3.5 },
      { name: 'Flat White', price: 3.5 },
      { name: 'Americano', price: 3.75 },
    ],
  },
  {
    id: 'filtered',
    group: 'coffee',
    title: 'Filtered coffee',
    sizes: ['S', 'M', 'L'],
    items: [
      { name: 'American', prices: [3, 3.5, 4] },
      { name: 'French Press', price: 4.5 },
      { name: 'Cold Brew', price: 5 },
      { name: 'V60', price: 6 },
    ],
  },
  {
    id: 'hot-drinks',
    group: 'coffee',
    title: 'Hot drinks',
    sizes: ['S', 'M', 'L'],
    items: [
      { name: 'Biscoff Latte', price: 5.5 },
      { name: 'Caramel Macchiato', prices: [3.75, 4.25, 4.75] },
      { name: 'Coffeenut', prices: [3.75, 4.25, 4.75] },
      { name: 'Dark Mocha', prices: [3.75, 4.25, 4.75] },
      { name: 'White Mocha', prices: [3.75, 4.25, 4.75] },
      { name: 'Nescafé', price: 4.44 },
      { name: 'Salted Caramel Latte', price: 5.5 },
      { name: 'Hot Chocolate', prices: [4, 4.5, 5] },
      { name: 'Matcha Latte', price: 4.5 },
      { name: 'Organic Matcha', price: 5.5 },
      { name: 'Spanish Latte', prices: [4, 4.8, 5.4] },
      { name: 'BA Latte', prices: [4, 5, 6] },
      { name: 'Sledgehammer', price: 5 },
    ],
  },
  {
    id: 'iced-drinks',
    group: 'coffee',
    title: 'Iced drinks',
    items: [
      { name: 'Iced Americano', price: 4 },
      { name: 'Iced Caramel Macchiato', price: 4.8 },
      { name: 'Iced Latte', price: 4.25 },
      { name: 'Iced Matcha', price: 4.5 },
      { name: 'Iced Organic Matcha', price: 5.5 },
      { name: 'Iced Salted Caramel Latte', price: 5.5 },
      { name: 'Iced Mocha Latte', price: 4.8 },
      { name: 'Iced Spanish Latte', price: 4.8 },
      { name: 'Iced White Mocha', price: 4.8 },
      { name: 'BA Iced Latte', price: 5 },
      { name: 'Iced Coffeenut', price: 4.8 },
    ],
    addons: {
      title: 'Coffee add-ons',
      items: [
        { name: 'Lactose free', price: 0.33 },
        { name: 'Add syrup', price: 0.33 },
        { name: 'Non-dairy milk', price: 1 },
        { name: 'Decaf', price: 0.75 },
      ],
    },
  },
  {
    id: 'frappes',
    group: 'coffee',
    title: 'Frappés',
    note: 'All of our coffee can be served as decaf.',
    items: [
      { name: 'Vanilla Frappé', price: 5.5 },
      { name: 'Mocha Frappé', price: 5.5 },
      { name: 'Caramel Frappé', price: 5.5 },
      { name: 'Roasted Hazelnut Frappé', price: 5 },
      { name: 'BA Frappé', price: 6.5 },
      { name: 'Salted Caramel Frappé', price: 6 },
    ],
  },
  {
    id: 'rakwah',
    group: 'coffee',
    title: 'Rakwah',
    items: [
      { name: 'Rakwah Seda', price: 3.5 },
      { name: 'Rakwah + Cardamom', price: 4 },
    ],
  },
  {
    id: 'milkshakes',
    group: 'drinks',
    title: 'Milkshakes',
    items: [
      { name: 'Biscoff Milkshake', price: 6.5 },
      { name: 'Chocolate Milkshake', price: 5 },
      { name: 'Cookies and Cream Milkshake', price: 5.5 },
      { name: 'Vanilla Milkshake', price: 5 },
      { name: 'Chouchou', price: 6 },
      { name: 'Red Velvet', price: 6 },
      { name: 'Strawberry Milkshake', price: 6.5 },
    ],
  },
  {
    id: 'hot-teas',
    group: 'drinks',
    title: 'Hot teas',
    items: [
      { name: 'Blue Flower Earl Grey', price: 3 },
      { name: 'Body and Soul', price: 3 },
      { name: 'Cinnamon Orange', price: 3 },
      { name: 'English Breakfast', price: 2.5 },
      { name: 'Ginger Lemon', price: 3 },
      { name: 'Matcha Berries', price: 3.5 },
      { name: 'Mixed Berries', price: 3.5 },
      { name: 'Moroccan Tea', price: 3 },
      { name: 'Puriteal', price: 3 },
      { name: 'Rooibos Bourbon Vanilla', price: 3 },
      { name: 'Scents and Secrets', price: 3 },
      { name: 'Spicy Rooibos', price: 3 },
      { name: 'Teal Blue', price: 3 },
      { name: 'Turmeric Matcha', price: 3 },
      { name: 'Vanilla Classic', price: 4 },
      { name: 'White Silk', price: 4 },
      { name: 'Jasmine Dragon Phoenix', price: 5.5 },
    ],
  },
  {
    id: 'iced-teas',
    group: 'drinks',
    title: 'Iced teas',
    items: [
      { name: 'Iced Tea Peach', price: 4 },
      { name: 'Iced Tea Lemon', price: 4 },
      { name: 'Iced Tea Raspberry', price: 4 },
      { name: 'Iced Tea Berries', price: 5 },
    ],
    addons: {
      title: 'Add-ons',
      items: [{ name: 'Boba', price: 1 }],
    },
  },
  {
    id: 'refreshers',
    group: 'drinks',
    title: 'Refreshers',
    items: [
      { name: 'Fresh Orange Juice', price: 5 },
      { name: 'Summer Mix', price: 4.5 },
      { name: 'Mango Smoothie', price: 4.5 },
      { name: 'Blueberry Smoothie', price: 4.5 },
      { name: 'Strawberry Smoothie', price: 4.5 },
      { name: 'Minted Lemonade', price: 5 },
      { name: 'Strawberry Banana', price: 5 },
      { name: 'Apple Coco', price: 5 },
      { name: 'Aqua', price: 5 },
      { name: 'Fruits Aura', price: 5 },
      { name: 'Spicy Mango', price: 5 },
    ],
  },
  {
    id: 'beverages',
    group: 'drinks',
    title: 'Beverages',
    items: [
      { name: 'Water 0.5L', price: 0.67 },
      { name: 'Via Sparkling', price: 1.5 },
      { name: 'Via Glass Water 0.33L', price: 1.2 },
    ],
  },
  {
    id: 'frozen-yogurt',
    group: 'food',
    title: 'Frozen yogurt',
    sizes: ['Plain', 'Flavored'],
    items: [
      { name: 'Medium', note: 'With 2 toppings', prices: [4, 5] },
      { name: 'Large', note: 'With 4 toppings', prices: [5, 6] },
    ],
    addons: {
      title: 'Extra toppings',
      items: [
        { name: 'Regular', price: 0.5 },
        { name: 'Premium', price: 1 },
      ],
    },
  },
  {
    id: 'desserts',
    group: 'food',
    title: 'Desserts',
    items: [
      { name: 'Brownie', price: 4 },
      { name: 'Brownie with Toppings', price: 5 },
      { name: 'Brookie', price: 5 },
      { name: 'Fondant', price: 4 },
      { name: 'Carrot Cake', price: 5 },
      { name: 'Red Velvet', price: 5 },
      { name: 'Lazy Cake', price: 5 },
      { name: 'Honey Cake', price: 6 },
      { name: 'San Sebastian', price: 5 },
      { name: 'Strawberry Cheesecake', price: 5 },
      { name: 'Raspberry Cheesecake', price: 5 },
      { name: 'Red Velvet Cheesecake', price: 5 },
      { name: 'Tiramisu', price: 5 },
      { name: 'Pistachio Tiramisu', price: 6 },
      { name: 'Chocolate Muffin', price: 4 },
      { name: 'Blueberry Muffin', price: 4 },
      { name: 'Orange Cake', price: 4 },
      { name: 'Cookies', price: 5, note: 'Ask for flavors' },
      { name: 'Banana Pudding', price: 6 },
    ],
    addons: {
      title: 'Add-ons',
      items: [
        { name: 'Frozen yogurt', price: 2 },
        { name: 'Sauce', price: 0.5 },
      ],
    },
  },
  {
    id: 'baked',
    group: 'food',
    title: 'Freshly baked',
    items: [
      { name: 'Thyme Croissant', price: 4 },
      { name: 'Cheese Croissant', price: 4.5 },
      { name: 'Triple Chocolate Croissant', price: 5 },
      { name: 'Almond Croissant', price: 6 },
      { name: 'Cinnamon Roll', price: 5 },
    ],
  },
  {
    id: 'salads',
    group: 'food',
    title: 'Salads',
    items: [
      { name: 'Chef Salad', price: 9 },
      { name: 'Chicken Caesar Salad', price: 10 },
      { name: 'Strawberry Feta Salad', price: 9 },
      { name: 'Tuna Salad', price: 10 },
      { name: 'Kale Quinoa Salad', price: 9 },
    ],
  },
  {
    id: 'sandwiches',
    group: 'food',
    title: 'Sandwiches',
    items: [
      { name: 'Chicken Avocado Sandwich', price: 9 },
      { name: 'Halloumi Pesto Sandwich', price: 7.5 },
      { name: 'Turkey & Cheese Sandwich', price: 7.5 },
      { name: 'Chicken Club Sandwich', price: 9 },
    ],
  },
]

// 2.4 -> "2.4", 4 -> "4", 0.67 -> "0.67" — same as the printed menu.
export const formatPrice = (n) => String(Number(n.toFixed(2)))
