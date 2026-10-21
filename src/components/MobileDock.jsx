import { NavLink } from 'react-router-dom'
import { CartButton } from './CartButton.jsx'
import { IconChat, IconHome, IconInfo, IconMenuBook } from './Icons.jsx'

const left = [
  { to: '/', label: 'Home', icon: IconHome, end: true },
  { to: '/menu', label: 'Menu', icon: IconMenuBook },
]
const right = [
  { to: '/about', label: 'About', icon: IconInfo },
  { to: '/contact', label: 'Contact', icon: IconChat },
]

const Item = ({ to, label, icon: Icon, end }) => (
  <li>
    <NavLink to={to} end={end} className="dock__link">
      <Icon size={22} />
      <span className="dock__label">{label}</span>
    </NavLink>
  </li>
)

// Thumb-reach navigation for phones, with the order button in the middle.
export function MobileDock() {
  return (
    <nav className="dock" aria-label="Main">
      <ul>
        {left.map((l) => (
          <Item key={l.to} {...l} />
        ))}
        <li className="dock__cart">
          <CartButton variant="dock" />
        </li>
        {right.map((l) => (
          <Item key={l.to} {...l} />
        ))}
      </ul>
    </nav>
  )
}
