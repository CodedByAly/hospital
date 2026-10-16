// Talia's menu, transcribed from the restaurant's own digital menu.
// Names, descriptions and prices match it exactly.
//
// Item fields
//   id           unique slug
//   name         as printed on the menu
//   description  as printed (omit if the menu has none)
//   price        number in USD, or null when the price is not known yet
//                (items with a null price are shown but cannot be ordered)
//   image        file name in /public/images/menu without extension (omit = placeholder)
//   options      optional choice groups, e.g.
//                [{ id: 'size', label: 'Size', required: true,
//                   choices: [{ id: 'sm', label: 'Small', price: 0 }, { id: 'lg', label: 'Large', price: 1 }] }]
//   addons       optional extras, e.g. [{ id: 'cheese', label: 'Extra cheese', price: 0.5 }]
//
// The menu does not list sizes or extras yet, so no item has `options` or
// `addons`. The ordering screen supports both as soon as they are added here.

const i = (id, name, description, price, image) => ({ id, name, description, price, image });

export const menuGroups = [
  {
    id: 'food',
    label: 'Food',
    categories: [
      {
        id: 'breakfast',
        name: 'Breakfast',
        items: [
          i('labneh-platter', 'Labneh Platter', 'Fresh traditional labneh platter served with olive oil', 3, 'labneh-platter'),
          i('mushakal-platter', 'Mushakal Platter', 'Assorted platter of mortadella, halloumi, turkey & emmental', 8, 'mushakal-platter'),
          i('omlet', 'Omlet', 'Classic plain whipped egg omelette', 4.5, 'omlet'),
          i('omlet-cheese', 'Omlet Cheese', 'Fluffy egg omelette stuffed with melted cheese', 5.5, 'omlet-cheese'),
          i('foul', 'Foul', 'Traditional cooked fava beans seasoned with lemon and olive oil', 4.5, 'foul'),
          i('mchawche', 'Mchawche', undefined, 4.5, 'mchawche'),
        ],
      },
      {
        id: 'manakish',
        name: 'Manakish',
        items: [
          i('zaatar', 'Zaatar', 'Classic thyme and sesame manakish', 2, 'zaatar'),
          i('zaatar-special', 'Zaatar Special', 'Special zaatar mix with extra toppings', 3, 'zaatar-special'),
          i('cheese-manakish', 'Cheese', 'Traditional melted cheese manakish', 3.5, 'cheese-manakish'),
          i('onion-tomato', 'Onion & Tomato', 'Fresh diced onions and tomatoes with spices', 3, 'onion-tomato'),
          i('onion-tomato-cheese', 'Onion, Tomato & Cheese', 'Onions, tomatoes, and melted cheese mix', 4, 'onion-tomato-cheese'),
          i('mortadella-cheese', 'Mortadella & Cheese', 'Mortadella topped with melted cheese', 4.5, 'mortadella-cheese'),
          i('soujouk-cheese', 'Soujouk & Cheese', 'Spiced soujouk sausage with melted cheese', 5.5, 'soujouk-cheese'),
          i('turkey-mortadella-cheese', 'Turkey Mortadella & Cheese', 'Smoked turkey mortadella with cheese', 5.5, 'turkey-mortadella-cheese'),
          i('awarma-cheese', 'Awarma & Cheese', 'Traditional minced meat awarma with cheese', 6, 'awarma-cheese'),
        ],
      },
      {
        id: 'appetizers',
        name: 'Appetizers',
        items: [
          i('french-fries', 'French Fries', 'Crispy golden french fries', 3, 'french-fries'),
          i('curly-fries', 'Curly Fries', 'Seasoned curly potato fries', 5, 'curly-fries'),
          i('mozzarella-sticks', 'Mozzarella Sticks', 'Fried breaded mozzarella cheese sticks', 4.5),
          i('cheese-fries', 'Cheese Fries', 'French fries topped with melted warm cheddar cheese', 6),
          i('chicken-tenders', 'Chicken Tenders', 'Crispy fried chicken tender strips', 6, 'chicken-tenders'),
        ],
      },
      {
        id: 'sandwiches',
        name: 'Sandwiches',
        items: [
          i('chicken-sub', 'Chicken Sub', 'Classic chicken sub roll with veggies and dressing. Served with fries', 7, 'chicken-sub'),
          i('tawouk-sandwich', 'Tawouk Sandwich', 'Grilled marinated chicken tawouk with garlic paste. Served with fries', 7, 'tawouk-sandwich'),
          i('crispy-chicken-sandwich', 'Crispy Chicken Sandwich', 'Crispy fried chicken breast with special sauce. Served with fries', 7.5, 'crispy-chicken-sandwich'),
          i('bbq-sandwich', 'BBQ Sandwich', 'Chicken with BBQ sauce. Served with fries', 7),
          i('fajita-sandwich', 'Fajita Sandwich', 'Marinated chicken strips with bell peppers and onions. Served with fries', 8, 'fajita-sandwich'),
          i('philadelphia-sandwich', 'Philadelphia Sandwich', 'Sliced beef steak with melted cheese and peppers. Served with fries', 9, 'philadelphia-sandwich'),
        ],
      },
      {
        id: 'burgers',
        name: 'Burgers',
        items: [
          i('lebanese-beef-burger', 'Lebanese Beef Burger', 'Classic Lebanese style beef burger with coleslaw. Served with fries', 8),
          i('cheese-beef-burger', 'Cheese Beef Burger', 'Juicy beef patty topped with melted cheddar. Served with fries', 9),
          i('crunchy-chicken-burger', 'Crunchy Chicken Burger', 'Crispy crunchy chicken patty with lettuce and sauce. Served with fries', 8),
          i('mushroom-beef-burger', 'Mushroom Beef Burger', 'Beef burger topped with creamy mushroom sauce. Served with fries', 10, 'mushroom-beef-burger'),
          i('zinger-burger', 'Zinger Burger', 'Crispy crunchy chicken patty with lettuce and spicy sauce. Served with fries', 8),
        ],
      },
      {
        id: 'pizza',
        name: 'Pizza',
        items: [
          i('margherita-pizza', 'Margherita Pizza', 'Fresh basil, tomato sauce, and mozzarella', 7, 'margherita-pizza'),
          i('vegetable-pizza', 'Vegetable Pizza', 'Mixed seasonal vegetables with cheese', 7.5, 'vegetable-pizza'),
          i('pepperoni-pizza', 'Pepperoni Pizza', 'Classic pepperoni pizza with mozzarella and sauce', 8, 'pepperoni-pizza'),
          i('barbecue-pizza', 'Barbecue Pizza', 'BBQ sauce base with grilled chicken & toppings', 9, 'barbecue-pizza'),
          i('chicken-alfredo-pizza', 'Chicken Alfredo Pizza', 'Creamy Alfredo sauce with grilled chicken', 10, 'chicken-alfredo-pizza'),
        ],
      },
      {
        id: 'pasta',
        name: 'Pasta',
        items: [
          i('fettuccine-alfredo', 'Fettuccine Alfredo', 'Fettuccine pasta in rich creamy alfredo mushroom sauce', 8.5, 'fettuccine-alfredo'),
          i('penne-arrabbiata', 'Penne Arrabbiata', 'Penne pasta in spicy tomato garlic sauce', 7, 'penne-arrabbiata'),
          i('chicken-pesto-pasta', 'Chicken Pesto Pasta', 'Pasta tossed in fresh basil pesto cream sauce with chicken', 8, 'chicken-pesto-pasta'),
          i('talia-penne-rose-shrimps', 'Talia Pasta Penne Rose Shrimps', 'Penne pasta in creamy rose sauce with shrimps', 10, 'talia-penne-rose-shrimps'),
        ],
      },
      {
        id: 'platters',
        name: 'Platters',
        items: [
          i('chicken-mushroom-platter', 'Chicken Mushroom Platter', 'Served with rice, nuts, chicken, cream, pineapple & veggies', 14, 'chicken-mushroom-platter'),
          i('chicken-curry-platter', 'Chicken Curry Platter', 'Curry spiced chicken served with rice, nuts, pineapple & cream', 13, 'chicken-curry-platter'),
          i('steak-mushroom-platter', 'Steak Mushroom Platter', 'Tender steak with mushroom sauce served with rice & veggies', 15, 'steak-mushroom-platter'),
        ],
      },
      {
        id: 'salads',
        name: 'Salads',
        items: [
          i('caesar-salad', 'Caesar Salad', 'Romaine lettuce, parmesan, croutons & caesar dressing', 7, 'caesar-salad'),
          i('rocca-salad', 'Rocca Salad', 'Fresh rocca leaves, mushrooms, parmesan & balsamic dressing', 7, 'rocca-salad'),
          i('crab-salad', 'Crab Salad', 'Special Crab Salad mix', 7, 'crab-salad'),
        ],
      },
    ],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    categories: [
      {
        id: 'milkshakes',
        name: 'Milkshakes',
        items: [
          i('chocolate-milkshake', 'Chocolate Milkshake', 'Creamy chocolate milkshake', 4.5, 'chocolate-milkshake'),
          i('bubble-gum-milkshake', 'Bubble Gum Milkshake', 'Sweet bubble gum flavored milkshake', 4.5, 'bubble-gum-milkshake'),
          i('caramel-milkshake', 'Caramel Milkshake', 'Sweet caramel blended milkshake', 4.5, 'caramel-milkshake'),
          i('vanilla-milkshake', 'Vanilla Milkshake', 'Classic vanilla bean milkshake', 4.5, 'vanilla-milkshake'),
          i('blueberry-milkshake', 'Blueberry Milkshake', 'Fresh blueberry ice cream shake', 4.5, 'blueberry-milkshake'),
          i('nutella-milkshake', 'Nutella Milkshake', 'Rich nutella hazelnut chocolate shake', 5, 'nutella-milkshake'),
          i('strawberry-milkshake', 'Strawberry Milkshake', 'Rich blend of fresh strawberry and ice cream', 5, 'strawberry-milkshake'),
          i('chocolate-coconut-shake', 'Chocolate Coconut Shake', 'Chocolate and coconut tropical milkshake blend', 5, 'chocolate-coconut-shake'),
          i('oreo-milkshake', 'Oreo Milkshake', 'Crushed oreo cookies blended with cream', 4.5, 'oreo-milkshake'),
          i('lotus-milkshake', 'Lotus Milkshake', 'Biscoff lotus cookie butter milkshake', 5, 'lotus-milkshake'),
          i('strawberry-nutella-milkshake', 'Strawberry Nutella Milkshake', 'Fresh strawberry blended with nutella chocolate', 5.5, 'strawberry-nutella-milkshake'),
          i('cheese-shake', 'Cheese Shake', 'Special signature cheesecake style shake', 5.5, 'cheese-shake'),
          i('pistachio-milkshake', 'Pistachio Milkshake', 'Premium pistachio nut milkshake', 5, 'pistachio-milkshake'),
        ],
      },
      {
        id: 'smoothies',
        name: 'Smoothies',
        items: [
          i('strawberry-smoothie', 'Strawberry Smoothie', 'Blended strawberry ice smoothie', 4.5, 'strawberry-smoothie'),
          i('mango-smoothie', 'Mango Smoothie', 'Rich tropical mango fruit smoothie', 4.5, 'mango-smoothie'),
          i('passion-fruit-smoothie', 'Passion Fruit Smoothie', 'Exotic passion fruit smoothie', 4.5, 'passion-fruit-smoothie'),
          i('peach-smoothie', 'Peach Smoothie', 'Sweet peach ice smoothie', 4, 'peach-smoothie'),
          i('strawberry-mango-smoothie', 'Strawberry Mango Smoothie', 'Dual flavor strawberry & mango blend', 4.5, 'strawberry-mango-smoothie'),
          i('passion-peach-smoothie', 'Passion Peach Smoothie', 'Passion fruit combined with sweet peach', 4, 'passion-peach-smoothie'),
          i('pineapple-smoothie', 'Pineapple Smoothie', 'Refreshing tropical pineapple blend', 4, 'pineapple-smoothie'),
          i('exotic-smoothie', 'Exotic Smoothie', 'Special tropical fruit exotic blend', 4.5, 'exotic-smoothie'),
          i('mix-berry-smoothie', 'Mix Berry Smoothie', 'Assorted berries smoothie', 4, 'mix-berry-smoothie'),
          i('apple-kiwi-smoothie', 'Apple Kiwi Smoothie', 'Crisp green apple and kiwi blend', 4, 'apple-kiwi-smoothie'),
          i('tropical-smoothie', 'Tropical Smoothie', 'Mixed tropical fruits smoothie', 4.5, 'tropical-smoothie'),
          i('blueberry-smoothie', 'Blueberry Smoothie', 'Blueberry smoothie', 4, 'blueberry-smoothie'),
        ],
      },
      {
        id: 'frappes',
        name: 'Frappes',
        items: [
          i('frappuccino', 'Frappuccino', 'Blended ice coffee topped', 4.5, 'frappuccino'),
          i('caramel-frappe', 'Caramel Frappe', 'Blended coffee with sweet caramel syrup', 5, 'caramel-frappe'),
          i('salted-caramel-frappe', 'Salted Caramel Frappe', 'Blended iced coffee with salted caramel syrup', 5, 'salted-caramel-frappe'),
          i('vanilla-frappe', 'Vanilla Frappe', 'Blended iced coffee with vanilla syrup', 5, 'vanilla-frappe'),
          i('mocha-frappe', 'Mocha Frappe', 'Blended iced coffee with rich chocolate syrup', 5, 'mocha-frappe'),
          i('white-mocha-frappe', 'White Mocha Frappe', 'Blended iced coffee with white chocolate syrup', 5, 'white-mocha-frappe'),
          i('matcha-frappe', 'Matcha Frappe', 'Blended green tea matcha frappe', 5, 'matcha-frappe'),
          i('talia-frappe', 'Talia Frappe', undefined, 6),
        ],
      },
      {
        id: 'iced-coffee',
        name: 'Iced Lattes & Iced Coffee',
        short: 'Iced Coffee',
        items: [
          i('iced-americano', 'Iced Americano', 'Espresso shots over cold water and ice', 3.5, 'iced-americano'),
          i('iced-classic-latte', 'Iced Classic Latte', 'Espresso with cold milk and ice', 4, 'iced-classic-latte'),
          i('iced-vanilla-latte', 'Iced Vanilla Latte', 'Espresso, cold milk, ice & vanilla syrup', 4.5, 'iced-vanilla-latte'),
          i('iced-caramel-latte', 'Iced Caramel Latte', 'Espresso, cold milk, ice & caramel syrup', 4.5, 'iced-caramel-latte'),
          i('iced-mocha-latte', 'Iced Mocha Latte', 'Espresso, cold milk, ice & chocolate syrup', 4.5, 'iced-mocha-latte'),
          i('iced-matcha-latte', 'Iced Matcha Latte', 'Japanese matcha green tea with cold milk', 4.5, 'iced-matcha-latte'),
          i('iced-salted-caramel-latte', 'Iced Salted Caramel Latte', 'Espresso, cold milk, ice & salted caramel syrup', 4.5, 'iced-salted-caramel-latte'),
          i('iced-hazelnut-latte', 'Iced Hazelnut Latte', 'Espresso, cold milk, ice & hazelnut syrup', 4.5),
          i('iced-irish-latte', 'Iced Irish Latte', 'Espresso, cold milk, ice & Irish cream flavor', 4.5),
          i('iced-cookie-latte', 'Iced Cookie Latte', 'Espresso, cold milk, ice & cookie syrup', 4.5, 'iced-cookie-latte'),
          i('iced-spanish-latte', 'Iced Spanish Latte', 'Espresso, cold milk, condensed milk & ice', 4.5, 'iced-spanish-latte'),
          i('iced-strawberry-latte', 'Iced Strawberry Latte', 'Espresso with milk and fresh strawberry syrup', 4.5, 'iced-strawberry-latte'),
          i('pistachio-iced-latte', 'Pistachio Iced Latte', 'Espresso, cold milk, ice & pistachio flavor', 5, 'pistachio-iced-latte'),
        ],
      },
      {
        id: 'mocktails',
        name: 'Drinks & Mocktails',
        short: 'Mocktails',
        items: [
          i('classic-mojito', 'Classic Mojito', 'Fresh lime, mint leaves, soda water & crushed ice', 3.5, 'classic-mojito'),
          i('strawberry-mojito', 'Strawberry Mojito', 'Fresh strawberries, mint, lime & soda', 3.5, 'strawberry-mojito'),
          i('mango-mojito', 'Mango Mojito', 'Mango puree, mint, lime & soda', 4, 'mango-mojito'),
          i('berry-mojito', 'Berry Mojito', 'Mixed berries, mint, lime & soda', 4, 'berry-mojito'),
          i('kiwi-mojito', 'Kiwi Mojito', 'Fresh kiwi, mint, lime & soda', 4, 'kiwi-mojito'),
          i('pina-colada', 'Pina Colada', 'Cream of coconut and pineapple juice blended with ice', 4, 'pina-colada'),
          i('sunset', 'Sunset', 'Layered fruit juice mocktail', 3.5, 'sunset'),
          i('blue-hawaii', 'Blue Hawaii', 'Blue cura', 3.5, 'blue-hawaii'),
          i('passion-sol', 'Passion Sol', 'Passion fruit tropical refresher', 4.5, 'passion-sol'),
          i('espresso-tonic', 'Espresso Tonic', 'Espresso shot poured over tonic water & ice', 3.5, 'espresso-tonic'),
          i('iced-tea-peach', 'Iced Tea Peach', 'Chilled brewed tea with peach flavor', 3.5),
          i('iced-tea-lemon', 'Iced Tea Lemon', 'Chilled brewed tea with fresh lemon flavor', 3.5),
        ],
      },
      {
        id: 'fresh-juices',
        name: 'Fresh Juices',
        items: [
          // Price was not visible in the provided menu screenshots. Set it here.
          i('fresh-orange-juice', 'Fresh Orange Juice', '100% freshly squeezed orange juice', null, 'fresh-orange-juice'),
          i('fresh-carrot-juice', 'Fresh Carrot Juice', 'Freshly extracted pure carrot juice', 3.5, 'fresh-carrot-juice'),
          i('fresh-lemonade', 'Fresh Lemonade', 'Freshly squeezed lemon juice with mint/sugar', 3.5, 'fresh-lemonade'),
          i('minted-lemonade', 'Minted Lemonade', 'Fresh squeezed lemonade blended with mint leaves', 4, 'minted-lemonade'),
          i('strawberry-fresh', 'Strawberry Fresh', undefined, 4, 'strawberry-fresh'),
        ],
      },
      {
        id: 'cold-beverages',
        name: 'Cold Beverages',
        short: 'Cold Drinks',
        items: [
          i('water-small', 'Water Small', 'Bottled Small Water', 0.77),
          i('laziza-apple', 'Laziza - Apple', 'Non alcoholic malt beverage', 2.5),
          i('laziza-regular', 'Laziza - Regular', 'Non alcoholic malt beverage', 2.5),
          i('boom-boom', 'Boom Boom', 'Cold specialty beverage', 2.5),
          i('red-bull', 'Red Bull', 'Energy drink', 3),
          i('pepsi', 'Pepsi', 'Chilled canned soft drinks', 1.5),
          i('pepsi-diet', 'Pepsi Diet', 'Chilled canned soft drinks', 1.5),
          i('7up', '7Up', 'Chilled canned soft drinks', 1.5),
          i('7up-diet', '7Up Diet', 'Chilled canned soft drinks', 1.5),
          i('mirinda', 'Mirinda', 'Chilled canned soft drinks', 1.5),
          i('perrier', 'Perrier', 'Sparkling natural mineral water', 2.5),
          i('sparkling-water', 'Sparkling Water', 'Carbonated water', 2),
          i('mexican-beer', 'Mexican beer', undefined, 3.5),
        ],
      },
      {
        id: 'hot-drinks',
        name: 'Hot Drinks',
        items: [
          i('hot-chocolate', 'Hot Chocolate', 'Rich warm cocoa topped with steamed milk', 4),
          i('nescafe', 'Nescafe', 'Classic instant hot coffee', 2.8, 'nescafe'),
          i('nescafe-gold', 'Nescafe Gold', 'Premium roast gold instant coffee', 3.5, 'nescafe-gold'),
          i('espresso', 'Espresso', 'Single shot of concentrated espresso', 2, 'espresso'),
          i('double-espresso', 'Double Espresso', 'Double shot of rich espresso', 2.6, 'espresso'),
          i('tea', 'Tea', 'Selection of hot brewed tea', 2),
          i('flavored-tea', 'Flavored Tea', 'Assorted infused fruit or herbal tea', 2.5),
          i('white-coffee', 'White Coffee', 'Lebanese hot orange blossom water beverage', 2),
          i('affogato', 'Affogato', 'Espresso shot with ice cream', 3.5),
        ],
      },
      {
        id: 'hot-lattes',
        name: 'Hot Lattes & Cappuccino',
        short: 'Hot Lattes',
        items: [
          i('cappuccino', 'Cappuccino', 'Espresso topped with equal parts steamed milk and foam', 3.5, 'cappuccino'),
          i('caffe-latte', 'Caffe Latte', 'Espresso with steamed milk and a light layer of foam', 3.5, 'cappuccino'),
          i('vanilla-latte', 'Vanilla Latte', 'Steamed milk and espresso with vanilla syrup', 4, 'vanilla-latte'),
          i('caramel-latte', 'Caramel Latte', 'Steamed milk and espresso with caramel syrup', 4),
          i('salted-caramel-latte', 'Salted Caramel Latte', 'Steamed milk and espresso with salted caramel', 4, 'salted-caramel-latte'),
          i('caramel-macchiato-latte', 'Caramel Macchiato Latte', 'Layered espresso and steamed milk with caramel drizzle', 4, 'caramel-macchiato-latte'),
          i('mocha-latte', 'Mocha Latte', 'Espresso with chocolate sauce and steamed milk', 4, 'mocha-latte'),
          i('matcha-latte', 'Matcha Latte', 'Japanese matcha green tea whisked with steamed milk', 4, 'matcha-latte'),
          i('pistachio-latte', 'Pistachio Latte', 'Espresso and steamed milk with pistachio syrup', 4, 'pistachio-latte'),
          i('lotus-latte', 'Lotus Latte', 'Espresso and steamed milk with Lotus biscoff syrup', 4, 'lotus-latte'),
          i('cookie-latte', 'Cookie Latte', 'Espresso and steamed milk with cookie syrup', 4, 'cookie-latte'),
          i('irish-latte', 'Irish Latte', 'Espresso and steamed milk with Irish cream flavor', 4, 'irish-latte'),
          i('hazelnut-latte', 'Hazelnut Latte', 'Espresso and steamed milk with hazelnut syrup', 4),
          i('spanish-latte', 'Spanish Latte', 'Espresso with steamed milk and sweetened condensed milk', 4, 'spanish-latte'),
          i('coconut-latte', 'Coconut Latte', 'Espresso with steamed coconut milk flavor', 4),
          i('strawberry-latte', 'Strawberry Latte', 'Steamed milk and espresso with strawberry flavor', 4, 'strawberry-latte'),
          i('white-latte', 'White Latte', 'Espresso with white chocolate and steamed milk', 4, 'white-latte'),
        ],
      },
    ],
  },
  {
    id: 'shisha',
    label: 'Argili',
    categories: [
      {
        id: 'argili',
        name: 'Argili',
        items: [
          i('ajami', 'Ajami', 'Traditional Ajami tobacco shisha', 7),
          i('nakha-shisha', 'Nakha Shisha', 'Classic Nakha tobacco flavor', 6),
          i('apple-shisha', 'Apple Shisha', 'Double apple shisha', 5),
          i('lemon-mint-shisha', 'Lemon & Mint Shisha', 'Refreshing lemon and mint shisha flavor', 5),
          i('blueberry-shisha', 'Blueberry Shisha', 'Sweet blueberry shisha flavor', 5),
          i('love-shisha', 'Love Shisha', 'Special Love signature flavor', 5),
          i('grape-shisha', 'Grape Shisha', 'Classic sweet grape shisha flavor', 5),
          i('grape-mint-shisha', 'Grape & Mint Shisha', 'Grape combined with fresh mint shisha', 5),
          i('talia-shisha', 'Talia shisha', undefined, 5),
          i('refill', 'Refill', 'Shisha head refill', 3),
          i('special-talia-apple', 'Special Talia Apple', 'House special signature shisha blend - apple', 7),
          i('special-talia-lemon', 'Special Talia Lemon', 'House special signature shisha blend - lemon', 7),
          i('special-talia-love', 'Special Talia Love', 'House special signature shisha blend - love', 7),
          i('plastic-hose', 'Plastic Hose', 'Hygienic single use plastic hose', 1),
        ],
      },
    ],
  },
  {
    id: 'sweets',
    label: 'Sweets',
    categories: [
      {
        id: 'crepes',
        name: 'Crepes',
        items: [
          i('nutella-crepe', 'Nutella Crepe', 'Fresh crepe spread with Nutella chocolate', 5),
          i('kinder-crepe', 'Kinder Crepe', 'Crepe stuffed with Kinder chocolate melt', 6),
          i('lotus-crepe', 'Lotus Crepe', 'Crepe topped with crushed Lotus biscuits and spread', 6),
          i('oreo-crepe', 'Oreo Crepe', 'Crepe stuffed with crushed Oreo cookies and chocolate', 6),
          i('sushi-crepe', 'Sushi Crepe', 'Crepe rolled and sliced sushi style with fillings', 6.5),
          i('fettuccine-crepe', 'Fettuccine Crepe', 'Crepe cut into fine pasta ribbons with chocolate sauce', 6.5),
          i('pistachio-crepe', 'Pistachio Crepe', 'Crepe topped with rich pistachio cream', 6.5, 'pistachio-crepe'),
          i('talia-crepe', 'Talia Crepe', 'Special house signature crepe presentation', 9),
          i('mix-crepe', 'Mix Crepe', 'Selection of mixed chocolate and cream toppings', 6),
        ],
      },
      {
        id: 'desserts',
        name: 'Desserts',
        items: [
          i('ghazle-w-boza', 'Ghazle w Boza', 'Traditional cotton candy served with mastic ice cream', 4.5),
          i('strawberry-cheesecake', 'Strawberry Cheesecake', 'Classic cheesecake topped with strawberry glaze', 5.5),
          i('lotus-cheesecake', 'Lotus Cheesecake', 'Cheesecake topped with Lotus biscoff cream', 5.5),
          i('oreo-cheesecake', 'Oreo Cheesecake', 'Cheesecake topped with crushed Oreo cookies', 5.5),
          i('mix-berry-cheesecake', 'Mix Berry Cheesecake', 'Cheesecake topped with mixed berry compote', 5.5),
          i('brownie', 'Brownie', 'Warm chocolate brownie', 6),
          i('chocolate-fondant', 'Chocolate Fondant', 'Warm molten chocolate lava cake', 7),
          i('ice-cream-cup', 'Ice Cream Cup', undefined, 3.5),
          i('chocolate-mou', 'Chocolate Mou', undefined, 5),
        ],
      },
    ],
  },
];

// Flat helpers -------------------------------------------------------------

export const allCategories = menuGroups.flatMap((g) =>
  g.categories.map((c) => ({ ...c, groupId: g.id, groupLabel: g.label }))
);

export const allItems = allCategories.flatMap((c) =>
  c.items.map((item) => ({ ...item, categoryId: c.id, categoryName: c.name, groupId: c.groupId }))
);

const byId = new Map(allItems.map((item) => [item.id, item]));
export const getItem = (id) => byId.get(id);

export const imageUrl = (image, size = 'lg') =>
  image ? `/images/menu/${image}${size === 'sm' ? '-sm' : ''}.webp` : null;

// Dishes featured on the home page (all with photos).
export const featuredIds = [
  'talia-penne-rose-shrimps',
  'zaatar-special',
  'caramel-macchiato-latte',
  'steak-mushroom-platter',
  'lotus-milkshake',
  'mushroom-beef-burger',
  'pistachio-crepe',
  'caesar-salad',
  'strawberry-mojito',
  'chicken-alfredo-pizza',
];
