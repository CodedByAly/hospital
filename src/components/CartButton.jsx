import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { useI18n } from '../i18n/I18nProvider'
import { formatPrice } from '../lib/price'
import Icon from './Icon'

export default function CartButton({ variant = 'full' }) {
  const { count, subtotalCents } = useCart()
  const { openCart } = useUI()
  const { t } = useI18n()

  return (
    <button
      type="button"
      className={`cart-btn cart-btn--${variant} ${count ? '' : 'is-empty'}`}
      onClick={openCart}
      data-cart-target
      aria-label={`${t('nav.cart')}, ${count === 1 ? t('cart.oneItem') : t('cart.items', { count })}`}
    >
      <span className="cart-btn__icon">
        <Icon name="bag" size={22} />
        {count > 0 && (
          <span className="cart-btn__count num" key={count}>
            {count}
          </span>
        )}
      </span>
      {variant === 'full' && (
        <span className="cart-btn__label">
          {count > 0 ? <span className="num">{formatPrice(subtotalCents)}</span> : t('nav.cart')}
        </span>
      )}
    </button>
  )
}
