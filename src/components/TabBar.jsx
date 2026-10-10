import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import CartButton from './CartButton'
import Icon from './Icon'
import { NAV } from './Header'
import './TabBar.css'

/** Phone navigation: thumb-reachable tab bar with the cart in the middle. */
export default function TabBar() {
  const { t } = useLanguage()
  const [home, menu, about, contact] = NAV
  const tab = (item) => (
    <NavLink to={item.to} end={item.end} className="tabbar__link">
      <Icon name={item.icon} size={22} />
      <span className="tabbar__label">{t(`nav.${item.key}`)}</span>
    </NavLink>
  )
  return (
    <nav className="tabbar" aria-label={t('nav.primary')}>
      {tab(home)}
      {tab(menu)}
      <CartButton variant="tab" />
      {tab(about)}
      {tab(contact)}
    </nav>
  )
}
