import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { copy as t } from '../content/copy'
import { useCart } from '../store/cart'
import { restaurant } from '../config/restaurant'
import { SocialLinks } from './SocialLinks'
import { OpenStatus } from './OpenStatus'
import { Icon, type IconName } from './Icon'
import './Header.css'

const links = [
  { to: '/', label: t.nav.home, icon: 'home' },
  { to: '/menu', label: t.nav.menu, icon: 'menu' },
  { to: '/about', label: t.nav.about, icon: 'info' },
  { to: '/contact', label: t.nav.contact, icon: 'phone' },
] as const

function CartCount({ count }: { count: number }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {count > 0 && (
        <motion.span
          key={count}
          className="cart-count"
          initial={{ scale: 0.3, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 20 }}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export function Header() {
  const { count, open } = useCart()
  const { pathname } = useLocation()
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner container">
          <Link to="/" className="site-header__logo" aria-label={`${restaurant.name} home`}>
            <img src="/images/logo.webp" alt={restaurant.name} width="220" height="114" />
          </Link>

          <nav className="site-nav" aria-label="Main">
            <ul>
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'} className="site-nav__link">
                    {({ isActive }) => (
                      <>
                        <span>{l.label}</span>
                        {isActive && <motion.span layoutId="nav-mark" className="site-nav__mark" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
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
            <button type="button" className="header-cart" onClick={open} data-cart-target aria-label={`${t.nav.cart}, ${count} items`}>
              <Icon name="bag" />
              <span className="header-cart__label">{t.nav.cart}</span>
              <CartCount count={count} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile: thumb-reachable dock with the cart in the middle */}
      <nav className="dock" aria-label="Mobile">
        {links.slice(0, 2).map((l) => (
          <DockLink key={l.to} to={l.to} icon={l.icon} label={l.label} active={isActive(l.to)} />
        ))}
        <button type="button" className="dock__cart" onClick={open} data-cart-target aria-label={`${t.nav.cart}, ${count} items`}>
          <Icon name="bag" />
          <CartCount count={count} />
        </button>
        {links.slice(2).map((l) => (
          <DockLink key={l.to} to={l.to} icon={l.icon} label={l.label} active={isActive(l.to)} />
        ))}
      </nav>
    </>
  )
}

function DockLink({ to, icon, label, active }: { to: string; icon: IconName; label: string; active: boolean }) {
  return (
    <Link to={to} className={`dock__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
      {active && <motion.span layoutId="dock-pill" className="dock__pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
      <Icon name={icon} />
      <span className="dock__label">{label}</span>
    </Link>
  )
}
