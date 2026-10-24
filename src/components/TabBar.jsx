import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { BagIcon, ChatIcon, HomeIcon, InfoIcon, MenuBookIcon } from './Icons';
import './TabBar.css';

/** Phone navigation: thumb-reachable, with the cart in the middle. */
export default function TabBar() {
  const { count, openCart } = useCart();
  return (
    <nav className="tabbar" aria-label="Main">
      <NavLink to="/" end className="tabbar__item">
        <HomeIcon size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/menu" className="tabbar__item">
        <MenuBookIcon size={22} />
        <span>Menu</span>
      </NavLink>
      <button type="button" className="tabbar__cart" onClick={openCart} aria-label={`Open cart, ${count} items`}>
        <span className="tabbar__cart-btn" data-cart-target>
          <BagIcon size={24} />
          {count > 0 && (
            <span className="cart-badge" key={count}>
              {count}
            </span>
          )}
        </span>
      </button>
      <NavLink to="/about" className="tabbar__item">
        <InfoIcon size={22} />
        <span>About</span>
      </NavLink>
      <NavLink to="/contact" className="tabbar__item">
        <ChatIcon size={22} />
        <span>Contact</span>
      </NavLink>
    </nav>
  );
}
