import { restaurant } from '../config/restaurant'
import { useLang } from '../i18n/LanguageContext'
import { formatPrice } from '../lib/format'

/** Subtotal / delivery / total. The delivery fee is shown only when configured. */
export default function CartTotals({ total, type }) {
  const { t, lang } = useLang()
  const fee = restaurant.ordering.deliveryFee
  const showDelivery = type === 'delivery'
  const grand = showDelivery && fee ? total + fee : total

  return (
    <dl className="totals">
      <div className="totals__row">
        <dt>{t('totals.subtotal')}</dt>
        <dd>{formatPrice(total, lang)}</dd>
      </div>
      {showDelivery && (
        <div className="totals__row">
          <dt>{t('totals.delivery')}</dt>
          <dd>{fee ? formatPrice(fee, lang) : <span className="muted">{t('totals.deliveryTbd')}</span>}</dd>
        </div>
      )}
      <div className="totals__row totals__row--grand">
        <dt>{t('totals.total')}</dt>
        <dd>{formatPrice(grand, lang)}</dd>
      </div>
    </dl>
  )
}
