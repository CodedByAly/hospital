import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../cart.jsx'

const LINKS = [
  ['#menu', 'Menu'],
  ['#wings', 'Open Wings'],
  ['#locations', 'Find us'],
]

export default function Nav({ onOpenCart }) {
  const { count } = useCart()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__brand" aria-label="Taktawook, back to top">
          <img src="/images/logo.png" alt="" width="42" height="42" />
          <span className="wordmark">
            Tak<br />Tawook
          </span>
        </a>

        <nav aria-label="Main" className="nav__links">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <button id="cart-button" className="bag-btn" onClick={onOpenCart} aria-label={`Your order, ${count} items`}>
          <ShoppingBag size={20} aria-hidden="true" />
          <span className="bag-btn__label">Order</span>
          {count > 0 && <span className="bag-btn__count">{count}</span>}
        </button>
      </div>
    </header>
  )
}
