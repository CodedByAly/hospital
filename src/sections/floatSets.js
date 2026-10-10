/** Ingredient layouts for the floating product stages (positions in % of the stage). */
import { asset } from '../lib/asset'
const f = (name) => asset(`img/float/${name}.webp`)

export const smoothieHero = [
  { src: f('mint-1'), x: 8, y: 14, w: 15, rotate: -18, depth: 1.6 },
  { src: f('mango-2'), x: 76, y: 20, w: 15, rotate: 14, depth: 2.2 },
  { src: f('mint-3'), x: 70, y: 52, w: 14, rotate: 22, depth: 1.2 },
  { src: f('mint-sprig'), x: 4, y: 64, w: 20, rotate: -6, depth: 2.4 },
  { src: f('mint-5'), x: 80, y: 78, w: 11, rotate: -30, depth: 0.6, blur: 1.5 },
  { src: f('mint-4'), x: 22, y: 40, w: 8, rotate: 40, depth: 0.5, blur: 2 },
]

export const smoothieFeature = [
  { src: f('mint-2'), x: 12, y: 18, w: 14, rotate: 10, depth: 1.8 },
  { src: f('mango-2'), x: 70, y: 10, w: 13, rotate: -24, depth: 1.4 },
  { src: f('mint-5'), x: 74, y: 60, w: 14, rotate: 18, depth: 2.2 },
  { src: f('mint-1'), x: 6, y: 66, w: 11, rotate: -40, depth: 0.7, blur: 1.5 },
]

export const bubbleFeature = [
  { src: f('strawberry-2'), x: 6, y: 12, w: 15, rotate: -14, depth: 1.8 },
  { src: f('pearl-1'), x: 74, y: 16, w: 11, depth: 2.4 },
  { src: f('strawberry-3'), x: 72, y: 62, w: 16, rotate: 18, depth: 1.5 },
  { src: f('pearl-3'), x: 12, y: 58, w: 8, depth: 1.1 },
  { src: f('pearl-5'), x: 64, y: 40, w: 4, depth: 0.6, blur: 1 },
  { src: f('pearl-1'), x: 22, y: 84, w: 6, depth: 0.5, blur: 2 },
]
