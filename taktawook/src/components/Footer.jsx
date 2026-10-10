import { Mail, MessageCircle } from 'lucide-react'
import { EMAIL, INSTAGRAM, WHATSAPP } from '../data/menu.js'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/images/logo.png" alt="" width="72" height="72" />
          <p>
            Experience the original Lebanese taste.
            <br />
            Open daily from 11:30 AM until midnight.
          </p>
        </div>
        <nav aria-label="Footer" className="footer__links">
          <a href="#menu">Menu</a>
          <a href="#offers">Offers</a>
          <a href="#story">Our Story</a>
          <a href="#locations">Locations</a>
        </nav>
        <div className="footer__social">
          <a href={INSTAGRAM} target="_blank" rel="noreferrer">
            <InstagramIcon /> @taktawook
          </a>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
            <MessageCircle size={20} aria-hidden="true" /> +961 3 131 140
          </a>
          <a href={`mailto:${EMAIL}`}>
            <Mail size={20} aria-hidden="true" /> {EMAIL}
          </a>
        </div>
      </div>
      <p className="footer__giant" aria-hidden="true">
        Sauce. Bite. Repeat.
      </p>
      <p className="footer__copy container">© {new Date().getFullYear()} Taktawook. All rights reserved.</p>
    </footer>
  )
}
