import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BookOpen, MapPin } from 'lucide-react'
import { restaurant } from '../config/restaurant'
import CartButton from './CartButton'
import Logo from './Logo'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="bar" data-scrolled={scrolled || pathname !== '/' || undefined}>
        <div className="bar__inner container">
          <Link to="/" className="bar__brand" aria-label={`${restaurant.name}, home`}>
            <Logo size={38} />
            <span className="bar__word" aria-hidden="true">
              <span>OUTLAW</span>
              <small>SUSHI BAR</small>
            </span>
          </Link>
          <nav className="bar__nav" aria-label="Main">
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/visit">Visit &amp; contact</NavLink>
          </nav>
          <div className="bar__cart">
            <CartButton />
          </div>
        </div>
      </header>

      {/* phones: a floating dock within thumb reach */}
      <nav className="dock" aria-label="Quick">
        <NavLink to="/menu" className="dock__link">
          <BookOpen size={19} strokeWidth={1.8} aria-hidden="true" />
          <span>Menu</span>
        </NavLink>
        <NavLink to="/visit" className="dock__link">
          <MapPin size={19} strokeWidth={1.8} aria-hidden="true" />
          <span>Visit</span>
        </NavLink>
        <CartButton variant="dock" />
      </nav>
    </>
  )
}
