/** Layouts for the floating product stages (positions in % of the stage). */
import { asset } from '../lib/asset'
const f = (name) => asset(`img/float/${name}.webp`)

export const burgerHero = [
  { src: f('onion-rings'), x: 0, y: 12, w: 28, rotate: -14, depth: 1.6 },
  { src: f('sauce-zinger'), x: 74, y: 10, w: 20, rotate: 12, depth: 2.2 },
  { src: f('mozzarella-sticks'), x: 74, y: 78, w: 24, rotate: 16, depth: 2.4 },
  { src: f('pepsi'), x: 2, y: 56, w: 10, rotate: -12, depth: 1.2 },
  { src: f('onion-rings'), x: 82, y: 44, w: 14, rotate: 30, depth: 0.5, blur: 2 },
]

/** The two Cheesy burgers, staggered like the "Beef or Chicken?" post. */
export const cheesyDuo = [
  { src: f('cheesy-beef'), x: 0, y: 4, w: 64, rotate: -4, depth: 1.4 },
  { src: f('cheesy-chicken'), x: 36, y: 46, w: 64, rotate: 4, depth: 2 },
]

export const sidesFeature = [
  { src: f('onion-rings'), x: 2, y: 4, w: 30, rotate: -12, depth: 1.8 },
  { src: f('mozzarella-sticks'), x: 66, y: 6, w: 30, rotate: 14, depth: 2.2 },
  { src: f('pepsi'), x: 4, y: 70, w: 11, rotate: -10, depth: 1.2 },
]
