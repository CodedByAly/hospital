/**
 * Khalifa Bites menu — transcribed from the restaurant's printed menu (PDF).
 *
 * Names, descriptions and prices follow the menu exactly. Prices are in USD.
 * Photos in /public/images/menu were extracted from the same PDF and matched
 * to each item by their position on the page.
 *
 * Item fields
 *   id           unique, URL-safe
 *   category     one of the category ids below
 *   name         as printed
 *   description  as printed
 *   price        number, USD (for items with variants: the lowest price)
 *   image        file name in /public/images/menu (no extension)
 *   choice       a required pick the menu itself offers ("served with X or Y")
 *   remove       ingredients from the description a customer may leave out
 *   variants     sizes/types printed as separate lines of one product
 *                (e.g. Small / Large / Markook shawarma)
 */

export const categories = [
  { id: 'appetizers', name: 'Appetizers', image: 'french-fries' },
  { id: 'wings-strips', name: 'Wings & Strips', image: 'honey-bbq-wings' },
  { id: 'beef-burgers', name: 'Beef Burgers', image: 'khalifa-burger' },
  { id: 'chicken-burger', name: 'Chicken Burger', image: 'zinger-burger' },
  { id: 'sub-sandwich', name: 'Sub & Sandwich', image: 'shrimp-sub' },
  { id: 'family-combo-plate', name: 'Family Combo & Plate', image: 'grilled-beef' },
  { id: 'hot-dogs', name: 'Hot dogs', image: 'chili-cheese-dog' },
  { id: 'shawarma-sandwiches', name: 'Shawarma Sandwiches', image: 'chicken-shawarma-large' },
  { id: 'shawarma-meal', name: 'Shawarma Meal', image: 'mix-markook-shawarma' },
  { id: 'salads', name: 'Salads', image: 'shrimp-caesar-salad' },
  { id: 'drinks', name: 'Drinks', image: null },
];

const TEXAS_OR_HONEY_MUSTARD = { label: 'Choose your sauce', options: ['Texas sauce', 'Honey mustard sauce'] };

