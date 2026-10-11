import { useEffect, useRef, useState } from 'react';
import Logo from './Logo.jsx';
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from './Icons.jsx';
import { restaurant, whatsappLink, fullAddress } from '../data/restaurant.js';

export const NAV = [
  { href: '#menu', label: 'Menu' },
  { href: '#about', label: 'About' },
  { href: '#visit', label: 'Visit' },
  { href: '#feedback', label: 'Feedback' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const phone = restaurant.phones[0];

  // Solid background once the page moves; tuck away while scrolling down, return on the way up.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 420);
          last = y;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add('is-locked');
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.header = hidden && !open ? 'hidden' : 'shown';
  }, [hidden, open]);

  const cls = ['site-header', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={cls}>
      <div className="site-header__bar container">
        <a href="#top" className="site-header__brand" aria-label="Sukun Coffee Shop, back to top">
          <Logo />
        </a>

        <nav className="site-nav" aria-label="Main">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a
            className="icon-link"
            href={restaurant.social.instagram.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Sukun on Instagram"
          >
            <InstagramIcon />
          </a>
          <a className="icon-link" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Message Sukun on WhatsApp">
            <WhatsAppIcon />
          </a>
          <a className="btn btn--small btn--solid site-header__call" href={`tel:${phone.tel}`}>
            <PhoneIcon width={16} height={16} />
            <span>Call</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
            <span className="menu-toggle__lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-panel"
        ref={panelRef}
        className="mobile-panel"
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="mobile-panel__nav" aria-label="Mobile">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              style={{ '--i': i }}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-panel__num">0{i + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-panel__foot" style={{ '--i': NAV.length }}>
          <p>{fullAddress()}</p>
          <div className="mobile-panel__links">
            <a href={`tel:${phone.tel}`}>
              <PhoneIcon width={18} height={18} /> {phone.display}
            </a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              <WhatsAppIcon width={18} height={18} /> WhatsApp
            </a>
            <a href={restaurant.social.instagram.url} target="_blank" rel="noreferrer">
              <InstagramIcon width={18} height={18} /> {restaurant.social.instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
