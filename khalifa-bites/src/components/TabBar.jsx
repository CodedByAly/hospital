import { NavLink } from 'react-router-dom';
import CartButton from './CartButton';
import Icon from './Icon';

const Tab = ({ to, icon, label, end }) => (
  <NavLink to={to} end={end} className="tabbar__item">
    <span className="tabbar__icon">
      <Icon name={icon} />
    </span>
    <span className="tabbar__label">{label}</span>
  </NavLink>
);

/** Phone navigation: thumb-reach tabs with the cart raised in the middle. */
export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      <Tab to="/" end icon="home" label="Home" />
      <Tab to="/menu" icon="menu" label="Menu" />
      <CartButton variant="tab" />
      <Tab to="/about" icon="info" label="About" />
      <Tab to="/contact" icon="chat" label="Contact" />
    </nav>
  );
}