export const items = [
  // ── Appetizers ─────────────────────────────────────────────
  { id: 'french-fries', category: 'appetizers', name: 'French Fries', price: 3.5, image: 'french-fries',
    description: 'Crispy golden fries (220g), served with texas sauce or honey mustard sauce.', choice: TEXAS_OR_HONEY_MUSTARD },
  { id: 'onion-ring', category: 'appetizers', name: 'Onion ring', price: 4.5, image: 'onion-ring',
    description: '8 battered, deep-fried onion rings served with BBQ dip.' },
  { id: 'curly-fries', category: 'appetizers', name: 'Curly Fries', price: 4.5, image: 'curly-fries',
    description: 'Curly fries, served with texas sauce or honey mustard sauce.', choice: TEXAS_OR_HONEY_MUSTARD },
  { id: 'wedges-potato', category: 'appetizers', name: 'Wedges Potato', price: 4.5, image: 'wedges-potato',
    description: 'Potato wedges (250g), served with honey mustard sauce.' },
  { id: 'mozzarella-sticks', category: 'appetizers', name: 'Mozzarella Sticks', price: 5, image: 'mozzarella-sticks',
    description: '5 mozzarella cheese sticks, served with texas sauce.' },
  { id: 'classic-combo', category: 'appetizers', name: 'Classic Combo', price: 12, image: 'classic-combo',
    description: '3 golden crispy strips, 3 cheese fingers, 5 wings, and 220g fried wedges, served with texas sauce and honey mustard sauce.' },

  // ── Wings & Strips ─────────────────────────────────────────
  { id: 'garlic-parmesan-strips', category: 'wings-strips', name: 'Garlic Parmesan Strips', price: 8, image: 'garlic-parmesan-strips',
    description: 'Golden chicken fillet, aioli sauce, and classic sauce.' },
  { id: 'garlic-parmesan-wings', category: 'wings-strips', name: 'Garlic Parmesan Wings', price: 8, image: 'garlic-parmesan-wings',
    description: 'Garlic wings (12 pcs), served with caesar sauce.' },
  { id: 'honey-bbq-wings', category: 'wings-strips', name: 'Honey Bbq Wings', price: 8, image: 'honey-bbq-wings',
    description: 'Crispy chicken wings (12 pcs), melted cheddar cheese, served with honey BBQ or honey mustard sauce.',
    choice: { label: 'Choose your sauce', options: ['Honey BBQ sauce', 'Honey mustard sauce'] }, remove: ['cheddar cheese'] },
  { id: 'hot-buffalo-wings', category: 'wings-strips', name: 'Hot Buffalo Wings', price: 8, image: 'hot-buffalo-wings',
    description: 'Crispy chicken wings, served with dairy ranch dip.' },
  { id: 'bbq-strips', category: 'wings-strips', name: 'BBQ Strips', price: 8, image: 'bbq-strips',
    description: 'Fried golden chicken fillet, served with honey mustard sauce.' },
  { id: 'mexican-buffalo-strips', category: 'wings-strips', name: 'Mexican Buffalo Strips', price: 8, image: 'mexican-buffalo-strips',
    description: 'Fried golden chicken fillet, served with ranch dip or honey mustard sauce.',
    choice: { label: 'Choose your dip', options: ['Ranch dip', 'Honey mustard sauce'] } },

  // ── Beef Burgers ───────────────────────────────────────────
  { id: 'libanais-burger', category: 'beef-burgers', name: 'Libanais Burger', price: 6.5, image: 'libanais-burger',
    description: 'Charcoal-grilled beef patty topped with crispy french fries, creamy coleslaw, and cocktail sauce, served in a soft burger bun.',
    remove: ['french fries', 'coleslaw', 'cocktail sauce'] },
  { id: 'as-you-like', category: 'beef-burgers', name: 'As You Like', price: 8, image: 'as-you-like',
    description: 'Charcoal-grilled beef patty topped with crispy iceberg lettuce, sliced tomato, melted cheddar cheese, sliced red onion, dill pickles, and texas sauce, served in a butter bun.',
    remove: ['iceberg lettuce', 'tomato', 'cheddar cheese', 'red onion', 'dill pickles', 'texas sauce'] },
  { id: 'youre-spicy', category: 'beef-burgers', name: 'You’re Spicy', price: 6.5, image: 'youre-spicy',
    description: 'Charcoal-grilled beef patty (125g) topped with crispy iceberg lettuce, sliced tomato, red onion, dill pickles, sliced jalapeños, melted cheddar cheese, baby chip sticks, honey mustard sauce, and chili cuban sauce.',
    remove: ['iceberg lettuce', 'tomato', 'red onion', 'dill pickles', 'jalapeños', 'cheddar cheese', 'baby chip sticks', 'honey mustard sauce', 'chili cuban sauce'] },
  { id: 'baby-beef-bacon', category: 'beef-burgers', name: 'Baby Beef Bacon', price: 8, image: 'baby-beef-bacon',
    description: 'Charcoal-grilled beef patty (125g), crispy iceberg lettuce, halal turkey bacon, fried onion rings, and dill pickles, glazed with honey BBQ sauce and topped with extra melted cheddar cheese.',
    remove: ['iceberg lettuce', 'turkey bacon', 'onion rings', 'dill pickles', 'honey BBQ sauce', 'cheddar cheese'] },
  { id: 'juicy-lucy', category: 'beef-burgers', name: 'Juicy Lucy', price: 7.5, image: 'juicy-lucy',
    description: 'Charcoal-grilled beef patty (170g) filled with Norwegian cheese, crispy iceberg lettuce, sliced tomato, baby chip sticks, and dill pickles, with classic sauce, dipped in special BBQ sauce, and coated with double melted swiss cheese.',
    remove: ['iceberg lettuce', 'tomato', 'baby chip sticks', 'dill pickles', 'classic sauce'] },
  { id: 'shroom-n-swiss', category: 'beef-burgers', name: 'Shroom N’Swiss', price: 9, image: 'shroom-n-swiss',
    description: 'Charcoal-grilled beef patty (125g), crispy iceberg lettuce, gravy mushroom sauce, extra melted swiss cheese, and classic sauce in a butter bun.',
    remove: ['iceberg lettuce', 'classic sauce'] },
  { id: 'khalifa-burger', category: 'beef-burgers', name: 'Khalifa Burger', price: 8, image: 'khalifa-burger',
    description: 'Charcoal-grilled beef patty (125g), crispy iceberg lettuce, sliced tomato, and dill pickles, topped with a breaded mozzarella patty and glazed with texas sauce.',
    remove: ['iceberg lettuce', 'tomato', 'dill pickles', 'texas sauce'] },
  { id: 'nice-to-meet-you', category: 'beef-burgers', name: 'Nice to Meet You', price: 8, image: 'nice-to-meet-you',
    description: 'Smashed beef patties (220g) topped with beef bacon, sautéed onions, dill pickles, cocktail sauce, special BBQ sauce, and melted cheddar cheese.',
    remove: ['beef bacon', 'sautéed onions', 'dill pickles', 'cocktail sauce', 'special BBQ sauce', 'cheddar cheese'] },
  { id: 'truffle-surf', category: 'beef-burgers', name: 'Truffle Surf', price: 8, image: 'truffle-surf',
    description: 'Charcoal-grilled beef patty (125g), rocca, caramelized onions, portobello mushroom sauce, and melted swiss cheese, covered with traditional truffle sauce and glazed with classic sauce.',
    remove: ['rocca', 'caramelized onions', 'classic sauce'] },
  { id: 'regular-burger', category: 'beef-burgers', name: 'Regular Burger', price: 8, image: 'regular-burger',
    description: 'Charcoal-grilled beef patty (125g), crispy iceberg lettuce, fresh sliced tomato, dill pickles, and our homemade sauce.',
    remove: ['iceberg lettuce', 'tomato', 'dill pickles', 'homemade sauce'] },
  { id: 'khalifa-tower', category: 'beef-burgers', name: 'Khalifa Tower', price: 14.5, image: 'khalifa-tower',
    description: 'Double grilled beef patty topped with a breaded cheddar and mozzarella cheese patty, turkey bacon, melted cheddar cheese, dairy ranch, and special BBQ sauce.',
    remove: ['turkey bacon', 'dairy ranch', 'special BBQ sauce'] },

  // ── Chicken Burger ─────────────────────────────────────────
  { id: 'escalope-burger', category: 'chicken-burger', name: 'Escalope burger', price: 5.5, image: 'escalope-burger',
    description: 'Crispy breaded chicken escalope topped with ketchup, crunchy coleslaw, melted cheese, and creamy mayo sauce, served in a soft toasted burger bun.',
    remove: ['ketchup', 'coleslaw', 'cheese', 'mayo sauce'] },
  { id: 'chicken-burger', category: 'chicken-burger', name: 'Chicken Burger', price: 6.5, image: 'chicken-burger',
    description: 'Charcoal-grilled marinated chicken breast, crispy iceberg lettuce, sliced tomato, dill pickles, honey mustard sauce, and aioli sauce.',
    remove: ['iceberg lettuce', 'tomato', 'dill pickles', 'honey mustard sauce', 'aioli sauce'] },
  { id: 'zinger-burger', category: 'chicken-burger', name: 'Zinger Burger', price: 6.5, image: 'zinger-burger',
    description: 'Homemade crispy chicken breast dunked in honey BBQ or buffalo sauce, crispy iceberg lettuce, smoked turkey bacon, and dill pickles, topped with honey mustard and aioli sauce.',
    choice: { label: 'Dunked in', options: ['Honey BBQ sauce', 'Buffalo sauce'] },
    remove: ['iceberg lettuce', 'turkey bacon', 'dill pickles', 'honey mustard', 'aioli sauce'] },
  { id: 'rocky-fish', category: 'chicken-burger', name: 'Rocky Fish', price: 5.5, image: 'rocky-fish',
    description: 'Crispy golden-fried fish fillet topped with fresh lettuce, juicy tomatoes, crunchy pickles, and creamy tartar sauce, served in a soft toasted roll.',
    remove: ['lettuce', 'tomatoes', 'pickles', 'tartar sauce'] },
  { id: 'veggie-mate-burger', category: 'chicken-burger', name: 'Veggie Mate Burger', price: 7.5, image: 'veggie-mate-burger',
    description: 'Breaded fried eggplant, breaded fried avocado, crispy iceberg lettuce, dill pickles, sliced tomato, BBQ sauce, and caramelized onions, served in a multi-cereal bun.',
    remove: ['iceberg lettuce', 'dill pickles', 'tomato', 'BBQ sauce', 'caramelized onions'] },
  { id: 'street-99', category: 'chicken-burger', name: 'Street 99', price: 6.5, image: 'street-99',
    description: 'Charcoal-grilled marinated chicken breast, fresh avocado slices, crispy iceberg lettuce, sliced red onion, dill pickles, and melted cheddar cheese, with a spread of honey mustard and aioli sauce.',
    remove: ['avocado', 'iceberg lettuce', 'red onion', 'dill pickles', 'cheddar cheese', 'honey mustard', 'aioli sauce'] },
  { id: 'chicken-shroom', category: 'chicken-burger', name: 'Chicken Shroom', price: 8, image: 'chicken-shroom',
    description: 'Charcoal-grilled marinated chicken breast (120g), crispy iceberg lettuce, topped with italian gravy mushroom sauce, sautéed fresh mushrooms, melted swiss cheese, and classic sauce, served in a classic bun.',
    remove: ['iceberg lettuce', 'sautéed mushrooms', 'swiss cheese', 'classic sauce'] },
  { id: 'kevin-spicy', category: 'chicken-burger', name: 'Kevin Spicy', price: 8, image: 'kevin-spicy',
    description: 'Homemade crispy chicken strips dunked in hot buffalo sauce, crispy iceberg lettuce, smoked turkey bacon, dill pickles, jalapeño, sliced onion, melted cheddar cheese, honey mustard, and dairy ranch sauce.',
    remove: ['iceberg lettuce', 'turkey bacon', 'dill pickles', 'jalapeño', 'onion', 'cheddar cheese', 'honey mustard', 'dairy ranch sauce'] },
  { id: 'mozza-n-chicken', category: 'chicken-burger', name: 'Mozza N’ Chicken', price: 8, image: 'mozza-n-chicken',
    description: 'Charcoal-grilled marinated chicken breast, crispy iceberg lettuce, sliced tomato, dill pickles, topped with breaded mozzarella, aioli sauce, and honey mustard.',
    remove: ['iceberg lettuce', 'tomato', 'dill pickles', 'aioli sauce', 'honey mustard'] },
  { id: 'kevin-parmesan', category: 'chicken-burger', name: 'Kevin Parmesan', price: 8, image: 'kevin-parmesan',
    description: 'Homemade crispy chicken strips dunked in aioli sauce and covered with parmesan cheese, crispy iceberg lettuce, smoked turkey bacon, dill pickles, and sliced onion, topped with melted swiss cheese, caesar sauce, and classic sauce.',
    remove: ['iceberg lettuce', 'turkey bacon', 'dill pickles', 'onion', 'swiss cheese', 'caesar sauce', 'classic sauce'] },
  { id: 'kevin-bbq', category: 'chicken-burger', name: 'Kevin BBQ', price: 8, image: 'kevin-bbq',
    description: 'Homemade crispy chicken strips dunked in honey BBQ sauce, crispy iceberg lettuce, smoked turkey bacon, dill pickles, and sliced onion, topped with melted cheddar cheese, honey mustard, and aioli sauce.',
    remove: ['iceberg lettuce', 'turkey bacon', 'dill pickles', 'onion', 'cheddar cheese', 'honey mustard', 'aioli sauce'] },

  // ── Sub & Sandwich ─────────────────────────────────────────
  { id: 'fries-sandwich', category: 'sub-sandwich', name: 'Fries Sandwich', price: 2.7, image: 'fries-sandwich',
    description: 'Golden french fries, pickles, coleslaw, cocktail sauce, and aioli sauce.',
    remove: ['pickles', 'coleslaw', 'cocktail sauce', 'aioli sauce'] },
  { id: 'chicken-sub', category: 'sub-sandwich', name: 'Chicken Sub', price: 4, image: 'chicken-sub',
    description: 'Marinated chicken slices in a soft mini sub bun with aioli sauce, corn, pickles, iceberg lettuce, melted cheese, and honey mustard sauce.',
    remove: ['aioli sauce', 'corn', 'pickles', 'iceberg lettuce', 'cheese', 'honey mustard sauce'] },
  { id: 'shrimp', category: 'sub-sandwich', name: 'Shrimp', price: 4, image: 'shrimp-sub',
    description: 'A soft mini sub filled with cocktail sauce, corn, pickles, iceberg lettuce, and melted cheese.',
    remove: ['cocktail sauce', 'corn', 'pickles', 'iceberg lettuce', 'cheese'] },
  { id: 'crab', category: 'sub-sandwich', name: 'Crab', price: 4, image: 'crab-sub',
    description: 'Delicate crab mix with cocktail sauce, corn, dill pickles, and iceberg lettuce, served in a soft mini sub bun.',
    remove: ['cocktail sauce', 'corn', 'dill pickles', 'iceberg lettuce'] },
  { id: 'shrimp-crab', category: 'sub-sandwich', name: 'Shrimp+Crab', price: 4.5, image: 'shrimp-crab-sub',
    description: 'A delicious mix of grilled shrimp and creamy crab, cocktail sauce, corn, dill pickles, and iceberg lettuce.',
    remove: ['cocktail sauce', 'corn', 'dill pickles', 'iceberg lettuce'] },
  { id: 'crispy-sandwich', category: 'sub-sandwich', name: 'Crispy Sandwich', price: 6, image: 'crispy-sandwich',
    description: 'Crispy chicken strips, shredded iceberg lettuce, dill pickles, honey mustard, and aioli sauce.',
    remove: ['iceberg lettuce', 'dill pickles', 'honey mustard', 'aioli sauce'] },
  { id: 'escalope-sandwich', category: 'sub-sandwich', name: 'Escalope Sandwich', price: 6, image: 'escalope-sandwich',
    description: 'Fried chicken breast, coleslaw, french fries, cocktail sauce, and aioli sauce.',
    remove: ['coleslaw', 'french fries', 'cocktail sauce', 'aioli sauce'] },
  { id: 'bbq-land', category: 'sub-sandwich', name: 'BBQ Land', price: 5.5, image: 'bbq-land',
    description: 'Crispy chicken strips dunked in honey BBQ sauce, shredded iceberg lettuce, dill pickles, baby chip sticks, honey mustard, and aioli sauce, covered with extra melted cheddar cheese.',
    remove: ['iceberg lettuce', 'dill pickles', 'baby chip sticks', 'honey mustard', 'aioli sauce', 'cheddar cheese'] },
  { id: 'pimento', category: 'sub-sandwich', name: 'Pimento', price: 5.5, image: 'pimento',
    description: 'Crispy chicken strips dunked in hot buffalo sauce, shredded iceberg lettuce, dill pickles, baby chip sticks, honey mustard, and dairy ranch sauce, covered with melted cheddar cheese.',
    remove: ['iceberg lettuce', 'dill pickles', 'baby chip sticks', 'honey mustard', 'dairy ranch sauce', 'cheddar cheese'] },
  { id: 'ciabatta-sandwich', category: 'sub-sandwich', name: 'Ciabatta Sandwich', price: 6.5, image: 'ciabatta-sandwich',
    description: 'Grilled chicken breast layered with fresh avocado slices, crispy rocca, juicy tomatoes, tangy pickles, and melted cheese, served in warm, freshly baked ciabatta bread with our signature house sauce.',
    remove: ['avocado', 'rocca', 'tomatoes', 'pickles', 'cheese', 'house sauce'] },
  { id: 'fajitas', category: 'sub-sandwich', name: 'Fajitas', price: 7, image: 'fajitas',
    description: 'Marinated chicken slices, sautéed onion and green pepper, dill pickles, brazilian fajitas sauce, shredded iceberg lettuce, honey mustard, and aioli sauce, topped with emmental cheese slices.',
    remove: ['dill pickles', 'iceberg lettuce', 'honey mustard', 'aioli sauce', 'emmental cheese'] },
  { id: 'volcano', category: 'sub-sandwich', name: 'Volcano', price: 7, image: 'volcano',
    description: 'Marinated chicken slices, sautéed onion and green pepper, shredded iceberg lettuce, fresh tomato, jalapeño, cuban sauce, and honey mustard, covered with extra melted swiss cheese and a light spread of special sauce.',
    remove: ['iceberg lettuce', 'tomato', 'jalapeño', 'cuban sauce', 'honey mustard', 'special sauce'] },
  { id: 'pats-king-of-steak', category: 'sub-sandwich', name: 'Pats King of Steak', price: 8, image: 'pats-king-of-steak',
    description: 'Grilled steak slices, grilled green pepper, grilled tomato, mixed melted cheese, shredded iceberg lettuce, lava sauce, and classic sauce.',
    remove: ['green pepper', 'tomato', 'iceberg lettuce', 'lava sauce', 'classic sauce'] },
  { id: 'new-york', category: 'sub-sandwich', name: 'New York', price: 8, image: 'new-york',
    description: 'Soft sub bread filled with grilled steak slices, crispy iceberg lettuce, and italian gravy mushroom sauce, topped with double melted swiss cheese and classic sauce.',
    remove: ['iceberg lettuce', 'classic sauce'] },
  { id: 'cataplana-chicken', category: 'sub-sandwich', name: 'Cataplana Chicken', price: 7, image: 'cataplana-chicken',
    description: 'Grilled marinated chicken slices, shredded iceberg lettuce, and italian gravy mushroom sauce, topped with double melted swiss cheese and classic sauce.',
    remove: ['iceberg lettuce', 'classic sauce'] },
  { id: 'marbella-frango', category: 'sub-sandwich', name: 'Marbella Frango', price: 10, image: 'marbella-frango',
    description: 'A soft sub bread filled with marinated chicken slices, shredded iceberg lettuce, dill pickles, caramelized onions, honey mustard sauce, and aioli sauce, covered with melted emmental cheese.',
    remove: ['iceberg lettuce', 'dill pickles', 'caramelized onions', 'honey mustard sauce', 'aioli sauce', 'emmental cheese'] },

  // ── Family Combo & Plate ───────────────────────────────────
  { id: 'crispy-meal', category: 'family-combo-plate', name: 'Crispy Meal', price: 10, image: 'crispy-meal',
    description: 'Golden crispy chicken (6 pcs), french fries, coleslaw salad, aioli sauce, and cocktail sauce.' },
  { id: 'grilled-beef', category: 'family-combo-plate', name: 'Grilled Beef', price: 11, image: 'grilled-beef',
    description: 'Grilled beef patty (250g), sautéed vegetables including carrots, zucchini, broccoli, green peppers, beans, and corn, topped with homemade truffle oil, mushroom sauce, and baked potato.' },
  { id: 'chicken-mushroom', category: 'family-combo-plate', name: 'Chicken Mushroom', price: 11, image: 'chicken-mushroom',
    description: 'Grilled marinated chicken breast (240g), sautéed vegetables including carrots, zucchini, broccoli, green peppers, beans, and corn, served with mushroom sauce and sliced baked potato.' },

  // ── Hot dogs ───────────────────────────────────────────────
  { id: 'chili-cheese-dog', category: 'hot-dogs', name: 'Chili Cheese Dog', price: 4.5, image: 'chili-cheese-dog',
    description: 'Grilled beef sausage, chili beef sauce, baby chip sticks, spicy jalapeño, covered with extra melted cheddar cheese.',
    remove: ['baby chip sticks', 'jalapeño'] },
  { id: 'chicago', category: 'hot-dogs', name: 'Chicago', price: 4.5, image: 'chicago',
    description: 'Grilled beef sausage with ketchup, mustard, and mayo, coated with baby chip sticks and extra melted cheddar cheese.',
    remove: ['ketchup', 'mustard', 'mayo', 'baby chip sticks', 'cheddar cheese'] },

  // ── Shawarma Sandwiches ────────────────────────────────────
  { id: 'chicken-shawarma', category: 'shawarma-sandwiches', name: 'Chicken Shawarma', price: 3, image: 'chicken-shawarma-large',
    group: 'Chicken',
    variants: [
      { id: 'small', label: 'Small Shawarma', price: 3, image: 'chicken-shawarma-small',
        description: 'Juicy chicken shawarma with fries, pickles, and creamy garlic sauce, rolled in warm arabic bread and grilled to perfection.' },
      { id: 'large', label: 'Large Shawarma', price: 6, image: 'chicken-shawarma-large',
        description: 'Juicy chicken shawarma with fries, pickles, and creamy garlic sauce, rolled in warm arabic bread and grilled to perfection.' },
      { id: 'markook', label: 'Markook Shawarma', price: 6, image: 'chicken-shawarma-markook',
        description: 'Tender marinated chicken shawarma, crispy fries, crunchy pickles, and rich garlic sauce, wrapped in soft markook bread.' },
    ],
    remove: ['fries', 'pickles', 'garlic sauce'] },
  { id: 'beef-shawarma', category: 'shawarma-sandwiches', name: 'Beef Shawarma', price: 4, image: 'beef-shawarma-large',
    group: 'Beef',
    variants: [
      { id: 'small', label: 'Small Shawarma', price: 4, image: 'beef-shawarma-small',
        description: 'Flavorful beef shawarma with tomatoes, parsley, onions, pickles, and smooth tahini sauce in warm arabic bread.' },
      { id: 'large', label: 'Large Shawarma', price: 7, image: 'beef-shawarma-large',
        description: 'Flavorful beef shawarma with tomatoes, parsley, onions, pickles, and smooth tahini sauce in warm arabic bread.' },
      { id: 'markook', label: 'Markook Shawarma', price: 7, image: 'beef-shawarma-markook',
        description: 'Thinly sliced seasoned beef, fresh vegetables, tangy pickles, and tahini sauce, wrapped in soft markook bread.' },
    ],
    remove: ['tomatoes', 'parsley', 'onions', 'pickles', 'tahini sauce'] },

  // ── Shawarma Meal ──────────────────────────────────────────
  { id: 'mix-markook-shawarma', category: 'shawarma-meal', name: 'Mix Markook Shawarma', price: 14, image: 'mix-markook-shawarma',
    description: 'A delicious combination of chicken and beef shawarma, layered with fries, pickles, and garlic-tahini sauces, wrapped in soft markook bread.' },
  { id: 'shawarma-1kg', category: 'shawarma-meal', name: '1 KG Shawarma', price: 32, image: 'shawarma-1kg-chicken',
    variants: [
      { id: 'chicken', label: 'Chicken', price: 32, image: 'shawarma-1kg-chicken',
        description: 'A full kilo of freshly sliced marinated chicken shawarma, perfectly seasoned and ready to share.' },
      { id: 'beef', label: 'Beef', price: 40, image: 'shawarma-1kg-beef',
        description: 'A generous kilo of tender, perfectly spiced beef shawarma, ideal for gatherings and family meals.' },
    ] },

  // ── Salads ─────────────────────────────────────────────────
  { id: 'shrimp-caesar-salad', category: 'salads', name: 'Shrimp Caesar Salad', price: 8, image: 'shrimp-caesar-salad',
    description: 'Grilled, marinated fresh shrimp and crispy iceberg lettuce tossed with our homemade caesar dressing, topped with parmesan cheese and croutons. Add fresh avocado slices.',
    remove: ['parmesan cheese', 'croutons'] },
  { id: 'chicken-caesar-salad', category: 'salads', name: 'Chicken Caesar Salad', price: 8, image: 'chicken-caesar-salad',
    description: 'Grilled, marinated chicken breast and crisp iceberg lettuce tossed with our homemade caesar dressing, topped with parmesan cheese and croutons.',
    remove: ['parmesan cheese', 'croutons'] },

  // ── Drinks ─────────────────────────────────────────────────
  { id: 'soft-drink', category: 'drinks', name: 'Soft Drink', price: 1 },
  { id: 'iced-tea', category: 'drinks', name: 'Iced Tea', price: 2 },
  { id: 'laban', category: 'drinks', name: 'Laban', price: 1 },
  { id: 'water', category: 'drinks', name: 'Water', price: 0.5 },
];

export const itemsById = Object.fromEntries(items.map((i) => [i.id, i]));
export const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]));
export const itemsByCategory = categories.map((c) => ({ ...c, items: items.filter((i) => i.category === c.id) }));

/** The variant a cart line refers to, or null for single-price items. */
export const variantOf = (item, variantId) => item.variants?.find((v) => v.id === variantId) || null;

/** Price of one unit of an item (with its chosen variant). */
export const priceOf = (item, variantId) => variantOf(item, variantId)?.price ?? item.price;

/** Whether the item's card shows "from $X" (it has variants at different prices). */
export const hasPriceRange = (item) => Boolean(item.variants && new Set(item.variants.map((v) => v.price)).size > 1);

/** Number of priced lines on the printed menu (each size counts, as printed). */
export const menuLineCount = items.reduce((n, i) => n + (i.variants?.length || 1), 0);
