import { useEffect, useState } from 'react'
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../cart.jsx'
import OpenBadge from './OpenBadge.jsx'

const LINKS = [
  ['#menu', 'Menu'],
  ['#offers', 'Offers'],
  ['#story', 'Our Story'],
  ['#locations', 'Locations'],
]

export default function Nav({ onOpenCart }) {
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label="Taktawook home">
          <img src="/images/logo.png" alt="" width="44" height="44" />
          <span className="nav__word">
            <span>Tak</span>tawook
          </span>
        </a>

        <nav aria-label="Main" className={`nav__links ${open ? 'is-open' : ''}`} id="main-nav">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <OpenBadge className="nav__open" />
          <button id="cart-button" className="cart-btn" onClick={onOpenCart} aria-label={`Open your bag, ${count} items`}>
            <ShoppingBag size={22} aria-hidden="true" />
            {count > 0 && (
              <span className="cart-btn__count" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
          <button
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <MenuIcon size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
