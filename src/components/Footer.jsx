import { Link } from 'react-router-dom';
import { branches, site } from '../config/site.js';
import { formatPhone, telHref } from '../lib/format.js';
import Logo from './Logo.jsx';
import SocialLinks from './SocialLinks.jsx';
import { navLinks } from './Header.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo variant="full" className="site-footer__logo" />
          <p>
            Burgers, crispy chicken, subs and charcoal grills. Serving Tyre, Hamra and Batroun since {site.since}.
          </p>
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
          <h2 className="site-footer__title">Branches</h2>
          <ul className="site-footer__list site-footer__branches">
            {branches.map((branch) => (
              <li key={branch.id}>
                <span>{branch.name}</span>
                <a href={telHref(branch.phone)}>{formatPhone(branch.phone)}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__title">Get in touch</h2>
          <ul className="site-footer__list">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <Link to="/contact#feedback">Send us feedback</Link>
            </li>
            {branches.every((b) => !b.hours.length) && <li className="site-footer__muted">Opening hours: call your branch</li>}
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
        <p>{site.tagline}</p>
      </div>
    </footer>
  );
}
