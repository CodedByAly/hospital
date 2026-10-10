import { asset } from '../lib/asset'
import { NavLink, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { restaurant, whatsappLink } from '../config/restaurant'
import CartButton from './CartButton'
import LanguageSwitch from './LanguageSwitch'
import SocialLinks from './SocialLinks'
import Icon from './Icon'
import './Header.css'

export const NAV = [
  { to: '/', key: 'home', icon: 'home', end: true },
  { to: '/menu', key: 'menu', icon: 'menu' },
  { to: '/about', key: 'about', icon: 'globe' },
  { to: '/contact', key: 'contact', icon: 'chat' },
]

export default function Header() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="site-header" data-scrolled={scrolled || undefined}>
      <a className="skip-link" href="#main">{t('nav.skip')}</a>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__logo" aria-label={`${restaurant.fullName} — ${t('nav.home')}`}>
          <img src={asset('img/brand/logo-badge.png')} alt="" width="48" height="48" />
        </Link>

        <nav className="site-header__nav" aria-label={t('nav.primary')}>
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>{t(`nav.${item.key}`)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <SocialLinks className="site-header__social" size={19} />
          <a className="site-header__wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label={t('common.whatsapp')}>
            <Icon name="whatsapp" size={20} />
          </a>
          <LanguageSwitch />
          <div className="site-header__cart">
            <CartButton variant="pill" />
          </div>
        </div>
      </div>
    </header>
  )
}
