import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import { useLang } from '../i18n/LanguageContext'
import CartButton from './CartButton'
import LanguageSwitch from './LanguageSwitch'
import Logo from './Logo'
import OpenStatus from './OpenStatus'
import SocialLinks from './SocialLinks'
import { WhatsAppIcon } from './Icons'

export const NAV = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/menu', key: 'nav.menu' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Header() {
  const { t, pick } = useLang()
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
        <Link to="/" className="brand" aria-label={t('nav.homeOf', { name: pick(restaurant.name) })}>
          <Logo size={46} />
          <span className="brand__text">
            <span className="brand__name">{pick(restaurant.name)}</span>
            <span className="brand__tag">{pick(restaurant.tagline)}</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label={t('nav.main')}>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="main-nav__link">
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__end">
          <OpenStatus className="site-header__status" />
          <SocialLinks className="site-header__social" size={19} whatsapp={false} />
          <a href={whatsappLink()} className="icon-btn site-header__wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <WhatsAppIcon size={22} />
          </a>
          <LanguageSwitch />
          <CartButton className="site-header__cart" showLabel />
        </div>
      </div>
    </header>
  )
}
