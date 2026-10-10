import { Chick } from './FoodIcons.jsx'

const WORDS = ['Sauce', 'Bite', 'Repeat', 'Tawook', 'Wings', 'Burgers', 'Curly fries', 'Open till midnight']

export default function Marquee({ tilt = -2, tone = 'red' }) {
  const row = WORDS.flatMap((w) => [
    <span key={w}>{w}</span>,
    <Chick key={`${w}-c`} className="marquee__chick" />,
  ])
  return (
    <div className={`marquee marquee--${tone}`} style={{ '--tilt': `${tilt}deg` }} aria-hidden="true">
      <div className="marquee__track">
        <div className="marquee__row">{row}</div>
        <div className="marquee__row">{row}</div>
      </div>
    </div>
  )
}
