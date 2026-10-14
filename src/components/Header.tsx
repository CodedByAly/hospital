import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageProvider'
import { useCart } from '../store/cart'
import { restaurant } from '../config/restaurant'
import { num } from '../utils/format'
import { SocialLinks } from './SocialLinks'
import { OpenStatus } from './OpenStatus'
import { Icon, type IconName } from './Icon'
import './Header.css'

const links = [
  { to: '/', key: 'home', icon: 'home' },
  { to: '/menu', key: 'menu', icon: 'menu' },
  { to: '/about', key: 'about', icon: 'info' },
  { to: '/contact', key: 'contact', icon: 'phone' },
] as const

function CartCount({ count }: { count: number }) {
  const { lang } = useLang()
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {count > 0 && (
        <motion.span
          key={count}
          className="cart-count"
          initial={{ scale: 0.4, opacity: 0, y: -6 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.4, opacity: 0, y: 6 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        >
          {num(count, lang)}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const { t, toggle } = useLang()
  const { count, open } = useCart()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner container">
          <Link to="/" className="site-header__logo" aria-label={`${restaurant.name} — ${t.nav.home}`}>
            <img src="/images/logo-on-dark.webp" alt={restaurant.name} width="220" height="114" />
          </Link>

          <nav className="site-nav" aria-label="Main">
            <ul>
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'} className="site-nav__link">
                    {({ isActive }) => (
                      <>
                        {t.nav[l.key]}
                        {isActive && <motion.span layoutId="nav-underline" className="site-nav__underline" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__tools">
            <OpenStatus className="site-header__status" />
            <SocialLinks className="site-header__socials" />
            <button type="button" className="lang-switch" onClick={toggle} aria-label={t.nav.languageLabel}>
              <Icon name="globe" />
              <span>{t.nav.language}</span>
            </button>
            <button type="button" className="header-cart" onClick={open} data-cart-target aria-label={`${t.nav.cart} (${count})`}>
              <Icon name="bag" />
              <span className="header-cart__label">{t.nav.cart}</span>
              <CartCount count={count} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dock — thumb-reachable navigation with the cart in the middle */}
      <nav className="dock" aria-label="Mobile">
        {links.slice(0, 2).map((l) => (
          <DockLink key={l.to} to={l.to} icon={l.icon} label={t.nav[l.key]} active={l.to === '/' ? pathname === '/' : pathname.startsWith(l.to)} />
        ))}
        <button type="button" className="dock__cart" onClick={open} data-cart-target aria-label={`${t.nav.cart} (${count})`}>
          <Icon name="bag" />
          <CartCount count={count} />
        </button>
        {links.slice(2).map((l) => (
          <DockLink key={l.to} to={l.to} icon={l.icon} label={t.nav[l.key]} active={pathname.startsWith(l.to)} />
        ))}
      </nav>
    </>
  )
}

function DockLink({ to, icon, label, active }: { to: string; icon: IconName; label: string; active: boolean }) {
  return (
    <Link to={to} className={`dock__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
      {active && <motion.span layoutId="dock-pill" className="dock__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
      <Icon name={icon} />
      <span>{label}</span>
    </Link>
  )
}
