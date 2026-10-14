import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { copy as t } from '../content/copy'
import { fmt } from '../utils/format'
import { lastOrder } from '../services/orders'
import { restaurant, whatsappLink, phoneLink, mapsLink } from '../config/restaurant'
import { clock, money, lbp, num } from '../utils/format'
import { usePageMeta } from '../hooks/usePageMeta'
import { Icon } from '../components/Icon'
import './Confirmation.css'

export default function Confirmation() {
  const { number } = useParams()
  const reduce = useReducedMotion()
  usePageMeta(t.confirm.title)
  const order = lastOrder()

  if (!order || order.number !== number) {
    return (
      <div className="container confirm-missing">
        <h1>{t.confirm.missing}</h1>
        <Link to="/menu" className="btn btn--yellow">{t.cart.browse}</Link>
      </div>
    )
  }

  const payment = order.payment === 'whish' ? t.checkout.whish : order.type === 'pickup' ? t.checkout.cashPickup : t.checkout.cashDelivery
  const eta =
    order.type === 'pickup'
      ? order.pickupTime === 'asap'
        ? t.confirm.asapPickup
        : fmt(t.confirm.etaPickup, { t: clock(order.pickupTime) })
      : t.confirm.etaDelivery
  const approx = lbp(order.total)

  return (
    <div className="confirm">
      <div className="container confirm__wrap">
        <motion.div
          className="ticket"
          initial={reduce ? false : { opacity: 0, rotateX: -35, y: 60 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 140 }}
        >
          <div className="ticket__head">
            <motion.span
              className="ticket__check"
              initial={reduce ? false : { scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 360, damping: 16 }}
            >
              <Icon name="check" />
            </motion.span>
            <h1>{t.confirm.title}</h1>
            <p>{fmt(t.confirm.sub, { name: order.name })}</p>
            <a className="btn btn--wa" href={order.whatsappUrl} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> {t.confirm.resend}
            </a>
          </div>

          <div className="ticket__tear" aria-hidden="true" />

          <dl className="ticket__facts">
            <div><dt>{t.confirm.number}</dt><dd>{order.number}</dd></div>
            <div><dt>{t.confirm.type}</dt><dd>{order.type === 'pickup' ? t.order.pickup : t.order.delivery}</dd></div>
            <div><dt>{t.confirm.payment}</dt><dd>{payment}</dd></div>
            <div><dt>{t.confirm.eta}</dt><dd>{eta}</dd></div>
          </dl>

          <div className="ticket__items">
            <h2>{t.confirm.items}</h2>
            <ul>
              {order.lines.map((line, i) => (
                <li key={i}>
                  <div>
                    <p><strong>{num(line.qty)}×</strong> {line.name}</p>
                    {line.options.length > 0 && <small>{line.options.join(' · ')}</small>}
                    {line.removed.length > 0 && <small>{t.cart.without}: {line.removed.join(', ')}</small>}
                  </div>
                  <span className="price">{money(line.total)}</span>
                </li>
              ))}
            </ul>
            <dl className="totals">
              <div><dt>{t.cart.subtotal}</dt><dd className="price">{money(order.subtotal)}</dd></div>
              {order.type === 'delivery' && (
                <div className="totals__muted"><dt>{t.cart.delivery}</dt><dd>{order.deliveryFee != null ? money(order.deliveryFee) : t.cart.deliveryTbd}</dd></div>
              )}
              <div className="totals__grand"><dt>{t.cart.total}</dt><dd className="price">{money(order.total)}</dd></div>
              {approx && <p className="totals__lbp">{fmt(t.cart.approxLbp, { v: approx, r: num(restaurant.payments.lbpRate!) })}</p>}
            </dl>
          </div>

          <div className="ticket__foot">
            <p className="ticket__resto">
              <strong>{restaurant.name}</strong>
              <a href={mapsLink} target="_blank" rel="noreferrer">{restaurant.address}</a>
              <a href={phoneLink}>{restaurant.phoneDisplay}</a>
            </p>
            <p className="ticket__problem">{t.confirm.problem}</p>
            <div className="ticket__actions">
              <a className="btn btn--sm" href={phoneLink}><Icon name="phone" /> {t.confirm.call}</a>
              <a className="btn btn--sm btn--wa" href={whatsappLink(`Hi, about my order ${order.number}:`)} target="_blank" rel="noreferrer"><Icon name="whatsapp" /> {t.confirm.whatsapp}</a>
            </div>
          </div>
        </motion.div>

        <Link to="/menu" className="confirm__new">{t.confirm.newOrder} <Icon name="arrow" /></Link>
      </div>
    </div>
  )
}
