import { Link, useParams } from 'react-router-dom'
import { ordering, phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { getItem } from '../data/menu'
import { t } from '../content/text'
import { describeSelection, formatPrice } from '../lib/price'
import { load } from '../lib/storage'
import { orderWhatsAppUrl } from '../lib/order'
import Icon from '../components/Icon'
import './OrderConfirmation.css'

export default function OrderConfirmation() {
  const { number } = useParams()
  const order = load('moods:orders', {})[number]
  const address = restaurant.address

  if (!order) {
    return (
      <div className="confirm container">
        <div className="confirm__missing">
          <h1>{t('confirm.notFound')}</h1>
          <Link to="/menu" className="btn btn--dark">
            {t('confirm.newOrder')}
          </Link>
        </div>
      </div>
    )
  }

  const c = order.customer
  const firstName = c.name.split(' ')[0]
  const total = (
    <>
      <span className="num">{formatPrice(order.totalCents)}</span>
      {order.deliveryCents == null && <small> {t('cart.plusDelivery')}</small>}
    </>
  )

  return (
    <div className="confirm">
      <div className="container confirm__grid">
        <section className="confirm__main">
          <div className="confirm__mark" aria-hidden="true">
            <Icon name="check" size={34} />
          </div>
          <p className="kicker">{t('confirm.title')}</p>
          <h1>{t('confirm.sentTitle', { name: firstName })}</h1>
          <p className="confirm__lead">{t('confirm.lead')}</p>

          <div className="confirm__resend">
            <span>{t('confirm.notSent')}</span>
            <a href={orderWhatsAppUrl(order)} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              <Icon name="whatsapp" size={20} /> {t('confirm.resend')}
            </a>
          </div>

          <dl className="confirm__facts">
            <div>
              <dt>{t('confirm.number')}</dt>
              <dd className="num">{order.number}</dd>
            </div>
            <div>
              <dt>{t('confirm.type')}</dt>
              <dd>{t('confirm.typeValue')}</dd>
            </div>
            <div>
              <dt>{t('confirm.payment')}</dt>
              <dd>{order.payment === 'whish' ? t('checkout.whish') : t('checkout.cash')}</dd>
            </div>
            <div>
              <dt>{t('confirm.deliverTo')}</dt>
              <dd>
                {c.name} · <span className="num">{c.phone}</span>
                <br />
                {[c.area, c.street, c.building && `${t('checkout.building')} ${c.building}`, c.floor && `${t('checkout.floor')} ${c.floor}`, c.apartment && `${t('checkout.apartment')} ${c.apartment}`]
                  .filter(Boolean)
                  .join(', ')}
              </dd>
            </div>
          </dl>

          {order.payment === 'whish' && ordering.whish.number && (
            <p className="confirm__whish">
              <Icon name="phone" size={18} />
              {t('confirm.whishReminder', { total: formatPrice(order.totalCents), number: `+${ordering.whish.number}` })}
            </p>
          )}

          <div className="confirm__next">
            <h2>{t('confirm.next')}</h2>
            <p>{t('confirm.nextText')}</p>
          </div>
        </section>

        <aside className="confirm__side">
          <div className="confirm__receipt">
            <h2>{t('checkout.summary')}</h2>
            <ul>
              {order.lines.map((line) => {
                const item = getItem(line.itemId)
                if (!item) return null
                const { chosen, removed } = describeSelection(item, line.selection)
                return (
                  <li key={line.key}>
                    <span className="num confirm__qty">{line.qty}×</span>
                    <span className="confirm__item">
                      {item.name}
                      {chosen.length > 0 && <small>{chosen.join(' · ')}</small>}
                      {removed.length > 0 && (
                        <small className="is-removed">
                          {t('cart.without')} {removed.join(', ').toLowerCase()}
                        </small>
                      )}
                    </span>
                    <span className="num">{formatPrice(line.unitCents * line.qty)}</span>
                  </li>
                )
              })}
            </ul>
            <dl className="cart-totals">
              <div>
                <dt>{t('cart.subtotal')}</dt>
                <dd className="num">{formatPrice(order.subtotalCents)}</dd>
              </div>
              <div>
                <dt>{t('cart.delivery')}</dt>
                <dd>{order.deliveryCents == null ? t('cart.deliveryTbc') : <span className="num">{formatPrice(order.deliveryCents)}</span>}</dd>
              </div>
              <div className="cart-totals__total">
                <dt>{t('cart.total')}</dt>
                <dd>{total}</dd>
              </div>
            </dl>
          </div>

          <div className="confirm__help">
            <h2>{t('confirm.problem')}</h2>
            <p>
              Moods Burger · {address.area}
              <br />
              {address.street}
            </p>
            <div className="confirm__help-actions">
              <a href={whatsappLink(`Hi, about my order ${order.number}`)} target="_blank" rel="noopener noreferrer" className="btn btn--dark">
                <Icon name="whatsapp" size={18} /> {t('confirm.whatsapp')}
              </a>
              <a href={phoneLink} className="btn btn--ghost">
                <Icon name="phone" size={18} /> {t('confirm.call')}
              </a>
            </div>
          </div>

          <Link to="/menu" className="text-link confirm__back">
            {t('confirm.newOrder')}
          </Link>
        </aside>
      </div>
    </div>
  )
}
