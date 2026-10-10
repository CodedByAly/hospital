import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'

/** Opens the order drawer; also the landing spot for the fly-to-cart animation. */
export default function CartButton({ variant = 'bar' }: { variant?: 'bar' | 'dock' }) {
  const { count, subtotal, setDrawerOpen, cartTarget, bump } = useCart()
  return (
    <button
      ref={cartTarget}
      type="button"
      className={`cart-btn cart-btn--${variant}`}
      onClick={() => setDrawerOpen(true)}
      aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <motion.span key={bump} className="cart-btn__icon" initial={bump ? { scale: 1.35, rotate: -10 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}>
        <ShoppingBag size={19} strokeWidth={1.8} aria-hidden="true" />
        {count > 0 && <span className="cart-btn__count">{count}</span>}
      </motion.span>
      <span className="cart-btn__label">{count > 0 ? formatPrice(subtotal) : 'Order'}</span>
    </button>
  )
}
