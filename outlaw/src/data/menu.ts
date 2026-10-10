/**
 * Outlaw Sushi Bar menu, transcribed from the restaurant's Thrubits digital menu
 * (rest.thrubits.com). Prices are in US dollars exactly as listed.
 *
 * Names keep the restaurant's own spelling ("Drogo", "Bombifire", "Seniora").
 * Only obvious typos were fixed ("cripy" → crispy, "buritto" → burrito,
 * "rap" → wrap, "teriaki" → teriyaki, "smocked" → smoked). Items listed as
 * separate sizes on the menu (water, wine, sushi cake) are grouped into one
 * item with sizes.
 *
 * Photos: `photo` is a file in /public/img/menu (and /img/menu/sm for lists),
 * `cutout` a background-free image in /public/img/cut. Replace a file with
 * the original photo under the same name to sharpen it; leave both out to
 * show a placeholder.
 */

export type Size = { id: string; label: string; price: number }

export type MenuItem = {
  id: string
  category: string
  name: string
  description?: string
  price?: number
  sizes?: Size[]
  photo?: string
  cutout?: string
  /** Shown as a small note on the item (only where the menu itself says so). */
  note?: string
}

export type Category = {
  id: string
  name: string
  /** Pieces per order, from the category name on the menu ("Ura Crispy 4 Pcs"). */
  pieces?: string
  blurb?: string
}

export const categories: Category[] = [
  { id: 'september-deal', name: 'September Deal', blurb: 'Mixed salmon, crab and shrimp sets, each with a free crazy exotic salad.' },
  { id: 'tempura-fried-maki', name: 'Tempura Fried Maki' },
  { id: 'salmon-holic', name: 'Salmon Holic', blurb: 'All salmon: nigiri, ura maki, sashimi and hoso maki.' },
  { id: 'crab-addiction', name: 'Crab Addiction', blurb: 'Mixed crab maki with a mini crazy salad.' },
  { id: 'outlaw-burritos', name: "Outlaw Burrito's" },
  { id: 'trio-outlaw-temaki', name: 'Trio Outlaw Temaki' },
  { id: 'ura-crispy', name: 'Ura Crispy', pieces: '4 pcs' },
  { id: 'ura-sesame', name: 'Ura Sesame', pieces: '4 pcs' },
  { id: 'ura-tobiko', name: 'Ura Tobiko', pieces: '4 pcs' },
  { id: 'special-maki', name: 'Special Maki', pieces: '4 pcs' },
  { id: 'futo-maki', name: 'Futo Maki', pieces: '5 pcs' },
  { id: 'hoso-maki', name: 'Hoso Maki', pieces: '3 pcs' },
  { id: 'nigiri', name: 'Nigiri', pieces: '2 pcs' },
  { id: 'sashimi', name: 'Sashimi', pieces: '3 pcs' },
  { id: 'temaki', name: 'Temaki', pieces: '1 pc' },
  { id: 'burrito', name: 'Burrito' },
  { id: 'dragon-maki', name: 'Dragon Maki' },
  { id: 'starters', name: 'Starters & Appetizers' },
  { id: 'salad', name: 'Salad' },
  { id: 'platters', name: 'Platters' },
  { id: 'sushi-cake', name: 'Sushi Cake' },
  { id: 'beverage', name: 'Beverage' },
]

type Row = [id: string, name: string, price: number, description?: string]

/** Builds items for a category whose photos are named after the item id. */
const rows = (category: string, list: Row[]): MenuItem[] =>
  list.map(([id, name, price, description]) => ({ id, category, name, price, description, photo: id }))

