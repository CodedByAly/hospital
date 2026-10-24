import { Link, useParams } from 'react-router-dom';
import { ArrowRightIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons';
import { LogoMark } from '../components/Logo';
import WhishPanel from '../components/WhishPanel';
import { restaurant, telLink, whatsappLink } from '../data/restaurant';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { money } from '../lib/format';
import { findOrder, orderWhatsappLink, paymentLabel } from '../lib/order';
import './Confirmation.css';

export default function Confirmation() {
  const { number } = useParams();
  const order = findOrder(number);
  useDocumentMeta(order ? `Order ${order.number}` : 'Order not found');

  if (!order) {
    return (
      <div className="confirm confirm--missing container">
        <h1 className="display h2">We can’t find that order</h1>
        <p className="lede">
          Orders are saved on the device they were placed from. If you need help with an order, message us with your order number.
        </p>
        <div className="confirm__ctas">
          <a href={whatsappLink(`Hi, I have a question about order ${number}.`)} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
            <WhatsAppIcon size={18} /> Message us
          </a>
          <Link to="/menu" className="btn btn--ghost">
            Back to the menu
          </Link>
        </div>
      </div>
    );
  }

  const c = order.customer;
  const viaWhatsapp = order.channel === 'whatsapp';
  const feeUnknown = order.type === 'delivery' && order.deliveryFee == null;
  const placed = new Date(order.createdAt);

  return (
    <div className="confirm container">
      <header className="confirm__head">
        <div className="confirm__mark" aria-hidden="true">
          <LogoMark strokeWidth={7} />
        </div>
        <p className="eyebrow">{viaWhatsapp ? 'Almost done' : 'Order received'}</p>
        <h1 className="display h2">
          Thanks, {c.name.split(' ')[0]}.
          <br />
          Order <span className="confirm__number">{order.number}</span>
        </h1>
        {viaWhatsapp ? (
          <p className="lede">
            Your order opened in WhatsApp, written out and ready. <strong>It reaches our kitchen once you press send.</strong> If WhatsApp
            didn’t open, use the button below.
          </p>
        ) : (
          <p className="lede">We’ve got your order and will confirm it on WhatsApp or by phone shortly.</p>
        )}
        {viaWhatsapp && (
          <a href={orderWhatsappLink(order)} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp btn--lg confirm__send">
            <WhatsAppIcon size={20} /> Send order on WhatsApp
          </a>
        )}
      </header>

      <div className="confirm__grid">
        <section className="confirm__card" aria-labelledby="c-details">
          <h2 id="c-details" className="confirm__h">
            Details
          </h2>
          <dl className="confirm__dl">
            <div>
              <dt>Order number</dt>
              <dd>{order.number}</dd>
            </div>
            <div>
              <dt>Placed</dt>
              <dd>{placed.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{c.name}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{c.phone}</dd>
            </div>
            <div>
              <dt>Order type</dt>
              <dd>{order.type === 'pickup' ? 'Pickup' : 'Delivery'}</dd>
            </div>
            {order.type === 'pickup' ? (
              <div>
                <dt>Pickup</dt>
                <dd>{order.pickupTime === 'asap' ? 'As soon as possible' : `Around ${order.pickupTime}`}</dd>
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
              <dt>Payment</dt>
              <dd>{paymentLabel(order.payment, order.type)}</dd>
            </div>
            {c.notes && (
              <div>
                <dt>Notes</dt>
                <dd>{c.notes}</dd>
              </div>
            )}
          </dl>
          <p className="confirm__expect">
            {order.type === 'pickup'
              ? `We’ll reply on WhatsApp with the time your order will be ready at ${restaurant.address.lines[0]}.`
              : 'We’ll reply on WhatsApp to confirm your order and the delivery time.'}
          </p>
        </section>

        <section className="confirm__card" aria-labelledby="c-summary">
          <h2 id="c-summary" className="confirm__h">
            Summary
          </h2>
          <ul className="summary__lines">
            {order.lines.map((l, i) => (
              <li key={i} className="summary__line">
                <span className="summary__qty">{l.qty}×</span>
                <span className="summary__name">
                  {l.name}
                  {l.details.length > 0 && <small>{l.details.join(' · ')}</small>}
                  {l.note && <small>“{l.note}”</small>}
                </span>
                <span className="summary__price">{money(l.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals confirm__totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(order.subtotal)}</dd>
            </div>
            {order.type === 'delivery' && (
              <div className="totals__muted">
                <dt>Delivery</dt>
                <dd>{feeUnknown ? 'To be confirmed' : order.deliveryFee === 0 ? 'Free' : money(order.deliveryFee)}</dd>
              </div>
            )}
            <div className="totals__grand">
              <dt>Total</dt>
              <dd>
                {money(order.total)}
                {feeUnknown && <small> + delivery</small>}
              </dd>
            </div>
          </dl>
          {order.payment === 'whish' && <WhishPanel amount={order.total} feeUnknown={feeUnknown} orderNumber={order.number} />}
        </section>

        <section className="confirm__card confirm__help on-dark" aria-labelledby="c-help">
          <h2 id="c-help" className="confirm__h">
            Something wrong?
          </h2>
          <p>Call or message us and mention your order number.</p>
          <div className="confirm__help-actions">
            <a href={telLink} className="btn btn--primary">
              <PhoneIcon size={18} /> {restaurant.phone.display}
            </a>
            <a href={whatsappLink(`Hi, about my order ${order.number}:`)} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
          <p className="confirm__addr">
            <PinIcon size={16} /> {restaurant.address.street}, {restaurant.city}
          </p>
        </section>
      </div>

      <div className="confirm__ctas">
        <Link to="/menu" className="text-link">
          Start a new order <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
