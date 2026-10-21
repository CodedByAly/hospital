import { Link, useLocation, useParams } from 'react-router-dom'
import { IconCheck, IconPhone, IconWhatsApp } from '../components/Icons.jsx'
import { OrderSummary } from '../components/OrderSummary.jsx'
import { WhishCard } from '../components/WhishCard.jsx'
import { restaurant } from '../config/restaurant.js'
import { usePageMeta } from '../hooks/usePageMeta.js'
import { formatPrice, phoneLink, whatsappLink } from '../lib/format.js'
import { LAST_ORDER_KEY, orderMessage, paymentLabel } from '../lib/order.js'
import { readJSON } from '../lib/storage.js'
import { ordersGoToWhatsApp } from '../lib/submit.js'

export default function Confirmation() {
  usePageMeta('Order confirmation')
  const { number } = useParams()
  const location = useLocation()
  const stored = readJSON(LAST_ORDER_KEY, null)
  const order = location.state?.order ?? (stored?.number === number ? stored : null)

  if (!order) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title">Order not found</h1>
        <p>We couldn&rsquo;t find order {number} on this device. If you placed it, the team has it on WhatsApp.</p>
        <div className="confirm__help-actions">
          <a href={whatsappLink(`Hi Jungs, about my order ${number}`)} className="btn btn--wa" target="_blank" rel="noopener noreferrer">
            <IconWhatsApp size={20} /> Ask on WhatsApp
          </a>
          <Link to="/menu" className="btn btn--ghost">
            Back to menu
          </Link>
        </div>
      </div>
    )
  }

  const c = order.customer
  const isPickup = order.type === 'pickup'
  const eta = isPickup
    ? c.pickupTime === 'As soon as possible'
      ? `Ready in about ${restaurant.estimates.pickupMinutes} minutes once confirmed`
      : `Ready for pickup at ${c.pickupTime}`
    : `Usually ${restaurant.estimates.deliveryMinutes} minutes once confirmed`
  const firstName = c.name.split(' ')[0]

  return (
    <div className="confirm">
      <div className="container confirm__inner">
        <header className="confirm__head">
          <span className="confirm__badge" aria-hidden="true">
            <IconCheck size={30} />
          </span>
          <p className="confirm__number">Order {order.number}</p>
          <h1 className="confirm__title">Thanks, {firstName}. We&rsquo;ve got it from here.</h1>
          {ordersGoToWhatsApp ? (
            <div className="confirm__send">
              <p>
                Your order opened in WhatsApp. <strong>Make sure you pressed send</strong>, that&rsquo;s how it reaches the kitchen. We
                reply there to confirm.
              </p>
              <a href={whatsappLink(orderMessage(order))} className="btn btn--wa" target="_blank" rel="noopener noreferrer">
                <IconWhatsApp size={20} /> Open WhatsApp again
              </a>
            </div>
          ) : (
            <p className="confirm__lede">The kitchen has your order. We&rsquo;ll call {c.phone} if anything needs checking.</p>
          )}
        </header>

        <div className="confirm__grid">
          <section className="confirm__card" aria-labelledby="details-title">
            <h2 id="details-title" className="co-step__title">Details</h2>
            <dl className="info-list">
              <div>
                <dt>Order number</dt>
                <dd className="mono">{order.number}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{c.name}</dd>
              </div>
              <div>
                <dt>Order type</dt>
                <dd>{isPickup ? 'Pickup' : 'Delivery'}</dd>
              </div>
              {isPickup ? (
                <div>
                  <dt>Pickup from</dt>
                  <dd>
                    <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                      {restaurant.name}, {restaurant.address.display}
                    </a>
                  </dd>
                </div>
              ) : (
                <div>
                  <dt>Deliver to</dt>
                  <dd>
                    {c.area}, {c.address}
                    {c.building && <>, {c.building}</>}
                  </dd>
                </div>
              )}
              <div>
                <dt>{isPickup ? 'Pickup time' : 'Expected'}</dt>
                <dd>{eta}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{paymentLabel(order)}</dd>
              </div>
              {c.notes && (
                <div>
                  <dt>Notes</dt>
                  <dd>{c.notes}</dd>
                </div>
              )}
            </dl>

            {order.payment === 'whish' && (
              <WhishCard>
                <p className="whish__steps-text">
                  {order.deliveryFeePending
                    ? 'We will send your final total including delivery on WhatsApp. Transfer it to this number and share the screenshot in the chat.'
                    : `Transfer ${formatPrice(order.total)} to this number if you haven't yet, and share the screenshot in the WhatsApp chat with your order number.`}
                </p>
              </WhishCard>
            )}
          </section>

          <section className="confirm__card" aria-labelledby="summary-title">
            <h2 id="summary-title" className="co-step__title">Your order</h2>
            <OrderSummary
              lines={order.lines}
              subtotal={order.subtotal}
              deliveryFee={order.deliveryFee}
              feePending={order.deliveryFeePending}
              total={order.total}
            />
          </section>
        </div>

        <section className="confirm__help" aria-labelledby="help-title">
          <div>
            <h2 id="help-title" className="confirm__help-title">Problem with your order?</h2>
            <p>
              Call or message us and give us your order number, <strong>{order.number}</strong>. We&rsquo;re open {restaurant.hours.label}.
            </p>
          </div>
          <div className="confirm__help-actions">
            <a href={phoneLink} className="btn btn--light">
              <IconPhone size={18} /> {restaurant.phone.display}
            </a>
            <a href={whatsappLink(`Hi Jungs, about my order ${order.number}`)} className="btn btn--wa" target="_blank" rel="noopener noreferrer">
              <IconWhatsApp size={20} /> WhatsApp
            </a>
          </div>
        </section>

        <p className="confirm__back">
          <Link to="/" className="link-btn">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
