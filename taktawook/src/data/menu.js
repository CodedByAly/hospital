// All prices in Lebanese pounds (LBP), taken from the printed Taktawook menu.
// Tags: "fav" = house favourite (thumbs-up on the menu), "spicy" = chili icon.

export const CATEGORIES = [
  { id: 'wraps', label: 'Wraps', blurb: 'Rolled in thin Lebanese flatbread', icon: 'Wrap', img: 'wrap' },
  { id: 'baguettes', label: 'Baguettes', blurb: 'Served in a crusty French baguette', icon: 'Sub', img: 'sub' },
  { id: 'subs', label: 'Subs', blurb: 'Loaded sesame submarine rolls', icon: 'Sub', img: 'crispy-combo' },
  { id: 'burgers', label: 'Burgers', blurb: 'Stacked high, sauced right', icon: 'Burger', img: 'burgers' },
  { id: 'platters', label: 'Platters', blurb: 'Made for sharing (or not)', icon: 'Drumstick', img: 'platter' },
  { id: 'starters', label: 'Starters & Sides', blurb: 'Crunchy things to start with', icon: 'Fries', img: 'curly-fries' },
  { id: 'salads', label: 'Salads', blurb: 'Fresh bowls, add grilled chicken', icon: 'Bowl', img: 'salad' },
  { id: 'drinks', label: 'Drinks', blurb: 'Ice cold and ready', icon: 'Soda', img: null },
]

