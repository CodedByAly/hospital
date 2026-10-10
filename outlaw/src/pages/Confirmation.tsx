import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { restaurant } from '../config/restaurant'
import { useMeta } from '../hooks/useMeta'
import { formatDateTime, formatPrice, formatTime } from '../lib/format'
import { findOrder, lineById, orderLink } from '../lib/order'
import './Confirmation.css'

export default function Confirmation() {
  const { number = '' } = useParams()
  const order = findOrder(number)
  useMeta({ title: `Order ${number} — Outlaw Sushi Bar`, path: `/order/${number}` })

  if (!order) {
    return (
      <div className="container page-top checkout-empty">
        <h1>We couldn't find that order.</h1>
        <p className="muted">Orders are kept on the device they were placed from.</p>
        <Link to="/menu" className="btn btn--ember">Open the menu</Link>
      </div>
    )
  }
  const d = order.details
  const line = lineById(d.lineId)

  return (
    <div className="container page-top confirm">
      <motion.div className="confirm__card" initial={{ opacity: 0, rotateX: 14, y: 30 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <p className="mark mark--ember">Order {order.number}</p>
        <h1>Thanks, {d.name.split(' ')[0]}.</h1>
        <p className="confirm__lead">Your order is written out in WhatsApp, addressed to {line.display}. <strong>It reaches {restaurant.name} once you press send there.</strong></p>
        <a href={orderLink(order)} target="_blank" rel="noopener noreferrer" className="btn btn--wasabi btn--lg">WhatsApp didn't open? Send it now</a>

        <dl className="confirm__facts">
          <div><dt>Type</dt><dd>{d.type === 'delivery' ? `Delivery to ${d.area}` : `Take away, ${d.pickupTime === 'asap' ? 'as soon as possible' : formatTime(new Date(d.pickupTime))}`}</dd></div>
          <div><dt>Payment</dt><dd>{d.payment === 'whish' ? `Whish Money to ${line.display}` : 'Cash'}</dd></div>
          <div><dt>Placed</dt><dd>{formatDateTime(new Date(order.placedAt))}</dd></div>
          <div><dt>Total</dt><dd className="price">{formatPrice(order.total)}{d.type === 'delivery' && order.deliveryFee == null ? ' + delivery' : ''}</dd></div>
        </dl>
        {d.payment === 'whish' && <p className="muted">Remember to send {formatPrice(order.total)} by Whish to {line.display}, with your name in the note.</p>}

        <ul className="confirm__lines">
          {order.lines.map((l, i) => (
            <li key={i}><span>{l.qty} × {l.name}</span><span className="price">{formatPrice(l.total)}</span></li>
          ))}
        </ul>
        <Link to="/menu" className="link-arrow">Start a new order</Link>
      </motion.div>
    </div>
  )
}
