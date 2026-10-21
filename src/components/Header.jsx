import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { restaurant } from '../config/restaurant.js'
import { phoneLink, whatsappLink } from '../lib/format.js'
import { CartButton } from './CartButton.jsx'
import { IconPhone, IconWhatsApp } from './Icons.jsx'
import { Logo } from './Logo.jsx'
import { SocialLinks } from './SocialLinks.jsx'

export const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__brand" aria-label={`${restaurant.name} home`}>
          <Logo size={38} />
        </Link>

        <nav className="header__nav" aria-label="Main">
          <ul>
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className="header__link">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <SocialLinks className="header__social" size={20} />
          <span className="header__divider" aria-hidden="true" />
          <CartButton variant="header" />
        </div>

        {/* Phones get quick call / WhatsApp here; navigation and cart live in the bottom dock. */}
        <div className="header__quick">
          <a href={phoneLink} className="icon-btn" aria-label={`Call ${restaurant.name}`}>
            <IconPhone size={19} />
          </a>
          <a href={whatsappLink()} className="icon-btn icon-btn--wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us">
            <IconWhatsApp size={20} />
          </a>
        </div>
      </div>
    </header>
  )
}
