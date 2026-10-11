import { Link, useParams } from 'react-router-dom';
import { payments, site } from '../config/site.js';
import { formatCents, formatPhone, telHref, whatsappHref, mapsHref } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { getBranch, getOrder, orderMessage, paymentLabel, timingLabel } from '../services/orders.js';
import CopyButton from '../components/CopyButton.jsx';
import FoodImage from '../components/FoodImage.jsx';
import Icon, { WhatsAppIcon } from '../components/Icon.jsx';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { number } = useParams();
  const order = getOrder(number);
  useDocumentMeta(order ? `Order ${order.number}` : 'Order not found');

  if (!order) {
    return (
      <div className="container confirm-missing">
        <h1 className="page-title">We couldn’t find that order</h1>
        <p>Orders are saved on the device they were placed from. If you placed it on another phone, check there, or call your branch.</p>
        <Link to="/contact" className="btn btn--primary">
          Contact a branch
        </Link>
      </div>
    );
  }

  const branch = getBranch(order.branchId);
  const message = orderMessage(order);
  const sendTo = branch?.whatsapp;
  const pickup = order.type === 'pickup';

  return (
    <div className="confirm">
      <section className="confirm__hero">
        <div className="container confirm__hero-inner">
          <div className="confirm__check" aria-hidden="true">
            <Icon name="check" size={30} strokeWidth={2.4} />
          </div>
          <p className="confirm__number">Order {order.number}</p>
          <h1 className="confirm__title">Thanks, {order.customer.name.split(' ')[0]}. One last step.</h1>
          <p className="confirm__lede">
            {sendTo
              ? `Send your order to Zaher’s ${branch.name} on WhatsApp. The branch replies to confirm it and starts preparing.`
              : `Call Zaher’s ${branch?.name} to confirm your order. Give them your order number and they’ll take it from there.`}
          </p>
          <div className="confirm__cta">
            {sendTo ? (
              <a className="btn btn--light btn--lg" href={whatsappHref(sendTo, message)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> Send order on WhatsApp
              </a>
            ) : (
              <a className="btn btn--light btn--lg" href={telHref(branch.phone)}>
                <Icon name="phone" size={20} /> Call {formatPhone(branch.phone)}
              </a>
            )}
            <CopyButton text={message} label="Copy order details" className="btn btn--on-orange btn--lg" />
          </div>
        </div>
      </section>

      <div className="container confirm__grid">
        <section className="confirm__card" aria-labelledby="summary-title">
          <h2 id="summary-title" className="confirm__card-title">Order summary</h2>
          <ul className="confirm__lines">
            {order.lines.map((line, i) => (
              <li key={i}>
                <FoodImage src={line.image} alt={line.name} className="confirm__thumb" />
                <div>
                  <p className="confirm__line-name">
                    <span>{line.quantity} ×</span> {line.name}
                  </p>
                  {[...line.details, ...line.removed.map((r) => `No ${r.toLowerCase()}`)].length > 0 && (
                    <p className="confirm__line-mods">{[...line.details, ...line.removed.map((r) => `No ${r.toLowerCase()}`)].join(', ')}</p>
                  )}
                  {line.note && <p className="confirm__line-mods">“{line.note}”</p>}
                </div>
                <p className="confirm__line-total">{formatCents(line.totalCents)}</p>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCents(order.subtotalCents)}</dd>
            </div>
            {!pickup && (
              <div className="totals__muted">
                <dt>Delivery</dt>
                <dd>{order.deliveryFeeCents == null ? 'Confirmed by the branch' : formatCents(order.deliveryFeeCents)}</dd>
              </div>
            )}
            <div className="totals__grand">
              <dt>Total{!pickup && order.deliveryFeeCents == null ? <span> before delivery</span> : null}</dt>
              <dd>{formatCents(order.totalCents)}</dd>
            </div>
          </dl>
        </section>

        <div className="confirm__side">
          <section className="confirm__card" aria-labelledby="details-title">
            <h2 id="details-title" className="confirm__card-title">Details</h2>
            <dl className="confirm__facts">
              <div>
                <dt>Name</dt>
                <dd>{order.customer.name}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{formatPhone(order.customer.phone)}</dd>
              </div>
              <div>
                <dt>Order type</dt>
                <dd>{pickup ? 'Pickup' : 'Delivery'}</dd>
              </div>
              <div>
                <dt>{pickup ? 'Pickup time' : 'Delivery time'}</dt>
                <dd>{timingLabel(order)}</dd>
              </div>
              {!pickup && (
                <div>
                  <dt>Deliver to</dt>
                  <dd>
                    {order.customer.area}
                    <br />
                    {order.customer.address}
                    {order.customer.building && (
                      <>
                        <br />
                        {order.customer.building}
                      </>
                    )}
                  </dd>
                </div>
              )}
              {order.customer.notes && (
                <div>
                  <dt>Notes</dt>
                  <dd>{order.customer.notes}</dd>
                </div>
              )}
              <div>
                <dt>Payment</dt>
                <dd>{paymentLabel(order)}</dd>
              </div>
            </dl>
            {order.payment === 'whish' && payments.whish.number && (
              <div className="confirm__whish">
                <p>
                  Send <strong>{formatCents(order.totalCents)}</strong> to <strong>{formatPhone(payments.whish.number)}</strong> on Whish, then share the
                  screenshot with your order number on WhatsApp.
                </p>
                <CopyButton text={payments.whish.number} label="Copy Whish number" />
              </div>
            )}
          </section>

          {branch && (
            <section className="confirm__card" aria-labelledby="branch-title">
              <h2 id="branch-title" className="confirm__card-title">
                {pickup ? 'Pick up from' : 'Delivering from'} Zaher’s {branch.name}
              </h2>
              <p className="confirm__address">{branch.address}</p>
              <p className="confirm__help">Something wrong with your order? Get in touch with the branch directly.</p>
              <div className="confirm__help-actions">
                <a className="btn btn--outline btn--sm" href={telHref(branch.phone)}>
                  <Icon name="phone" size={16} /> {formatPhone(branch.phone)}
                </a>
                <a className="btn btn--outline btn--sm" href={whatsappHref(branch.whatsapp || site.whatsapp, `Hi, about my order ${order.number}`)} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon size={16} /> WhatsApp
                </a>
                {pickup && (
                  <a className="btn btn--ghost btn--sm" href={mapsHref(branch)} target="_blank" rel="noopener noreferrer">
                    <Icon name="pin" size={16} /> Directions
                  </a>
                )}
              </div>
            </section>
          )}

          <Link to="/menu" className="back-link">
            <Icon name="arrowLeft" size={16} /> Back to the menu
          </Link>
        </div>
      </div>
    </div>
  );
}