export const menu: MenuItem[] = [
  ...rows('september-deal', [
    ['september-deal-set-1', 'September Deal Set 1', 25, '28 pieces mixed salmon, crab and shrimp + 1 crazy exotic salad free'],
    ['september-deal-set-2', 'September Deal Set 2', 35, '38 pieces mixed salmon, crab and shrimp + 1 crazy exotic salad free'],
    ['september-deal-set-3', 'September Deal Set 3', 45, '48 pieces mixed salmon, crab and shrimp + 1 crazy exotic salad free'],
    ['tutti-fruity', 'Tutti Fruity', 16, '16 pieces, 4 flavors in one set: strawberry, kiwi, mango, avocado'],
    ['pregnancy-sushi-set', 'Pregnancy Sushi Set', 25, '24 pieces, raw-less: grilled salmon, fried shrimp, crab sticks. Perfect balance made for you'],
  ]),
  ...rows('tempura-fried-maki', [
    ['tempura-fried-maki', 'Tempura Fried Maki', 24, '24 pieces mixed fried crab and shrimp'],
  ]),
  ...rows('salmon-holic', [
    ['salmon-holic-set-1', 'Salmon Holic Set 1', 22, '16 pieces all salmon: nigiri, ura maki, sashimi, hoso maki'],
    ['salmon-holic-set-2', 'Salmon Holic Set 2', 36, '32 pieces all salmon: nigiri, ura maki, sashimi, hoso maki'],
    ['salmon-holic-set-3', 'Salmon Holic Set 3', 46, '40 pieces all salmon: nigiri, ura maki, sashimi, hoso maki'],
  ]),
  ...rows('crab-addiction', [
    ['crab-addiction-set-1', 'Crab Addiction Set 1', 13, '16 pieces mixed crab maki + 1 mini crazy salad'],
    ['crab-addiction-set-2', 'Crab Addiction Set 2', 18, '24 pieces mixed crab maki + 1 mini crazy salad'],
    ['crab-addiction-set-3', 'Crab Addiction Set 3', 26, '32 pieces mixed crab maki + 1 mini crazy salad'],
  ]),
  ...rows('outlaw-burritos', [
    ['outlaw-burritos', "Outlaw Burrito's", 35, "3 flavors of burrito's: 1 crazy burrito, 1 salmon burrito, 1 shrimp burrito, all in one platter"],
  ]),
  ...rows('trio-outlaw-temaki', [
    ['trio-outlaw-temaki', 'Trio Outlaw Temaki', 12, '3 flavors, 1 craving: 1 crazy temaki, 1 spicy salmon temaki, 1 outlaw temaki'],
  ]),
  ...rows('ura-crispy', [
    ['crazy-crispy', 'Crazy Crispy', 4, 'Crazy crab crispy wrap topped with crazy crab'],
    ['california-crispy', 'California Crispy', 4, 'Crab, avocado, cucumber, crispy wrap'],
    ['spicy-shrimp-crispy', 'Spicy Shrimp Crispy', 5.5, 'Spicy shrimp crispy wrap topped with spicy shrimp'],
    ['qoa-crispy', 'Qoa Crispy', 6, 'Fried shrimp tempura, avocado, crispy wrap, our teriyaki sauce'],
    ['philly-bom-crispy', 'Philly Bom Crispy', 5, 'Salmon, avocado, rocca, crispy wrap'],
    ['crispy-duo', 'Crispy Duo', 5, 'Salmon, avocado, crispy wrap'],
    ['red-sea-crispy', 'Red Sea Crispy', 6, 'Red tuna, green onion, avocado, crispy wrap'],
    ['special-crispy', 'Special Crispy', 6, 'Spicy salmon, avocado, crazy crab, special sauce'],
  ]),
  ...rows('ura-sesame', [
    ['crazy-sesame', 'Crazy Sesame', 4, 'Crazy crab sesame wrap topped with crazy'],
    ['california-sesame', 'California Sesame', 4, 'Crab, cucumber, avocado, sesame wrap'],
    ['philly-sesame', 'Philly Sesame', 6, 'Salmon, avocado, philly cheese, sesame wrap'],
    ['tunasu-sesame', 'Tunasu Sesame', 6, 'Red tuna, avocado, green onion, sesame wrap'],
    ['special-sesame', 'Special Sesame', 6.5, 'Crab, mango, shrimp, philly cheese, sesame wrap'],
  ]),
  ...rows('ura-tobiko', [
    ['crazy-tobiko', 'Crazy Tobiko', 4.5, 'Crazy crab tobiko wrap topped with crazy crab'],
    ['california-tobiko', 'California Tobiko', 4.5, 'Crab, cucumber, avocado, tobiko wrap'],
    ['spicy-shrimp-tobiko', 'Spicy Shrimp Tobiko', 6, 'Spicy shrimp tobiko wrap topped with spicy shrimp'],
    ['philly-tobiko', 'Philly Tobiko', 5.5, 'Salmon, avocado, philly cheese, tobiko wrap'],
    ['philly-tuna-tobiko', 'Philly Tuna Tobiko', 5.5, 'Red tuna, avocado, philly cheese, tobiko wrap'],
    ['special-tobiko', 'Special Tobiko', 5.5, 'Fried shrimp, avocado, special sauce, tobiko wrap'],
    ['crazy-shrimpy-tobiko', 'Crazy Shrimpy Tobiko', 4.75, 'Spicy shrimp, avocado, tobiko wrap'],
  ]),
  ...rows('special-maki', [
    ['sp-mango', 'Special Mango', 5.25, 'Crab, avocado, philly cheese, tobiko, mango wrap'],
    ['sp-salmon', 'Special Salmon', 5.5, 'Salmon, avocado, salmon wrap'],
    ['sp-philly', 'Special Philly', 5.25, 'Avocado, philly cheese, salmon wrap'],
    ['sp-pineapple', 'Special Pineapple', 4.75, 'Shrimp, avocado, philly cheese, wrapped in pineapple'],
    ['sp-shrimp', 'Special Shrimp', 5.75, 'Shrimp, avocado, spicy sauce, shrimp wrap'],
    ['sp-tempura', 'Special Tempura', 6.5, 'Fried tempura shrimp, salmon, mango and avocado wrap'],
    ['sp-tuna', 'Special Tuna', 5.75, 'Red tuna, avocado, green onion, tuna wrap'],
    ['black-fruity', 'Black Fruity', 4.5, 'Salmon, crab, wrapped in black sesame, topped with spicy sauce and mango'],
    ['sp-smoked-salmon', 'Special Smoked Salmon', 4.75, 'Avocado, philly cheese, wrapped in smoked salmon'],
    ['strawberry-roll', 'Strawberry Roll', 6.5, 'Salmon, avocado, philly cheese, wrapped in strawberry'],
    ['bombifire', 'Bombifire', 4.5, 'Salmon, crazy mixed, philly cheese, togarashi wrap'],
    ['sp-spicy-salmon', 'Special Spicy Salmon', 6, 'Crazy mixed & mango wrapped in spicy salmon, topped with crazy salmon mix and spicy sauce'],
    ['sp-salmon-crab', 'Special Salmon Crab', 4.5, 'Crazy crab, avocado, salmon wrap'],
    ['sp-avocado', 'Special Avocado', 5.25, 'Salmon, avocado, philly cheese, avocado wrap'],
    ['sp-outlaw', 'Special Outlaw', 7, 'Salmon, avocado, philly cheese, flaming salmon wrap topped with spicy sauce'],
    ['the-lovers', 'The Lovers', 7, 'Fried calamari, avocado, special sauce, salmon wrap'],
    ['mr-white', 'Mr. White', 6.5, 'Crazy mixed & spicy salmon topped with pineapple and flaming salmon'],
    ['bonita-special', 'Bonita Special', 6.75, 'Spicy tuna, avocado, mixed double'],
    ['grilled-salmon-sweet', 'Grilled Salmon Sweet', 5.7, 'Marinated grilled salmon & avocado, mixed crispy grilled salmon wrap, teriyaki sauce'],
    ['sp-crab', 'Special Crab', 4.25, 'Crazy crab wrapped in crab'],
    ['crabby', 'Crabby', 5.5, 'Spicy salmon, tobiko, wrapped in crazy crab'],
    ['sp-seniora-maki', 'Special Seniora Maki', 7, 'Crazy mixed salmon, shrimp and mango wrap, mango on top'],
    ['exoticos', 'Exoticos', 5.5, 'Crazy mixed crab, salmon wrap, mango and avocado on top'],
    ['queen-of-maki', 'Queen of Maki', 4.75, 'Crazy mixed & salmon, spicy salmon wrap, spicy crazy mixed on top'],
    ['volcano-of-feelings', 'Volcano of Feelings', 6.75, 'Crispy salmon mixed, salmon wrap, crispy salmon on top & teriyaki sauce'],
    ['kokozaki', 'Kokozaki', 6.5, 'Spicy shrimp, mango & avocado wrap'],
    ['rainbow', 'Rainbow', 6.25, 'Crab, rocca, bell pepper & salmon, mango and smoked salmon wrap'],
    ['mangonella', 'Mangonella', 6, 'Crazy mixed & salmon, philly cheese, mango wrap'],
    ['miss-international', 'Miss International', 5.75, 'Crispy salmon mixed, salmon, avocado wrap'],
    ['skinny-salmoona', 'Skinny Salmoona', 5.75, 'Crazy spicy salmon wrapped crispy, topped with salmon skin mix and teriyaki sauce'],
  ]),
  ...rows('futo-maki', [
    ['california-futo', 'California Futo', 5.5, 'Crab, shrimp, avocado, cucumber'],
    ['geicha-futo', 'Geicha Futo', 6.5, 'Crispy spicy salmon mixed, philly cheese'],
    ['budha-sal-futo', 'Budha Sal Futo', 10, 'Salmon, tuna, avocado, philly cheese'],
    ['crazy-senior-futo', 'Crazy Senior Futo', 8.5, 'Crazy mixed salmon & mango, tobiko wrap'],
    ['tempura-mamito-futo', 'Tempura Mamito Futo', 12, 'Salmon tempura, philly cheese, salmon wrap'],
    ['orlando-futo', 'Orlando Futo', 9, 'Sweet teriyaki salmon mixed, philly cheese, wrapped in crazy mixed'],
  ]),
  ...rows('hoso-maki', [
    ['hoso-salmon', 'Hoso Salmon', 2.75],
    ['hoso-tuna', 'Hoso Tuna', 2.75],
    ['hoso-crab', 'Hoso Crab', 1.5],
    ['hoso-crazy', 'Hoso Crazy', 1.75],
    ['hoso-spicy-salmon', 'Hoso Spicy Salmon', 2],
    ['hoso-spicy-tuna', 'Hoso Spicy Tuna', 2.75],
    ['hoso-spicy-shrimp', 'Hoso Spicy Shrimp', 2.75],
    ['hoso-shrimp', 'Hoso Shrimp', 2.75],
    ['hoso-salmon-avocado', 'Hoso Salmon Avocado', 2.25],
    ['hoso-avocado', 'Hoso Avocado', 1.5],
    ['hoso-grilled-salmon', 'Hoso Grilled Salmon', 2],
  ]),
  ...rows('nigiri', [
    ['sushi-crab', 'Sushi Crab', 1.5],
    ['sushi-avocado', 'Sushi Avocado', 2.25],
    ['sushi-salmon', 'Sushi Salmon', 2],
    ['sushi-tuna', 'Sushi Tuna', 2.25],
    ['sushi-tempura-shrimp', 'Sushi Tempura Shrimp', 3],
    ['sushi-shrimp', 'Sushi Shrimp', 2],
  ]),
  ...rows('sashimi', [
    ['salmon-sashimi', 'Salmon Sashimi', 6],
    ['tuna-sashimi', 'Tuna Sashimi', 7],
    ['shrimp-sashimi', 'Shrimp Sashimi', 5],
    ['crab-sashimi', 'Crab Sashimi', 2],
  ]),
  ...rows('temaki', [
    ['crazy-temaki', 'Crazy Temaki', 3],
    ['spicy-salmon-temaki', 'Spicy Salmon Temaki', 4.5],
    ['shrimp-avocado-temaki', 'Shrimp Avocado Temaki', 4],
    ['special-temaki', 'Special Temaki', 4],
  ]),
  ...rows('burrito', [
    ['crazy-buritto', 'Crazy Burrito', 10],
    ['spicy-salmon-buritto', 'Spicy Salmon Burrito', 13],
    ['chef-buritto', 'Chef Burrito', 15],
    ['mixed-buritto', 'Mixed Burrito', 14],
  ]),
  ...rows('dragon-maki', [
    ['big-boss-drogo', 'Big Boss Drogo', 9, '8 pieces crispy shrimp tempura & avocado, sweet teriyaki sauce & sesame'],
    ['rainbow-dragon', 'Rainbow Dragon', 10, '8 pieces crab tempura & avocado, philly cheese, rainbow wrap'],
    ['outlaw-dragon', 'Outlaw Dragon', 12, '8 pieces shrimp tempura & avocado, spicy sauce, wrapped with salmon, topped with black tobiko'],
    ['special-one', 'Special One', 18, '8 pieces salmon mixed with mango & avocado, togarashi, wrapped with salmon and mango, topped with orange sauce & teriyaki'],
  ]),
  ...rows('starters', [
    ['spring-rolls-vegetables', 'Spring Rolls Vegetables', 5, '6 pieces, served with sweet & sour sauce'],
    ['calamari-rings', "Calamari Ring's", 7.5, '6 pieces, served with chef sauce'],
    ['edamame', 'Edamame', 6, 'Soybeans served with marinated sauce'],
    ['cheese-rolls', 'Cheese Rolls', 6, '6 pieces, served with sweet & chili sauce'],
    ['shrimp-tempura', 'Shrimp Tempura', 11, '5 pieces, served with sweet & sour sauce'],
    ['fried-crab', 'Fried Crab', 5, '5 pieces, served with spicy sauce'],
    ['mixed-appetizers-combo', 'Mixed Appetizers Combo', 11, '2 pieces shrimp rolls, 2 pieces calamari rings, 2 pieces fried crab, 2 pieces cheese rolls, 2 pieces spring rolls vegetables, served with sweet & sour sauce'],
  ]),
  ...rows('salad', [
    ['crazy-salad', 'Crazy Salad', 8],
    ['crispy-salmon-salad', 'Crispy Salmon Salad', 16],
    ['spicy-salmon-salad', 'Spicy Salmon Salad', 17],
    ['marinated-salmon-salad', 'Marinated Salmon Salad', 18],
    ['poke-salad', 'Poke Salad', 15],
    ['salmon-veggie-salad', 'Salmon Veggie Salad', 14],
    ['crispy-tuna-salad', 'Crispy Tuna Salad', 18],
    ['duo-saltuna-salad', 'Duo Saltuna Salad', 18],
  ]),
  ...rows('platters', [
    ['senior-set', 'Senior Set · 16 pcs', 20, '1 crazy crispy, 1 special salmon crab, 1 special exotic, 1 philly tobiko'],
    ['classico-salmon-set', 'Classico Salmon Set · 20 pcs', 33, '1 special salmon, 1 special avocado, 1 special philly, 1 hoso salmon, 1 sushi salmon, 1 sashimi salmon'],
    ['la-casa-set', 'La Casa Set · 24 pcs', 32, '1 california sesame, 1 special salmon, 1 special avocado, 1 black fruity, 1 queen of maki, 1 crazy crispy'],
    ['u-and-i-set', 'U and I Set · 32 pcs', 38, '1 california crispy, 1 crazy crispy, 1 special crab, 1 black fruity, 1 bombifire, 1 special salmon, 1 special avocado, 1 special salmon crab'],
    ['sushi-lovers-set', 'Sushi Lovers Set · 42 pcs', 48, '1 special salmon, 1 special avocado, 1 special mango, 1 special pineapple, 1 special tuna, 1 special crab, 1 the lovers, 1 special shrimp, 1 strawberry roll, 1 budha sal futo'],
    ['rainbow-set', 'Rainbow Set · 63 pcs', 72, '1 crazy crispy, 1 california sesame, 1 bombifire, 1 philly sesame, 1 california tobiko, 1 philly tobiko, 1 crispy duo, 1 special salmon crab, 1 special crab, 1 special avocado, 1 black fruity, 1 strawberry roll, 1 special spicy salmon, 1 ginger bu, 1 mr. white, 1 hoso salmon'],
    ['visitors-set', 'Visitors Set · 96 pcs', 110, '2 crazy crispy, 1 california sesame, 1 crazy tobiko, 1 philly tobiko, 1 black fruity, 1 bombifire, 1 queen of maki, 1 crabby, 1 special salmon crab, 1 special avocado, 1 special salmon, 1 special spicy salmon, 1 the lovers, 1 geicha futo, 1 crazy senior futo, 1 hoso crab, 1 hoso salmon, 1 strawberry roll, 1 sushi shrimp, 1 sushi salmon, 1 sushi crab, 5 pieces salmon sashimi'],
    ['big-budha-set', 'Big Budha Set · 120 pcs', 135, '2 crazy crispy, 1 california sesame, 1 crazy tobiko, 1 philly tobiko, 1 black fruity, 1 bombifire, 1 queen of maki, 1 crabby, 2 special salmon crab, 2 special avocado, 1 special salmon, 1 special spicy salmon, 1 the lovers, 1 special mango, 1 special pineapple, 1 special philly, 1 special crispy, 1 geicha futo, 1 crazy senior futo, 1 hoso crab, 1 hoso salmon, 1 strawberry roll, 1 sushi shrimp, 1 sushi salmon, 1 sushi crab, 5 pieces salmon sashimi'],
  ]),
  {
    id: 'sushi-cake', category: 'sushi-cake', name: 'Sushi Cake', photo: 'sushi-cake',
    sizes: [
      { id: '4', label: '4 pers size', price: 30 },
      { id: '8', label: '8 pers size', price: 65 },
      { id: '15', label: '15 pers size', price: 90 },
    ],
  },
  // ── Beverage ─────────────────────────────────────────────────
  {
    id: 'water', category: 'beverage', name: 'Water', cutout: 'water-small',
    sizes: [{ id: 'small', label: 'Small', price: 0.5 }, { id: 'big', label: 'Big', price: 0.8 }],
  },
  { id: 'sparkling-water', category: 'beverage', name: 'Sparkling Water', price: 1.5, cutout: 'sparkling-water' },
  { id: 'pepsi', category: 'beverage', name: 'Pepsi', price: 2, cutout: 'pepsi' },
  { id: 'diet-pepsi', category: 'beverage', name: 'Diet Pepsi', price: 2, cutout: 'diet-pepsi' },
  { id: '7up', category: 'beverage', name: '7up', price: 2, cutout: '7up' },
  { id: 'diet-7up', category: 'beverage', name: 'Diet 7up', price: 2, cutout: 'diet-7up' },
  { id: 'mirinda', category: 'beverage', name: 'Mirinda', price: 2, cutout: 'mirinda' },
  { id: 'ice-tea', category: 'beverage', name: 'Ice Tea', price: 3, cutout: 'ice-tea' },
  {
    id: 'white-wine', category: 'beverage', name: 'White Wine', cutout: 'white-wine',
    sizes: [{ id: 'half', label: '1/2 bottle', price: 9 }, { id: 'bottle', label: 'Bottle', price: 18 }],
  },
  {
    id: 'rose-wine', category: 'beverage', name: 'Rosé Wine', cutout: 'rose-wine',
    sizes: [{ id: 'half', label: '1/2 bottle', price: 9 }, { id: 'bottle', label: 'Bottle', price: 18 }],
  },
  {
    id: 'red-wine', category: 'beverage', name: 'Red Wine', cutout: 'red-wine',
    sizes: [{ id: 'half', label: '1/2 bottle', price: 7.5 }, { id: 'bottle', label: 'Bottle', price: 15 }],
  },
]

const byId = new Map(menu.map((item) => [item.id, item]))
export const getItem = (id: string) => byId.get(id)
export const getCategory = (id: string) => categories.find((c) => c.id === id)
export const itemsIn = (categoryId: string) => menu.filter((item) => item.category === categoryId)

export const basePrice = (item: MenuItem) => (item.sizes ? Math.min(...item.sizes.map((s) => s.price)) : (item.price ?? 0))

/** Dishes the homepage stage turns through: the Dragon Makis and the rolls named after the house. */
export const houseRolls = ['outlaw-dragon', 'special-one', 'big-boss-drogo', 'rainbow-dragon', 'sp-outlaw', 'tempura-mamito-futo', 'outlaw-burritos', 'trio-outlaw-temaki']
