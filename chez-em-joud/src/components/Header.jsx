import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import CartButton from './CartButton'
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from './Icons'
import { site, telLink, whatsappLink } from '../data/site'
import './Header.css'

export const navLinks = [
  { href: '#top', label: 'Home' },
  { href: '#menu', label: 'Menu' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('#top')
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean)
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const line = window.innerHeight / 3
      const inView = sections.filter((s) => s.getBoundingClientRect().top <= line).pop()
      setCurrent(inView ? `#${inView.id}` : '#top')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.classList.add('is-locked')
    panelRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = [toggleRef.current, ...panelRef.current.querySelectorAll('a, button')]
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    const onResize = () => window.innerWidth >= 960 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.classList.remove('is-locked')
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="header__bar wrap">
        <a href="#top" className="header__logo" aria-label={`${site.name}, home`} onClick={close}>
          <Logo />
        </a>

        <nav className="header__nav" aria-label="Main">
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-current={current === l.href ? 'true' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__aside">
          {site.social.map((s) => (
            <a
              key={s.id}
              href={s.href}
              className="header__icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${site.name} on ${s.label}`}
            >
              <InstagramIcon />
            </a>
          ))}
          {site.whatsapp && (
            <a
              href={whatsappLink()}
              className="header__icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Message ${site.name} on WhatsApp`}
            >
              <WhatsAppIcon />
            </a>
          )}
        </div>

        <CartButton showTotal />

        <button
          ref={toggleRef}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-panel"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="header__toggle-lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div id="mobile-panel" ref={panelRef} className="panel">
        <nav className="panel__nav wrap" aria-label="Main, mobile">
          <ul>
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ '--i': i }}>
                <a href={l.href} onClick={close}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="panel__foot wrap">
          <p className="panel__tagline">{site.tagline}</p>
          <div className="panel__actions">
            {site.whatsapp && (
              <a href={whatsappLink()} className="btn btn--olive" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            )}
            <a href={telLink} className="btn btn--ghost">
              <PhoneIcon /> Call
            </a>
            {site.social.map((s) => (
              <a key={s.id} href={s.href} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> {s.handle}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
