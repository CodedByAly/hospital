import { Link } from 'react-router-dom'
import Instagram from './InstagramIcon'
import { lines, restaurant, whatsappLink } from '../config/restaurant'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container foot__grid">
        <div className="foot__brand">
          <Logo size={64} />
          <p>{restaurant.kind} · {restaurant.services.join(' · ')}</p>
        </div>
        <div>
          <p className="mark">Find us</p>
          <p>{restaurant.address}</p>
          <Link to="/visit" className="link-arrow">Directions &amp; hours</Link>
        </div>
        <div>
          <p className="mark">WhatsApp</p>
          <ul>
            {lines.map((l) => (
              <li key={l.id}><a href={whatsappLink(l)} target="_blank" rel="noopener noreferrer">{l.display}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mark">Follow</p>
          <a href={restaurant.instagram.url} target="_blank" rel="noopener noreferrer" className="foot__ig">
            <Instagram size={18} /> {restaurant.instagram.handle}
          </a>
        </div>
      </div>
      <div className="container foot__base">
        <p>© {new Date().getFullYear()} {restaurant.name}</p>
        <Link to="/menu">Full menu</Link>
      </div>
    </footer>
  )
}
