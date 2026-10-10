import { useCart } from '../context/CartContext'
import { useFly } from '../context/FlyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../lib/format'
import Icon from './Icon'
import './CartButton.css'

/** variant "pill" (desktop header) or "tab" (mobile tab bar). Both are fly-to-cart targets. */
export default function CartButton({ variant = 'pill' }) {
  const { count, subtotal, open } = useCart()
  const { cartTarget, arrivals } = useFly()
  const { t, lang } = useLanguage()

  return (
    <button
      type="button"
      ref={cartTarget}
      className={`cart-btn cart-btn--${variant}`}
      onClick={open}
      aria-label={t('nav.openCart', { count })}
      aria-haspopup="dialog"
    >
      <span className="cart-btn__icon" key={arrivals} data-bump={arrivals > 0 || undefined}>
        <Icon name="bag" size={variant === 'tab' ? 22 : 20} />
        {count > 0 && <span className="cart-btn__count">{count > 99 ? '99+' : count}</span>}
      </span>
      {variant === 'pill' ? (
        <span className="cart-btn__label">{count > 0 ? formatPrice(subtotal, lang) : t('nav.cart')}</span>
      ) : (
        <span className="tabbar__label">{t('nav.cart')}</span>
      )}
    </button>
  )
}