export const MENU = [
  // Wraps
  { id: 'tawook', cat: 'wraps', name: 'Tawook', desc: 'Marinated grilled chicken, garlic sauce and pickles.', sizes: { Medium: 480000, Large: 600000 } },
  { id: 'taktawook', cat: 'wraps', name: 'Taktawook', desc: 'The house signature, the wrap the place is named after.', sizes: { Medium: 480000, Large: 600000 }, tags: ['fav'] },
  { id: 'spicy-tawook', cat: 'wraps', name: 'Spicy Tawook', desc: 'Our classic chicken with a fiery kick.', sizes: { Medium: 540000, Large: 700000 }, tags: ['spicy'] },
  { id: 'cheesy-tawook', cat: 'wraps', name: 'Cheesy Tawook', desc: 'Grilled chicken wrapped with melted cheese.', sizes: { Medium: 540000, Large: 700000 } },
  { id: 'strips-wrap', cat: 'wraps', name: 'Chicken Strips', desc: 'Golden boneless chicken strips in a warm wrap.', sizes: { Medium: 450000, Large: 650000 }, tags: ['fav'] },
  { id: 'sausage-wrap', cat: 'wraps', name: 'Spicy Beef Sausage', desc: 'Sizzling spiced beef sausage, Lebanese style.', sizes: { Medium: 400000, Large: 450000 } },
  { id: 'escalope-wrap', cat: 'wraps', name: 'Chicken Escalope', desc: 'Breaded crispy chicken escalope.', price: 500000 },
  { id: 'fries-wrap', cat: 'wraps', name: 'Fries Sandwich', desc: 'Crispy fries and garlic sauce, a street-food classic.', sizes: { Medium: 230000, Large: 280000 } },

  // Baguettes
  { id: 'sausage-bag', cat: 'baguettes', name: 'Spicy Beef Sausage', desc: 'Spiced beef sausage in a toasted baguette.', price: 450000 },
  { id: 'strips-bag', cat: 'baguettes', name: 'Chicken Strips', desc: 'Crispy boneless strips, sauce and pickles.', price: 500000 },
  { id: 'escalope-bag', cat: 'baguettes', name: 'Chicken Escalope', desc: 'Breaded escalope with fresh veggies.', price: 500000 },
  { id: 'chicken-bag', cat: 'baguettes', name: 'Chicken Sandwich', desc: 'Grilled chicken, fully loaded.', price: 580000 },

  // Subs
  { id: 'tawook-sub', cat: 'subs', name: 'Tawook Sub', desc: 'Grilled tawook in a sesame sub roll.', price: 650000 },
  { id: 'mexican-sub', cat: 'subs', name: 'Mexican Tawook', desc: 'Tawook with peppers, corn and a Tex-Mex twist.', price: 600000, tags: ['spicy'] },
  { id: 'crispy-sub', cat: 'subs', name: 'Crispy Sub', desc: 'Crunchy fried chicken, slaw and creamy sauce.', price: 590000 },
  { id: 'francisco-sub', cat: 'subs', name: 'Francisco', desc: 'Chicken, mushrooms and melted cheese.', price: 600000 },

  // Burgers
  { id: 'tak-burger', cat: 'burgers', name: 'Tak Burger', desc: 'The signature beef burger with all the house extras.', price: 580000, tags: ['fav'] },
  { id: 'mexi-burger', cat: 'burgers', name: 'Mexi-Tak Burger', desc: 'Jalapeños, spicy sauce and attitude.', price: 580000, tags: ['spicy'] },
  { id: 'tawooked-burger', cat: 'burgers', name: 'Tawooked Burger', desc: 'Where the burger meets our famous tawook.', price: 530000, tags: ['fav'] },
  { id: 'golden-burger', cat: 'burgers', name: 'Golden Crispy Burger', desc: 'Crispy fried chicken fillet, golden all over.', price: 580000 },
  { id: 'bbq-burger', cat: 'burgers', name: 'Barbecue Burger', desc: 'Smoky BBQ sauce, mushrooms and cheddar.', price: 580000 },
  { id: 'chili-burger', cat: 'burgers', name: 'Chili Cheddar Burger', desc: 'Double the cheddar, chili heat on top.', price: 680000, tags: ['spicy'] },
  { id: 'lebanese-burger', cat: 'burgers', name: 'Lebanese Burger', desc: 'A local favourite. Add cheddar for 100,000.', price: 530000, extra: { label: 'Add cheddar cheese', price: 100000 } },

  // Platters
  { id: 'breast-platter', cat: 'platters', name: 'Grilled Chicken Breast', desc: 'Served with fries, garlic sauce and pickles.', price: 1100000 },
  { id: 'boneless-platter', cat: 'platters', name: 'Boneless Grilled Chicken', desc: 'A whole or half deboned chicken, charcoal-grilled.', sizes: { Half: 900000, Whole: 1700000 }, tags: ['fav'] },
  { id: 'tawook-platter', cat: 'platters', name: 'Tawook Platter', desc: 'Skewered tawook with all the sides.', price: 1100000 },
  { id: 'escalope-platter', cat: 'platters', name: 'Escalope Platter', desc: 'Crispy escalope, fries and coleslaw.', price: 1000000 },

  // Starters & sides
  { id: 'tenders', cat: 'starters', name: 'Crispy Chicken Tenders', desc: 'With BBQ sauce.', price: 500000 },
  { id: 'popcorn', cat: 'starters', name: 'Popcorn Chicken', desc: 'With honey mustard sauce.', price: 500000 },
  { id: 'fries', cat: 'starters', name: 'Imported Fries', desc: 'With ketchup.', price: 330000 },
  { id: 'curly', cat: 'starters', name: 'Curly Fries', desc: 'With cocktail sauce.', price: 350000, tags: ['fav'] },
  { id: 'wedges', cat: 'starters', name: 'Potato Wedges', desc: 'With cocktail sauce.', price: 330000 },

  // Salads
  { id: 'caesar', cat: 'salads', name: 'Caesar Salad', desc: 'Romaine, parmesan, croutons and Caesar dressing.', price: 480000, extra: { label: 'Add grilled chicken', price: 170000 } },
  { id: 'kale', cat: 'salads', name: 'Kale Salad', desc: 'Crunchy kale, seeds and house dressing.', price: 480000, extra: { label: 'Add grilled chicken', price: 170000 } },
  { id: 'fattoush', cat: 'salads', name: 'Fattoush', desc: 'Lebanese garden salad with crispy bread and sumac.', price: 450000 },

  // Drinks
  { id: 'soft', cat: 'drinks', name: 'Soft Drink', desc: 'Can, ice cold.', price: 110000 },
  { id: 'water', cat: 'drinks', name: 'Water', desc: 'Small bottle.', price: 40000 },
  { id: 'sparkling', cat: 'drinks', name: 'Sparkling Water', desc: 'Lightly fizzy.', price: 100000 },
  { id: 'icetea', cat: 'drinks', name: 'Iced Tea', desc: 'Sweet and refreshing.', price: 100000 },
  { id: 'juice', cat: 'drinks', name: 'Juice', desc: 'Small pack.', price: 40000 },
  { id: 'ayran', cat: 'drinks', name: 'Yogurt Drink', desc: 'Chilled, lightly salted yogurt drink.', price: 110000 },
]

export const MEAL_BOOSTER = { label: 'Meal Booster: fries & soft drink', price: 260000 }
export const BOOSTABLE = new Set(['wraps', 'baguettes', 'subs', 'burgers'])

export const WING_FLAVORS = ['Sweet & Chili', 'Plain', 'Grilled', 'Buffalo', 'BBQ']

export const BRANCHES = [
  {
    id: 'sarba',
    name: 'Sarba',
    area: 'Sarba, Jounieh',
    phones: ['09 912 803', '03 131 140'],
    map: 'https://www.google.com/maps/search/?api=1&query=Taktawook+Sarba+Jounieh',
  },
  {
    id: 'dora',
    name: 'Dora',
    area: 'Dora, Beirut',
    phones: ['01 255 663', '01 255 667'],
    map: 'https://www.google.com/maps/search/?api=1&query=Taktawook+Dora',
  },
]

export const WHATSAPP = '9613131140'
export const EMAIL = 'info.taktawook@gmail.com'
export const INSTAGRAM = 'https://www.instagram.com/taktawook/'
// Open daily 11:30 AM until midnight (Beirut time)
export const HOURS = { open: 11 * 60 + 30, close: 24 * 60 }

export const formatLBP = (n) => `${n.toLocaleString('en-US')} LBP`
