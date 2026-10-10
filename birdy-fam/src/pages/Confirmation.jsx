import { useEffect } from 'react'
import { restaurant, formatPhone } from '../data/restaurant.js'
import Icon from '../components/Icon.jsx'
import { formatPrice } from '../lib/format.js'
import { hoursLabel } from '../lib/hours.js'
import { orderMessage } from '../lib/order.js'
import { goToSection } from '../lib/router.js'
import { load } from '../lib/storage.js'
import { telUrl, whatsappUrl } from '../lib/whatsapp.js'
import { LAST_ORDER_KEY } from './Checkout.jsx'

export default function Confirmation() {
  const order = load(LAST_ORDER_KEY, null)

  useEffect(() => {
    document.title = `Order sent | ${restaurant.name}`
  }, [])

  if (!order) {
    return (
      <main id="main" className="page confirm confirm--missing container">
        <h1 className="page-title">No recent order</h1>
        <p className="muted">We couldn't find an order on this device. If you already sent one, it's safe in your WhatsApp chat with us.</p>
        <div className="confirm__actions">
          <button type="button" className="btn btn--primary" onClick={() => goToSection('menu')}>Go to the menu</button>
          <a className="btn btn--outline" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
        </div>
      </main>
    )
  }

  const isPickup = order.type === 'pickup'
  const placed = new Date(order.createdAt)
  const feeUnknown = order.type === 'delivery' && order.deliveryFee == null
  const problemText = `Hi Birdy Fam, about my order ${order.number}: `

  return (
    <main id="main" className="page confirm">
      <div className="container confirm__wrap">
        <header className="confirm__head">
          <span className="confirm__badge" aria-hidden="true"><Icon name="check" size={30} strokeWidth={2.6} /></span>
          <p className="eyebrow">Order {order.number}</p>
          <h1 className="page-title">Thanks, {order.customer.name.split(' ')[0]}</h1>
          <p className="confirm__lead">
            Your order is written up in WhatsApp. Make sure you hit <strong>send</strong>. The {order.branch.name} branch confirms your order there
            {isPickup ? ' and lets you know when it is ready.' : ', along with the delivery fee and timing.'}
          </p>
          <a className="btn btn--whatsapp btn--lg" href={whatsappUrl(orderMessage(order))} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} /> WhatsApp didn't open? Send it again
          </a>
        </header>

        <div className="confirm__grid">
          <section className="confirm__card" aria-labelledby="c-details">
            <h2 id="c-details" className="confirm__card-title">Details</h2>
            <dl className="kv">
              <div><dt>Order number</dt><dd>{order.number}</dd></div>
              <div><dt>Name</dt><dd>{order.customer.name}</dd></div>
              <div><dt>Phone</dt><dd>{formatPhone(order.customer.phone)}</dd></div>
              <div><dt>Order type</dt><dd>{isPickup ? 'Pickup' : 'Delivery'}</dd></div>
              <div><dt>Branch</dt><dd><a href={order.branch.mapsUrl} target="_blank" rel="noopener noreferrer">{order.branch.name}</a></dd></div>
              <div>
                <dt>{isPickup ? 'Pickup time' : 'Deliver to'}</dt>
                <dd>
                  {isPickup
                    ? order.when.charAt(0).toUpperCase() + order.when.slice(1)
                    : [order.customer.address, order.customer.building, order.customer.area].filter(Boolean).join(', ')}
                </dd>
              </div>
              {!isPickup && <div><dt>Delivery time</dt><dd>Confirmed by the branch on WhatsApp</dd></div>}
              <div><dt>Payment</dt><dd>{order.paymentLabel}</dd></div>
              <div><dt>Placed</dt><dd>{placed.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</dd></div>
              {order.notes && <div><dt>Notes</dt><dd>{order.notes}</dd></div>}
            </dl>
            {order.payment === 'whish' && (
              <p className="confirm__whish">
                <Icon name="wallet" size={18} />
                <span>
                  Whish: transfer {feeUnknown ? 'the confirmed total' : formatPrice(order.total)} to <strong>{formatPhone(restaurant.whishNumber)}</strong> and
                  share the screenshot in the same chat.
                </span>
              </p>
            )}
          </section>

          <section className="confirm__card" aria-labelledby="c-items">
            <h2 id="c-items" className="confirm__card-title">Your order</h2>
            <ul className="confirm__items">
              {order.items.map((i, idx) => (
                <li key={idx}>
                  <span className="confirm__qty">{i.qty}x</span>
                  <span className="confirm__item">
                    {i.name}
                    {i.details.length > 0 && <span className="confirm__details">{i.details.join(' · ')}</span>}
                  </span>
                  <span className="confirm__price">{formatPrice(i.total)}</span>
                </li>
              ))}
            </ul>
            <dl className="totals">
              <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {!isPickup && <div><dt>Delivery</dt><dd>{feeUnknown ? 'To be confirmed' : formatPrice(order.deliveryFee)}</dd></div>}
              <div className="totals__grand"><dt>Total</dt><dd>{formatPrice(order.total)}{feeUnknown && <small> + delivery</small>}</dd></div>
            </dl>
          </section>
        </div>

        <section className="confirm__help" aria-labelledby="c-help">
          <div>
            <h2 id="c-help" className="confirm__card-title">Something not right?</h2>
            <p className="muted">Message or call us and mention order {order.number}. We're open every day, {hoursLabel}.</p>
          </div>
          <div className="confirm__actions">
            <a className="btn btn--outline" href={whatsappUrl(problemText)} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={18} /> WhatsApp</a>
            <a className="btn btn--outline" href={telUrl}><Icon name="phone" size={18} /> {formatPhone()}</a>
          </div>
        </section>

        <button type="button" className="back-link confirm__back" onClick={() => goToSection('top')}>
          <Icon name="arrowLeft" size={18} /> Back to Birdy Fam
        </button>
      </div>
    </main>
  )
}
