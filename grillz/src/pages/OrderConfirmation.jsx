import { Link, useParams } from 'react-router-dom';
import useDocumentMeta from '../hooks/useDocumentMeta';
import restaurant from '../config/restaurant';
import { findOrder, orderWhatsAppLink, paymentLabel } from '../lib/order';
import { formatPrice, formatTotals } from '../lib/format';
import { telLink, whatsappLink } from '../lib/links';
import Icon from '../components/Icon';

export default function OrderConfirmation() {
  useDocumentMeta('Your order', 'Your Grillz order.');
  const { orderId } = useParams();
  const order = findOrder(orderId);

  if (!order) {
    return (
      <div className="container narrow-page empty-state">
        <span className="empty-state__icon" aria-hidden="true"><Icon name="alert" size={36} /></span>
        <h1 className="page-title">We couldn’t find that order</h1>
        <p>Orders are kept on this device only. If you sent it on WhatsApp, we have it.</p>
        <div className="empty-state__actions">
          <a href={whatsappLink()} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={20} /> WhatsApp us</a>
          <Link to="/menu" className="btn btn--outline">Back to the menu</Link>
        </div>
      </div>
    );
  }

  const firstName = order.customer.name.split(/\s+/)[0];
  const when =
    order.type === 'pickup'
      ? order.pickupTime
        ? `Pickup at ${order.pickupTime} — we’ll confirm on WhatsApp.`
        : 'Pickup as soon as it’s ready — we’ll message you when it is.'
      : 'We’ll confirm the delivery time and fee on WhatsApp.';

  return (
    <div className="confirm">
      <div className="container confirm__grid">
        <section aria-labelledby="confirm-title">
          <div className="confirm__badge" aria-hidden="true">
            <svg viewBox="0 0 52 52" width="56" height="56">
              <circle cx="26" cy="26" r="24" className="confirm__ring" />
              <path d="M15 27l7 7 15-16" className="confirm__tick" />
            </svg>
          </div>
          <p className="eyebrow">Order ready to send</p>
          <h1 id="confirm-title" className="page-title">Thanks, {firstName}.</h1>
          <p className="confirm__lead">Your order is written out in WhatsApp. Once you press send, we’ll reply to confirm it.</p>

          <div className="confirm__resend">
            <span>WhatsApp didn’t open?</span>
            <a href={orderWhatsAppLink(order)} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} /> Open WhatsApp again
            </a>
          </div>

          <dl className="confirm__facts">
            <div><dt>Order number</dt><dd className="confirm__id">{order.id}</dd></div>
            <div><dt>Order type</dt><dd>{order.type === 'delivery' ? 'Delivery' : 'Pickup'}</dd></div>
            <div><dt>Payment</dt><dd>{paymentLabel(order)}</dd></div>
            <div><dt>When</dt><dd>{when}</dd></div>
            {order.delivery && (
              <div className="confirm__wide">
                <dt>Deliver to</dt>
                <dd>{[order.delivery.address, order.delivery.building, order.delivery.area].filter(Boolean).join(', ')}</dd>
              </div>
            )}
          </dl>

          <div className="confirm__help">
            <h2>Something wrong with your order?</h2>
            <p>Call or WhatsApp us and mention order {order.id}.</p>
            <div className="confirm__help-actions">
              <a href={telLink} className="btn btn--outline"><Icon name="phone" size={19} /> {restaurant.phone.display}</a>
              <a href={whatsappLink(`Hi, about my order ${order.id}:`)} className="btn btn--outline" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={19} /> WhatsApp</a>
            </div>
          </div>
        </section>

        <aside className="summary" aria-labelledby="confirm-summary">
          <h2 id="confirm-summary" className="summary__title">Order summary</h2>
          <ul className="summary__lines">
            {order.items.map((i, idx) => (
              <li key={idx} className="summary__line">
                <span className="summary__qty">{i.qty}×</span>
                <span className="summary__name">
                  {i.name}
                  {(i.details.length > 0 || i.note) && <span className="line-details">{[...i.details, i.note && `“${i.note}”`].filter(Boolean).join(' · ')}</span>}
                </span>
                <span>{formatPrice(i.unit * i.qty, i.currency)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div className="totals__row"><dt>Subtotal</dt><dd>{formatTotals(order.subtotal)}</dd></div>
            {order.type === 'delivery' && (
              <div className="totals__row">
                <dt>Delivery</dt>
                <dd>{order.deliveryFee == null ? <span className="totals__tbd">Confirmed on WhatsApp</span> : formatPrice(order.deliveryFee)}</dd>
              </div>
            )}
            <div className="totals__row totals__row--grand"><dt>Total</dt><dd>{formatTotals(order.total)}</dd></div>
          </dl>
          <div className="confirm__restaurant">
            <p className="confirm__restaurant-name">{restaurant.name}</p>
            <p>{restaurant.address.full}</p>
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="link">Open in Google Maps</a>
          </div>
          <Link to="/menu" className="btn btn--primary btn--block">Back to the menu</Link>
        </aside>
      </div>
    </div>
  );
}
