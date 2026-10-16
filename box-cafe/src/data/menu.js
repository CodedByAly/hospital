// Box Cafe menu, transcribed from the printed menu (PDF). Prices in USD.
//
// Item fields
//   name     shown name (obvious spelling slips in the print are corrected)
//   price    single price
//   sizes    [small, large] for drinks served in two sizes
//   note     small line under the name (flavours, "add" options)
//   lines    recipe lines for crepes and pancakes (BASE / TOP / SAUCE ...)
//
// Group fields
//   branches   list of branch ids that serve this section (omit = every branch)

const s = (name, small, large, note) => ({ name, sizes: [small, large], note });
const p = (name, price, note, lines) => ({ name, price, note, lines });

export const menuGroups = [
  {
    id: 'coffee',
    label: 'Coffee & Drinks',
    short: 'Drinks',
    categories: [
      {
        id: 'cold-coffee',
        name: 'Cold Coffee',
        image: 'cold-coffee',
        items: [
          s('Cold Brew', 2.5, 3.5),
          s('Iced Latte', 3.5, 4.5, 'Add caramel, vanilla, coconut, Irish cream, hazelnut, pistachio'),
          p('Frappuccino', 4.5, 'Add caramel'),
          s('Mocha Frappe', 4, 5),
          s('Matcha Frappe', 4.5, 5.5, 'Add strawberry'),
        ],
      },
      {
        id: 'hot-coffee',
        name: 'Hot Coffee',
        items: [
          p('Espresso', 2),
          p('Espresso Con Panna', 2.5),
          p('Double Espresso', 2.5),
          p('Double Espresso Macchiato', 3),
          p('Turkish Coffee', 2),
          p('Americano', 3),
          p('Instant Coffee', 2),
          p('Caffe Latte', 4, 'Add caramel, vanilla, coconut, Irish cream, hazelnut, pistachio'),
          p('Flat White', 3.5),
          p('Cappuccino', 4, 'Add cinnamon'),
          p('Mocha', 4),
          p('BC Mocha', 5.5),
          s('Hot Chocolate', 3.5, 4.5),
          s('BC Hot Chocolate', 4, 5),
        ],
      },
      {
        id: 'special-hot-mix',
        name: 'Special Hot Mix',
        items: [s('Salted Caramel', 3.5, 4.5), s('Cookies & Cream', 3.5, 4.5), s('Charcoal Mocha', 4, 5), s('Matcha', 3.5, 4.5)],
      },
      {
        id: 'boxcafe-specials',
        name: 'BoxCafe Specials',
        image: 'frappe',
        items: [p('Tiramisu', 6), p('Salted Caramel', 5), p('Cocomelon Shake', 5), p('Charcoal Mocha', 6), p('Peanut Butter Coffee', 6)],
      },
      {
        id: 'milkshakes',
        name: 'Milkshakes',
        image: 'milkshake',
        items: [s('Mixed Berries', 4, 5), s('Strawberry', 4, 5), s('Vanilla', 4, 5), s('Chocolate', 4, 5), s('Cookies & Cream', 4, 5)],
      },
      {
        id: 'smoothies',
        name: 'Smoothies',
        items: [p('Kiwi Apple', 4.5), p('Strawberry', 4.5), p('Mango', 4.5), p('Passion Fruit Mango', 4.5)],
      },
      {
        id: 'refreshers',
        name: 'Lemonade, Iced Tea & Fruit Ade',
        short: 'Refreshers',
        image: 'fruit-ade',
        items: [
          s('Lemonade', 4, 5, 'Basil, lavender, ward & watermelon'),
          s('Iced Tea', 3, 4, 'Peach, lemon, berries'),
          s('Fruit Ade', 3, 4, 'Add strawberry, mixed berries, mango, peach, watermelon'),
        ],
      },
      {
        id: 'tea',
        name: 'Tea Selection',
        items: [p('Tea Selection', 2.5)],
      },
    ],
    footnote: {
      title: 'Add on',
      text: 'Whipped cream, extra shot, syrup, decaf. Skimmed, lactose free, almond or coconut milk.',
    },
  },
  {
    id: 'yummies',
    label: 'Our Yummies',
    short: 'Yummies',
    categories: [
      {
        id: 'viennoiseries',
        name: 'Viennoiseries',
        image: 'croissant',
        items: [
          p('Croissant Chocolate', 4.5),
          p('Croissant Cheese', 4),
          p('Croissant Thym', 4),
          p('Cinnamon Rolls', 4, 'Cream cheese, Nutella or Lotus +1$'),
        ],
      },
      { id: 'muffins', name: 'Muffins', items: [p('Chocolate', 3), p('Vanilla', 3), p('Red Velvet', 3)] },
      { id: 'cookies', name: 'Cookies', image: 'cookies', items: [p('Chocolate', 4), p('Vanilla', 4)] },
      {
        id: 'cookies-filled',
        name: 'Cookies Filled',
        items: [p('Lotus', 5), p('Ferrero Rocher', 5), p('Raspberry Caramel Brownie', 5)],
      },
      {
        id: 'cheesecake-cups',
        name: 'Cheese Cake Cups',
        items: [p('Oreo', 6), p('Lotus', 6), p('Blueberry', 6), p('Strawberry', 6)],
      },
      { id: 'brownies', name: 'Brownies', image: 'brownie', items: [p('Brookie', 4.5), p('Nutella', 6), p('Lotus', 6)] },
      {
        id: 'cakes',
        name: 'Cakes',
        image: 'cupcake',
        items: [
          p('Red Velvet', 4.5),
          p('Chocolate Fudge', 5),
          p('Honey Cake', 4.5),
          p('Orange Cake', 3.5),
          p('Lotus Cheese Cake', 5),
          p('Peanut Butter Cake', 6),
        ],
      },
      { id: 'pizza-baguette', name: 'Pizza Baguette', items: [p('Pepperoni', 4), p('Margherita', 3.5)] },
      {
        id: 'sandwiches',
        name: 'Sandwiches',
        image: 'sandwich',
        items: [
          p('Salami & Cheese Sandwich', 7),
          p('Halloumi Sandwich', 6),
          p('Turkey & Cheese Sandwich', 6.5),
          p('Turkey & Cheese Club', 6),
        ],
      },
    ],
  },
  {
    id: 'shakes',
    label: 'Shakes & Frozen',
    short: 'Shakes',
    categories: [
      {
        id: 'healthy-shakes',
        name: 'Healthy Shakes',
        items: [
          p('Summer Tan Shake', 7, 'Carrot, orange, lemon, ginger'),
          p('Fresh Fusion Shake', 7, 'Banana, strawberry, apple'),
          p('Delight Light Shake', 7, 'Turmeric, ginger, coconut milk, orange, banana'),
        ],
      },
      {
        id: 'frozen-yoghurt',
        name: 'Frozen Yoghurt',
        items: [p('Small', 4.5, '3 toppings'), p('Large', 6, '5 toppings')],
      },
      {
        id: 'merry-cream',
        name: 'Merry Cream',
        items: [p('Small', 3.5, '3 toppings'), p('Large', 5, '5 toppings')],
      },
    ],
    footnote: {
      title: 'Pick your flavor',
      text: 'Caramel, chocolate, strawberry, pistachio, peach, mango, ananas, passion fruit.',
    },
  },
  {
    id: 'crepes',
    label: 'Cooked Crème Crêpes',
    short: 'Crêpes',
    logo: 'cooked-creme',
    categories: [
      {
        id: 'sweet-crepes',
        name: 'Sweet Crepes',
        image: 'sweet-crepe',
        items: [
          p('Crème Rollie', 5.5, null, ['Base: Nutella or Kinder', 'Top: nuts, banana & strawberry', 'Sauce']),
          p('Paris Meets Tokyo', 6.5, null, [
            'Base: Nutella or pistachio, with white or chocolate Bueno, with banana & strawberry',
            'Top: Oreo or Lotus + 1 topping',
            'Sauce',
          ]),
          p('Triangle Sucré', 7, null, ["Base: Hershey's white or dark, with Reese's cup", 'Top: 2 toppings choices', 'Sauce: 2 sauces']),
          p('Twist by Cooked Crème', 6.5, null, ['Base: creme, Nutella, 2 fruits', 'Top: 2 toppings + burnt sugar', 'Add: Merry Cream +2.5$']),
        ],
      },
      {
        id: 'salty-crepes',
        name: 'Salty Crepes',
        image: 'salty-crepe',
        items: [
          p('Crêpesto', 6, null, ['Base: pesto & cheese', 'Top: oregano & pickles']),
          p('Turkey Mood', 6.5, null, ['Base: turkey & cheese', 'Top: oregano & pickles']),
        ],
      },
      {
        id: 'pancakes',
        name: 'Pancakes',
        image: 'pancakes',
        items: [p('7 Bites', 8.5, null, ['7 pancakes (chocolate or regular)', 'Top: 2 sauces, 2 fruits, Oreo or Lotus & any 2 toppings'])],
      },
      {
        id: 'my-crepe',
        name: 'My Crepe, My Way',
        note: 'Customize your own',
        items: [
          p('Base', 5),
          p('General topping', 0.8, 'Oreo, Smarties, nuts, marshmallow...'),
          p('General fruit', 0.8, 'Banana, strawberry'),
          p('Exotic fruit', 1.2, 'Kiwi, ananas, mango'),
          p('General sauce', 0.8, 'Chocolate, white'),
          p('Spread', 1.5, 'Nutella, Oreo, Lotus, peanut butter'),
          p('Regular chocolate', 1.5, 'Twirl, Kinder, Bueno'),
          p('Extra chocolate', 2, "Cadbury, Lindt, M&M's"),
          p('Cheese', 2),
        ],
      },
    ],
  },
  {
    id: 'boxbun',
    label: 'Box Bun',
    short: 'Box Bun',
    logo: 'boxbun',
    branches: ['zaarour'],
    categories: [
      {
        id: 'burgers',
        name: 'Burgers',
        note: 'Add meat +3$ · Combo +1$',
        items: [
          p('Classic', 8, 'Beef patty, mayo, ketchup, pickles, lettuce, tomato, onion and cheddar cheese'),
          p('Grand Chicken Burger', 8, 'Breaded chicken breast, pickles, cheddar cheese, lettuce, tomato, mustard and garlic mayo sauce'),
          p('Cheese Up Mozzarella Burger', 9, 'Beef patty, breaded mozzarella patty, cocktail sauce, pickles, lettuce and tomato'),
        ],
      },
      {
        id: 'hot-dogs',
        name: 'Hot Dogs',
        note: 'Combo +1$',
        items: [
          p('Classic', 7, 'Pork hot dog, mustard, ketchup, chips and cheddar cheese'),
          p('Boxbun Hot Dog', 8, 'Pork hot dog, cherry tomato, pepperoni, mustard, chips and cheddar cheese'),
        ],
      },
      {
        id: 'fries',
        name: 'Fries',
        items: [p('French Fries', 3), p('Boxbun Fries', 6, 'French fries with spices topped with melted cheddar cheese')],
      },
      {
        id: 'chicken-fries',
        name: 'Chicken with Fries',
        items: [p('Chicken with Fries', 7.5, 'French fries with chicken escalope, cheddar cheese and pickles')],
      },
    ],
  },
];

export const groupsForBranch = (branch) =>
  menuGroups.filter((g) => !g.branches || (branch && g.branches.includes(branch.id)));

// Products shown on the 3D shelf at the top, each linked to its section.
export const shelf = [
  { image: 'cold-coffee', label: 'Cold Coffee', category: 'cold-coffee' },
  { image: 'croissant', label: 'Viennoiseries', category: 'viennoiseries' },
  { image: 'milkshake', label: 'Milkshakes', category: 'milkshakes' },
  { image: 'sweet-crepe', label: 'Sweet Crepes', category: 'sweet-crepes' },
  { image: 'brownie', label: 'Brownies', category: 'brownies' },
  { image: 'fruit-ade', label: 'Fruit Ade', category: 'refreshers' },
  { image: 'pancakes', label: 'Pancakes', category: 'pancakes' },
  { image: 'cupcake', label: 'Cakes', category: 'cakes' },
  { image: 'frappe', label: 'BoxCafe Specials', category: 'boxcafe-specials' },
  { image: 'sandwich', label: 'Sandwiches', category: 'sandwiches' },
  { image: 'cookies', label: 'Cookies', category: 'cookies' },
];

export const img = (name) => `img/${name}.webp`;
