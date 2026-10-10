import { useEffect, useState } from 'react'
import { restaurant, formatPhone } from '../data/restaurant.js'
import { useShop } from '../context/ShopContext.jsx'
import { formatPrice } from '../lib/format.js'
import { goToSection } from '../lib/router.js'
import { whatsappUrl } from '../lib/whatsapp.js'
import Icon from './Icon.jsx'
import SocialLinks from './SocialLinks.jsx'

export const NAV = [
  { id: 'top', label: 'Home', icon: 'home' },
  { id: 'menu', label: 'Menu', icon: 'menu' },
  { id: 'about', label: 'About', icon: 'info' },
  { id: 'contact', label: 'Contact', icon: 'chat' },
]

/** Which home-page section is under the header right now. */
export function useActiveSection(enabled) {
  const [active, setActive] = useState('top')
  useEffect(() => {
    if (!enabled) return
    const ids = NAV.map((n) => n.id).filter((id) => id !== 'top')
    const onScroll = () => {
      const line = window.innerHeight * 0.35
      let current = 'top'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])
  return active
}

function NavLink({ item, active, className, children }) {
  return (
    <a
      href={item.id === 'top' ? '/' : `/#${item.id}`}
      className={className}
      aria-current={active ? 'location' : undefined}
      onClick={(e) => {
        e.preventDefault()
        goToSection(item.id)
      }}
    >
      {children}
    </a>
  )
}

export default function Header({ isHome }) {
  const { count, subtotal, openCart } = useShop()
  const active = useActiveSection(isHome)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <NavLink item={NAV[0]} className="brand" active={false}>
          <img src="/images/logo-240.webp" alt="" width="44" height="44" className="brand__logo" />
          <span className="brand__name">{restaurant.name}</span>
        </NavLink>

        <nav className="header__nav" aria-label="Main">
          {NAV.map((item) => (
            <NavLink key={item.id} item={item} active={isHome && active === item.id} className="header__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <SocialLinks className="header__social" showWhatsapp={false} />
          <a className="header__call" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={`Order on WhatsApp, ${formatPhone()}`}>
            <Icon name="whatsapp" size={18} />
            <span>{formatPhone()}</span>
          </a>
          <button type="button" className="cart-btn" onClick={openCart} data-cart-target aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}>
            <Icon name="bag" size={20} />
            <span className="cart-btn__label">Bag</span>
            {count > 0 && <span className="cart-btn__total">{formatPrice(subtotal)}</span>}
            <span className={`cart-btn__count ${count ? '' : 'is-empty'}`} key={count}>{count}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

/** Thumb-reach bar for phones. The bag sits in the middle so it is always one tap away. */
export function MobileBar({ isHome }) {
  const { count, openCart } = useShop()
  const active = useActiveSection(isHome)
  const [left, right] = [NAV.slice(0, 2), NAV.slice(2)]
  const link = (item) => (
    <NavLink key={item.id} item={item} active={isHome && active === item.id} className="mbar__link">
      <Icon name={item.icon} size={21} />
      <span>{item.label}</span>
    </NavLink>
  )
  return (
    <nav className="mbar" aria-label="Quick navigation">
      {left.map(link)}
      <button type="button" className="mbar__bag" onClick={openCart} data-cart-target aria-label={`Open bag, ${count} item${count === 1 ? '' : 's'}`}>
        <Icon name="bag" size={22} />
        {count > 0 && <span className="mbar__count" key={count}>{count}</span>}
      </button>
      {right.map(link)}
    </nav>
  )
}
