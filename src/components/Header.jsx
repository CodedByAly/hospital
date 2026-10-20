import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import Icon from './Icon'
import SocialLinks from './SocialLinks'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { money } from '../utils/format'
import { restaurant, telLink } from '../config/restaurant'

export const navLinks = [
  { href: '/#top', label: 'Home', id: 'top' },
  { href: '/#menu', label: 'Menu', id: 'menu' },
  { href: '/#about', label: 'About', id: 'about' },
  { href: '/#contact', label: 'Contact', id: 'contact' },
]

export default function Header({ activeSection }) {
  const { count, subtotal } = useCart()
  const { setCartOpen } = useUI()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__brand" aria-label="Chippy home">
          <Logo className="header__logo" />
        </Link>

        <nav className="header__nav" aria-label="Main">
          <ul>
            {navLinks.map((l) => (
              <li key={l.id}>
                <Link to={l.href} aria-current={onHome && activeSection === l.id ? 'true' : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <SocialLinks className="header__social" />
          <a className="header__call" href={telLink}>
            <Icon name="phone" size={17} />
            <span>{restaurant.phone.display}</span>
          </a>
          <button
            type="button"
            className="cart-btn"
            data-cart-target
            onClick={() => setCartOpen(true)}
            aria-label={`Open order, ${count} ${count === 1 ? 'item' : 'items'}`}
          >
            <Icon name="bag" size={20} />
            <span className="cart-btn__label">{count > 0 ? money(subtotal) : 'Order'}</span>
            {count > 0 && <span className="cart-btn__count">{count}</span>}
          </button>
        </div>

        <a className="header__call-mobile" href={telLink} aria-label={`Call ${restaurant.phone.display}`}>
          <Icon name="phone" size={18} />
        </a>
      </div>
    </header>
  )
}
