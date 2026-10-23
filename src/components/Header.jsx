import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import CartButton from './CartButton'
import Logo from './Logo'
import OpenStatus from './OpenStatus'
import SocialLinks from './SocialLinks'
import { WhatsAppIcon } from './Icons'

export const NAV = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/menu', label: 'المنيو' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'تواصل' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__bar">
        <Link to="/" className="brand" aria-label={`${restaurant.name} — الرئيسية`}>
          <Logo size={46} />
          <span className="brand__text">
            <span className="brand__name">{restaurant.name}</span>
            <span className="brand__tag">{restaurant.tagline}</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="القائمة الرئيسية">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="main-nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__end">
          <OpenStatus className="site-header__status" />
          <SocialLinks className="site-header__social" size={19} whatsapp={false} />
          <a
            href={whatsappLink()}
            className="icon-btn site-header__wa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="راسلنا على واتساب"
          >
            <WhatsAppIcon size={22} />
          </a>
          <CartButton className="site-header__cart" showLabel />
        </div>
      </div>
    </header>
  )
}
