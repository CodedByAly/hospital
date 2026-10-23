import { NavLink } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import CartButton from './CartButton'
import { ChatIcon, HomeIcon, InfoIcon, MenuBookIcon } from './Icons'

/** Phone navigation: thumb-reachable tabs with the cart in the middle. */
export default function TabBar() {
  const { t } = useLang()
  return (
    <nav className="tab-bar" aria-label={t('nav.main')}>
      <NavLink to="/" end className="tab-bar__item">
        <HomeIcon />
        <span>{t('nav.home')}</span>
      </NavLink>
      <NavLink to="/menu" className="tab-bar__item">
        <MenuBookIcon />
        <span>{t('nav.menu')}</span>
      </NavLink>
      <div className="tab-bar__cart">
        <CartButton />
      </div>
      <NavLink to="/about" className="tab-bar__item">
        <InfoIcon />
        <span>{t('nav.about')}</span>
      </NavLink>
      <NavLink to="/contact" className="tab-bar__item">
        <ChatIcon />
        <span>{t('nav.contact')}</span>
      </NavLink>
    </nav>
  )
}
