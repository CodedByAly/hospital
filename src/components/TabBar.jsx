import { NavLink } from 'react-router-dom'
import CartButton from './CartButton'
import { ChatIcon, HomeIcon, InfoIcon, MenuBookIcon } from './Icons'

/** Phone navigation: thumb-reachable tabs with the cart in the middle. */
export default function TabBar() {
  return (
    <nav className="tab-bar" aria-label="التنقل">
      <NavLink to="/" end className="tab-bar__item">
        <HomeIcon />
        <span>الرئيسية</span>
      </NavLink>
      <NavLink to="/menu" className="tab-bar__item">
        <MenuBookIcon />
        <span>المنيو</span>
      </NavLink>
      <div className="tab-bar__cart">
        <CartButton />
      </div>
      <NavLink to="/about" className="tab-bar__item">
        <InfoIcon />
        <span>من نحن</span>
      </NavLink>
      <NavLink to="/contact" className="tab-bar__item">
        <ChatIcon />
        <span>تواصل</span>
      </NavLink>
    </nav>
  )
}
