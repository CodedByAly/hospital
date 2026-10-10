import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { restaurant, whatsappLink } from '../config/restaurant'
import { imageUrl } from '../data/menu'
import { useLanguage } from '../context/LanguageContext'
import { useMeta } from '../hooks/useMeta'
import { formatDateTime, formatPrice } from '../lib/format'
import { getOrder, orderTypeLabel, orderWhatsappLink, paymentLabel, pickupTimeLabel } from '../lib/order'
import FoodImage from '../components/FoodImage'
import Icon from '../components/Icon'
import WhishPanel from '../components/WhishPanel'
import './Confirmation.css'

export default function Confirmation() {
  const { number } = useParams()
  const { state } = useLocation()
  const { t, pick, lang } = useLanguage()
  const order = getOrder(number)
  useMeta({ title: t('meta.orderTitle'), path: `/order/${number}` })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!order) {
    return (
      <div className="container confirm confirm--missing">
        <h1 className="page-title">{t('confirmation.notFound')}</h1>
        <Link to="/menu" className="btn btn--primary">{t('cart.browse')}</Link>
      </div>
    )
  }

  const c = order.customer
  const expect = {
    dineIn: t('confirmation.expectDineIn', { table: c.table }),
    pickup: t('confirmation.expectPickup', {
      time: c.time === 'asap' ? t('confirmation.expectPickupAsap') : t('confirmation.at', { time: c.time }),
    }),
    delivery: t('confirmation.expectDelivery', { area: c.area }),
  }[order.type]

  return (
    <div className="container confirm">
      <header className="confirm__head">
        <span className="confirm__check" aria-hidden="true"><Icon name="check" size={30} /></span>
        <p className="eyebrow">{t('confirmation.eyebrow', { number: order.number })}</p>
        <h1 className="page-title">{t('confirmation.title', { name: c.name.split(' ')[0] })}</h1>
        <p className="confirm__lead">{t('confirmation.lead')}</p>
        <div className="confirm__send">
          <a className="btn btn--whatsapp btn--lg" href={orderWhatsappLink(order)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} /> {state?.justPlaced ? t('confirmation.resend') : t('confirmation.send')}
          </a>
          <p className="field-hint">{t('confirmation.sent')}</p>
        </div>
      </header>

      <div className="confirm__grid">
        <section className="confirm__card" aria-labelledby="receipt-title">
          <h2 id="receipt-title" className="visually-hidden">{t('checkout.summary')}</h2>
          <dl className="confirm__facts">
            <div><dt>{t('confirmation.number')}</dt><dd dir="ltr">{order.number}</dd></div>
            <div><dt>{t('confirmation.type')}</dt><dd>{orderTypeLabel(order.type, t)}</dd></div>
            <div><dt>{t('checkout.name')}</dt><dd>{c.name}</dd></div>
            <div><dt>{t('checkout.phone')}</dt><dd dir="ltr">{c.phone}</dd></div>
            {order.type === 'pickup' && <div><dt>{t('checkout.pickupTime')}</dt><dd>{pickupTimeLabel(c.time, t)}</dd></div>}
            {order.type === 'dineIn' && <div><dt>{t('checkout.table')}</dt><dd>{c.table}</dd></div>}
            {order.type === 'delivery' && (
              <div><dt>{t('checkout.address')}</dt><dd>{[c.area, c.address, c.building].filter(Boolean).join(lang === 'ar' ? '، ' : ', ')}</dd></div>
            )}
            <div><dt>{t('confirmation.payment')}</dt><dd>{paymentLabel(order, t)}</dd></div>
            <div><dt>{t('confirmation.placed')}</dt><dd>{formatDateTime(new Date(order.createdAt), lang)}</dd></div>
          </dl>

          <ul className="summary-lines">
            {order.lines.map((l, i) => (
              <li key={i}>
                <FoodImage src={imageUrl(l.image)} alt="" className="summary-lines__img" />
                <div>
                  <p className="summary-lines__name"><span className="summary-lines__qty">{l.qty}×</span> {pick(l.name)}</p>
                  {l.details.length > 0 && <p className="line-details">{l.details.join(' · ')}</p>}
                  {l.notes && <p className="line-details line-details--note">{t('cart.note')}: “{l.notes}”</p>}
                </div>
                <span className="summary-lines__price">{formatPrice(l.total, lang)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>{t('cart.subtotal')}</dt><dd>{formatPrice(order.subtotal, lang)}</dd></div>
            {order.type === 'delivery' && (
              <div className="totals__muted">
                <dt>{t('cart.delivery')}</dt>
                <dd>{order.deliveryFee == null ? t('cart.deliveryLater') : formatPrice(order.deliveryFee, lang)}</dd>
              </div>
            )}
            <div className="totals__grand"><dt>{t('cart.total')}</dt><dd>{formatPrice(order.total, lang)}</dd></div>
          </dl>
        </section>

        <aside className="confirm__side">
          <div className="confirm__panel confirm__panel--accent">
            <Icon name={order.type === 'delivery' ? 'scooter' : order.type === 'pickup' ? 'walk' : 'table'} size={24} />
            <p>{expect}</p>
          </div>
          {order.payment === 'whish' && (
            <div className="confirm__panel">
              <p className="confirm__panel-title">{t('checkout.whish')}</p>
              <WhishPanel total={order.total} />
            </div>
          )}
          <div className="confirm__panel">
            <p className="confirm__panel-title">{t('confirmation.problem')}</p>
            <p className="muted">{t('confirmation.problemHint', { number: order.number })}</p>
            <div className="confirm__contact">
              <a className="btn btn--whatsapp btn--sm" href={whatsappLink(`${order.number}: `)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={18} /> {t('common.whatsapp')}
              </a>
              <a className="btn btn--outline btn--sm" href={`tel:${restaurant.phone}`}>
                <Icon name="phone" size={16} /> <span dir="ltr">{restaurant.phoneDisplay}</span>
              </a>
            </div>
            <p className="confirm__address">
              <Icon name="pin" size={16} />
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">{pick(restaurant.address)}</a>
            </p>
          </div>
          <Link to="/menu" className="btn btn--outline btn--block">{t('confirmation.newOrder')}</Link>
        </aside>
      </div>
    </div>
  )
}
