import { NavLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import Icon from './Icon.jsx';
import { navLinks } from './Header.jsx';
import './MobileTabBar.css';

// Phone navigation: thumb-reachable tabs with the order button in the middle.
export default function MobileTabBar() {
  const { count, openCart } = useShop();
  const [home, menu, about, contact] = navLinks;

  const tab = (link) => (
    <NavLink key={link.to} to={link.to} end={link.end} className="tabbar__tab">
      <Icon name={link.icon} size={22} />
      <span>{link.label}</span>
    </NavLink>
  );

  return (
    <nav className="tabbar" aria-label="Main">
      {tab(home)}
      {tab(menu)}
      <button type="button" className="tabbar__order" onClick={openCart} aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`}>
        <span className="tabbar__order-icon" data-cart-target>
          <Icon name="bag" size={22} />
          {count > 0 && <span className="tabbar__badge" key={count}>{count}</span>}
        </span>
        <span>Order</span>
      </button>
      {tab(about)}
      {tab(contact)}
    </nav>
  );
}
