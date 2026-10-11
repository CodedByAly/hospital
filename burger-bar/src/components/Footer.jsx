import { Link } from 'react-router-dom';
import { branches, site } from '../config/site.js';
import { formatPhone, mapsHref, telHref } from '../lib/format.js';
import HoursList from './HoursList.jsx';
import Logo from './Logo.jsx';
import Reveal from './Reveal.jsx';
import SocialLinks from './SocialLinks.jsx';
import { navLinks } from './Header.jsx';
import './Footer.css';

const branch = branches[0];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Reveal className="logo-spin-in">
            <Logo withText className="site-footer__logo" />
          </Reveal>
          <p>{site.tagline}.</p>
          <SocialLinks className="site-footer__social" withLabels />
        </div>

        <nav aria-label="Footer">
          <h2 className="site-footer__title">Explore</h2>
          <ul className="site-footer__list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">Find us</h2>
          <ul className="site-footer__list">
            <li>
              <a href={mapsHref(branch)} target="_blank" rel="noopener noreferrer">
                {branch.address}
              </a>
            </li>
            <li>
              <a href={telHref(branch.phone)}>{formatPhone(branch.phone)}</a>
            </li>
            <li className="site-footer__muted">Dine-in · Delivery · Takeaway</li>
          </ul>
        </div>

        <div>
          <h2 className="site-footer__title">Hours</h2>
          <HoursList className="site-footer__hours" />
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
        <p>{site.tagline}</p>
      </div>
    </footer>
  );
}
