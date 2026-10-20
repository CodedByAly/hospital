import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import CopyButton from '../components/CopyButton'
import { restaurant, telLink, whatsappLink, fullAddress } from '../config/restaurant'
import { money } from '../utils/format'
import { findOrder, orderWhatsappLink, paymentLabel, formatPickup, formatAddress } from '../utils/order'
import usePageTitle from '../hooks/usePageTitle'

export default function Confirmation() {
  const { id } = useParams()
  const { state } = useLocation()
  const [order, setOrder] = useState(undefined)
  usePageTitle(order ? `Order ${order.id}` : 'Your order')

  useEffect(() => {
    setOrder(findOrder(id))
    window.scrollTo(0, 0)
  }, [id])

  if (order === undefined) {
    return (
      <main id="main" className="page confirm">
        <div className="container narrow"><div className="loading-block" aria-label="Loading order" /></div>
      </main>
    )
  }

  if (!order) {
    return (
      <main id="main" className="page confirm">
        <div className="container narrow">
          <div className="empty-state">
            <span className="empty-state__mark" aria-hidden="true"><Icon name="alert" size={30} strokeWidth={1.5} /></span>
            <h1 className="display display--sm">We can&rsquo;t find that order</h1>
            <p>Orders are saved on the device they were placed from. If you placed order {id}, call or message us and we&rsquo;ll check it for you.</p>
            <div className="empty-state__actions">
              <a href={telLink} className="btn btn--primary btn--lg"><Icon name="phone" size={18} /> Call {restaurant.phone.display}</a>
              <Link to="/" className="btn btn--ghost btn--lg">Back to home</Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const isPickup = order.type === 'pickup'
  const feeUnknown = !isPickup && typeof order.deliveryFee !== 'number'
  const whish = restaurant.whish

  return (
    <main id="main" className="page confirm">
      <div className="container narrow">
        <header className="confirm__head">
          <span className="confirm__mark" aria-hidden="true">
            <svg viewBox="0 0 52 52" width="52" height="52">
              <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" className="confirm__ring" />
              <path d="M15 27l7.5 7.5L37.5 19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="confirm__tick" />
            </svg>
          </span>
          <p className="eyebrow">Order {order.id}</p>
          <h1 className="display display--sm">Thanks, {order.customer.name.split(' ')[0]}</h1>
          <p className="confirm__lead">
            {state?.justPlaced
              ? 'Your order is ready in WhatsApp. Press send so it reaches us, and we will reply to confirm.'
              : 'Here are the details of your order.'}
          </p>
          <div className="confirm__actions">
            <a href={orderWhatsappLink(order)} className="btn btn--whatsapp btn--lg" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={19} />
              <span>{state?.justPlaced ? 'WhatsApp didn’t open? Send order' : 'Send order on WhatsApp'}</span>
            </a>
            <a href={telLink} className="btn btn--ghost btn--lg">
              <Icon name="phone" size={18} />
              <span>Call {restaurant.phone.display}</span>
            </a>
          </div>
        </header>

        <div className="confirm__grid">
          <section className="confirm__card" aria-labelledby="c-details">
            <h2 id="c-details" className="confirm__card-title">Details</h2>
            <dl className="kv">
              <div><dt>Order number</dt><dd className="kv__strong">{order.id}</dd></div>
              <div><dt>Name</dt><dd>{order.customer.name}</dd></div>
              <div><dt>Phone</dt><dd>{order.customer.phone}</dd></div>
              <div><dt>Order type</dt><dd>{isPickup ? 'Pickup' : 'Delivery'}</dd></div>
              {isPickup ? (
                <>
                  <div><dt>Pickup time</dt><dd>{formatPickup(order)}</dd></div>
                  <div><dt>Pickup from</dt><dd><a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">{fullAddress}</a></dd></div>
                </>
              ) : (
                <div><dt>Deliver to</dt><dd>{formatAddress(order.delivery)}</dd></div>
              )}
              <div><dt>Payment</dt><dd>{paymentLabel(order.payment, order.type)}</dd></div>
              {order.notes && <div><dt>Notes</dt><dd>{order.notes}</dd></div>}
            </dl>
            <div className="confirm__next">
              <Icon name="clock" size={18} />
              <p>
                {isPickup
                  ? 'We confirm on WhatsApp when your order is being prepared. Come by at your pickup time and give your order number at the counter.'
                  : 'We reply on WhatsApp or call to confirm your order, the delivery time and the delivery fee for your area.'}
              </p>
            </div>
          </section>

          <section className="confirm__card" aria-labelledby="c-summary">
            <h2 id="c-summary" className="confirm__card-title">Summary</h2>
            <ul className="receipt">
              {order.lines.map((l) => (
                <li key={l.key}>
                  <div className="receipt__row">
                    <span><span className="receipt__qty">{l.qty}×</span> {l.name}</span>
                    <span>{money(l.total)}</span>
                  </div>
                  {l.details.length > 0 && <p className="receipt__details">{l.details.join(' · ')}</p>}
                </li>
              ))}
            </ul>
            <dl className="summary">
              <div className="summary__row"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
              {!isPickup && (
                <div className="summary__row">
                  <dt>Delivery</dt>
                  <dd className={feeUnknown ? 'summary__muted' : ''}>{feeUnknown ? 'Confirmed on call' : money(order.deliveryFee)}</dd>
                </div>
              )}
              <div className="summary__row summary__row--total">
                <dt>Total{feeUnknown ? <small> before delivery</small> : null}</dt>
                <dd>{money(order.total)}</dd>
              </div>
            </dl>

            {order.payment === 'whish' && (
              <div className="whish whish--compact">
                {whish.number ? (
                  <>
                    <p className="whish__k">Whish Money transfer to</p>
                    <div className="whish__number-row">
                      <span className="whish__number">{whish.number}</span>
                      <CopyButton text={whish.number.replace(/\s/g, '')} label="Copy" />
                    </div>
                  </>
                ) : (
                  <p className="whish__k">We&rsquo;ll send you our Whish number on WhatsApp.</p>
                )}
                <p className="whish__fine">
                  Put <strong>{order.id}</strong> in the transfer note and send us the screenshot on WhatsApp.
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="confirm__help" aria-label="Need help">
          <p>
            <strong>Something wrong with your order?</strong> Call <a href={telLink}>{restaurant.phone.display}</a> or{' '}
            <a href={whatsappLink(`Hi Chippy, about my order ${order.id}: `)} target="_blank" rel="noopener noreferrer">message us on WhatsApp</a>.
          </p>
          <Link to="/#menu" className="link-arrow">Order something else <Icon name="arrowRight" size={16} /></Link>
        </section>
      </div>
    </main>
  )
}
