import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import Logo from './Logo'
import SocialLinks from './SocialLinks'
import LanguageSwitch from './LanguageSwitch'
import CartButton from './CartButton'
import Icon from './Icon'
import './Header.css'

export const navItems = [
  { to: '/', key: 'home', icon: 'home', end: true },
  { to: '/menu', key: 'menu', icon: 'menu' },
  { to: '/about', key: 'about', icon: 'info' },
  { to: '/contact', key: 'contact', icon: 'chat' },
]

export default function Header() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <div className="site-header__brand">
          <Logo size={44} />
          <span className="site-header__name" aria-hidden="true">
            Moods <em>Burger</em>
          </span>
        </div>

        <nav className="site-nav" aria-label={t('nav.primary')}>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink to={item.to} end={item.end} className="site-nav__link">
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <SocialLinks className="site-header__social" size={19} />
          <span className="site-header__divider" aria-hidden="true" />
          <div className="site-header__lang">
            <LanguageSwitch />
          </div>
          <div className="site-header__lang-compact">
            <LanguageSwitch compact />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  )
}

export function TabBar() {
  const { t } = useI18n()
  return (
    <nav className="tab-bar" aria-label={t('nav.primary')}>
      {navItems.map((item) => (
        <NavLink key={item.key} to={item.to} end={item.end} className="tab-bar__link">
          <Icon name={item.icon} size={22} />
          <span>{t(`nav.${item.key}`)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
