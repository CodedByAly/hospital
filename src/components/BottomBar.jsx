import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { money } from '../utils/format'

// Phone navigation: thumb-reachable tabs with the order button always
// one tap away, instead of a hamburger menu.
const tabs = [
  { href: '/#top', id: 'top', label: 'Home', icon: 'home' },
  { href: '/#menu', id: 'menu', label: 'Menu', icon: 'menu' },
  { href: '/#contact', id: 'contact', label: 'Contact', icon: 'chat' },
]

export default function BottomBar({ activeSection }) {
  const { count, subtotal } = useCart()
  const { setCartOpen } = useUI()
  const { pathname } = useLocation()
  if (pathname.startsWith('/checkout')) return null
  const onHome = pathname === '/'

  return (
    <nav className="bottombar" aria-label="Quick navigation">
      {tabs.map((t) => (
        <Link key={t.id} to={t.href} className="bottombar__tab" aria-current={onHome && activeSection === t.id ? 'true' : undefined}>
          <Icon name={t.icon} size={21} />
          <span>{t.label}</span>
        </Link>
      ))}
      <button
        type="button"
        className={`bottombar__cart ${count ? 'has-items' : ''}`}
        data-cart-target
        onClick={() => setCartOpen(true)}
        aria-label={`Open order, ${count} ${count === 1 ? 'item' : 'items'}`}
      >
        <span className="bottombar__cart-icon">
          <Icon name="bag" size={20} />
          {count > 0 && <span className="bottombar__count">{count}</span>}
        </span>
        <span>{count > 0 ? money(subtotal) : 'Order'}</span>
      </button>
    </nav>
  )
}
