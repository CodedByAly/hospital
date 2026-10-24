import { useEffect, useRef, useState } from 'react'
import { Lockup } from './Logo'
import OpenStatus from './OpenStatus'
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './Icons'
import { site, telLink, whatsappLink } from '../data/site'
import './Header.css'

export const navLinks = [
  { href: '#menu', label: 'Menu' },
  { href: '#about', label: 'About' },
  { href: '#visit', label: 'Visit' },
  { href: '#feedback', label: 'Feedback' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean)
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      // The section crossing the upper third of the screen is the one being read.
      const line = window.innerHeight / 3
      const inView = sections.filter((s) => s.getBoundingClientRect().top <= line).pop()
      setCurrent(inView && inView.getBoundingClientRect().bottom > line ? `#${inView.id}` : '')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile panel: lock scroll, close on Escape, keep focus inside while open.
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
        const focusables = [toggleRef.current, ...panelRef.current.querySelectorAll('a, button')]
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
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

  const instagram = site.social.find((s) => s.id === 'instagram')
  const close = () => setOpen(false)

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="header__bar wrap">
        <a href="#top" className="header__logo" aria-label={`${site.name}, back to top`} onClick={close}>
          <Lockup />
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
          <OpenStatus className="header__status" />
          {site.social.map((s) => (
            <a key={s.id} href={s.href} className="header__icon" target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on ${s.label}`}>
              {s.id === 'instagram' && <InstagramIcon />}
            </a>
          ))}
          <a href={site.maps} className="btn header__cta" target="_blank" rel="noopener noreferrer">
            Directions
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="mobile-panel"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="header__toggle-label">{open ? 'Close' : 'Index'}</span>
          <span className="header__toggle-lines" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div id="mobile-panel" ref={panelRef} className="panel">
        <nav className="panel__nav wrap" aria-label="Main, mobile">
          <ol>
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ '--i': i }}>
                <a href={l.href} onClick={close}>
                  <span className="panel__num">{String(i + 1).padStart(2, '0')}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="panel__foot wrap">
          <OpenStatus />
          <div className="panel__actions">
            <a href={telLink} className="panel__action">
              <PhoneIcon /> Call
            </a>
            {site.whatsapp && (
              <a href={whatsappLink()} className="panel__action" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            )}
            <a href={site.maps} className="panel__action" target="_blank" rel="noopener noreferrer">
              <PinIcon /> Directions
            </a>
            {instagram && (
              <a href={instagram.href} className="panel__action" target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> {instagram.handle}
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
