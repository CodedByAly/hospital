import { restaurant, whatsappLink, telLink, addressLine } from '../../data/restaurant';
import { formatPrice } from '../../lib/format';
import Icon from '../Icon';
import WhishNumber from './WhishNumber';
import { paymentLabels } from './DetailsStep';

function orderMessage(order) {
  const rows = order.lines.map((l) => {
    const extra = [...l.extras, l.note && `"${l.note}"`].filter(Boolean).join(', ');
    return `${l.qty} x ${l.name}${extra ? ` (${extra})` : ''} - ${formatPrice(l.total)}`;
  });
  return [
    `Order ${order.number}`,
    `Table: ${order.table}`,
    `Name: ${order.name}`,
    '',
    ...rows,
    '',
    `Total: ${formatPrice(order.total)}`,
    `Payment: ${paymentLabels[order.payment] ?? order.payment}`,
    order.notes ? `Notes: ${order.notes}` : null,
  ]
    .filter((r) => r !== null)
    .join('\n');
}

export default function ConfirmationStep({ order, onClose, onNew }) {
  const whish = restaurant.ordering.payments.whishNumber;
  const time = new Date(order.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="confirm">
      <header className="order__head">
        <div>
          <h2 id="order-title" className="order__title">
            Order ready
          </h2>
          <p className="order__sub">Placed at {time}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <Icon name="close" size={20} />
        </button>
      </header>

      <div className="order__body">
        <div className="confirm__ticket">
          <div className="confirm__check" aria-hidden="true">
            <Icon name="check" size={28} strokeWidth={2.2} />
          </div>
          <p className="confirm__label">Order number</p>
          <p className="confirm__number">{order.number}</p>
          <dl className="confirm__meta">
            <div>
              <dt>Name</dt>
              <dd>{order.name}</dd>
            </div>
            <div>
              <dt>Table</dt>
              <dd>{order.table}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>Dine-in</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{paymentLabels[order.payment]}</dd>
            </div>
          </dl>

          <ul className="confirm__lines">
            {order.lines.map((l, i) => (
              <li key={i}>
                <span className="confirm__qty">{l.qty}&times;</span>
                <span className="confirm__name">
                  {l.name}
                  {(l.extras.length > 0 || l.note) && (
                    <small>{[...l.extras, l.note && `“${l.note}”`].filter(Boolean).join(', ')}</small>
                  )}
                </span>
                <span className="confirm__price">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          {order.notes && <p className="confirm__notes">Notes: {order.notes}</p>}
          <div className="confirm__total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="confirm__next">
          <h3>One last step</h3>
          <p>
            Send the order to our team on WhatsApp, or simply show this screen to your waiter. We&rsquo;ll bring
            everything to table {order.table}.
          </p>
          {order.payment === 'whish' && whish && (
            <div className="order__whish">
              <p>
                Whish transfer of <strong>{formatPrice(order.total)}</strong> to:
              </p>
              <WhishNumber number={whish} />
            </div>
          )}
        </div>

        <div className="confirm__help">
          <p>Something not right?</p>
          <a href={telLink}>
            <Icon name="phone" size={16} /> Call {restaurant.phoneDisplay}
          </a>
          <a href={whatsappLink(`Hi Talia, about my order ${order.number}:`)} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={16} /> Message us on WhatsApp
          </a>
          <p className="confirm__where">
            {restaurant.fullName} &middot; {addressLine} &middot; {restaurant.hours.summary}
          </p>
        </div>
      </div>

      <footer className="order__foot">
        <a className="btn btn--olive btn--block order__cta" href={whatsappLink(orderMessage(order))} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={20} />
          Send order on WhatsApp
        </a>
        <button type="button" className="btn btn--ghost btn--block" onClick={onNew}>
          Start a new order
        </button>
      </footer>
    </div>
  );
}
