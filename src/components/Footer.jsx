import { Link } from 'react-router-dom'
import { phoneLink, restaurant } from '../config/restaurant'
import { NAV } from './Header'
import Logo from './Logo'
import SocialLinks from './SocialLinks'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo size={72} />
          <p className="site-footer__name">{restaurant.name}</p>
          <p className="site-footer__desc">{restaurant.description}</p>
          <SocialLinks className="site-footer__social" />
        </div>

        <nav aria-label="روابط الموقع">
          <h2 className="site-footer__heading">الموقع</h2>
          <ul className="site-footer__list">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/checkout">إتمام الطلب</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__heading">تواصل</h2>
          <ul className="site-footer__list">
            <li>
              <a href={phoneLink} dir="ltr">
                {restaurant.phone.display}
              </a>
            </li>
            <li>
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {restaurant.address || 'موقعنا على الخريطة'}
              </a>
            </li>
            <li>
              <a href={restaurant.social.instagram.url} target="_blank" rel="noopener noreferrer" dir="ltr">
                @{restaurant.social.instagram.handle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">الدوام</h2>
          <p className="site-footer__hours">{restaurant.hoursLabel}</p>
          <p className="muted-light">توصيل واستلام من المحل</p>
        </div>
      </div>

      <div className="container site-footer__base">
        <p>
          © {new Date().getFullYear()} {restaurant.name}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  )
}
