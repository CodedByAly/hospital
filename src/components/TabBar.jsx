import { NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import CartButton from './CartButton';
import Icon from './Icon';

const TABS = [
  { key: 'home', to: '/', icon: 'home' },
  { key: 'menu', to: '/menu', icon: 'menu' },
  { key: 'about', to: '/about', icon: 'info' },
  { key: 'contact', to: '/contact', icon: 'chat' },
];

/** Thumb-reach navigation for phones, with the cart always one tap away. */
export default function TabBar() {
  const { t } = useLanguage();
  return (
    <nav className="tabbar" aria-label={t.nav.main}>
      {TABS.map((tab) => (
        <NavLink key={tab.key} to={tab.to} end={tab.key === 'home'} className="tabbar__item">
          <span className="tabbar__icon">
            <Icon name={tab.icon} />
          </span>
          <span className="tabbar__label">{t.nav[tab.key]}</span>
        </NavLink>
      ))}
      <CartButton variant="tab" />
    </nav>
  );
}
