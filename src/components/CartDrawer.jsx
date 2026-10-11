import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { ordering } from '../config/site.js';
import { formatCents, formatPrice } from '../lib/format.js';
import { prefersReducedMotion } from '../lib/motion.js';
import Dialog from './Dialog.jsx';
import FoodImage from './FoodImage.jsx';
import Icon from './Icon.jsx';
import QuantityStepper from './QuantityStepper.jsx';
import AnimatedPrice from './AnimatedPrice.jsx';
import './CartDrawer.css';

export function describeLine(line) {
  const parts = [];
  for (const group of line.item.options) {
    const choice = group.choices.find((c) => c.id === line.options[group.id]);
    if (choice) parts.push(choice.label);
  }
  for (const addon of line.item.addons) {
    if (line.addons.includes(addon.id)) parts.push(`+ ${addon.label}`);
  }
  return parts;
}

export function CartLine({ line, compact = false, index = 0 }) {
  const { setQuantity, removeLine, openItem, closeCart } = useShop();
  const [leaving, setLeaving] = useState(false);
  const details = describeLine(line);

  const remove = () => {
    if (prefersReducedMotion()) return removeLine(line.key);
    setLeaving(true);
    setTimeout(() => removeLine(line.key), 220);
  };

  const edit = () => {
    closeCart();
    openItem(line.itemId, line.key);
  };

  return (
    <li className={`cart-line ${leaving ? 'is-leaving' : ''} ${compact ? 'cart-line--compact' : ''} ${line.item.image ? '' : 'cart-line--noimg'}`} style={{ '--i': index }}>
      {line.item.image && <FoodImage src={line.item.image} alt={line.item.name} className="cart-line__img" />}
      <div className="cart-line__info">
        <div className="cart-line__top">
          <p className="cart-line__name">{line.item.name}</p>
          <p className="cart-line__total">
          <AnimatedPrice cents={line.totalCents} />
        </p>
        </div>
        <p className="cart-line__unit">{formatCents(line.unitCents)} each</p>
        {details.length > 0 && <p className="cart-line__mods">{details.join(' · ')}</p>}
        {line.removed.length > 0 && (
          <p className="cart-line__mods cart-line__mods--removed">{line.removed.map((r) => `No ${r.toLowerCase()}`).join(', ')}</p>
        )}
        {line.note && <p className="cart-line__note">“{line.note}”</p>}
        {!compact && (
          <div className="cart-line__actions">
            <QuantityStepper size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} label={`Quantity of ${line.item.name}`} />
            <button type="button" className="text-btn" onClick={edit}>
              <Icon name="edit" size={16} /> Edit
            </button>
            <button type="button" className="text-btn text-btn--danger" onClick={remove} aria-label={`Remove ${line.item.name}`}>
              <Icon name="trash" size={16} /> Remove
            </button>
          </div>
        )}
        {compact && <p className="cart-line__unit">Qty {line.quantity}</p>}
      </div>
    </li>
  );
}

export function TotalsBlock({ subtotalCents, orderType = null }) {
  const fee = ordering.deliveryFee;
  const showDelivery = orderType !== 'pickup';
  const feeCents = orderType === 'delivery' && fee != null ? Math.round(fee * 100) : 0;
  return (
    <dl className="totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatCents(subtotalCents)}</dd>
      </div>
      {showDelivery && (
        <div className="totals__muted">
          <dt>Delivery</dt>
          <dd>{fee == null ? 'Confirmed by the branch' : fee === 0 ? 'Free' : formatPrice(fee)}</dd>
        </div>
      )}
      <div className="totals__grand">
        <dt>Total{showDelivery && fee == null ? <span> before delivery</span> : null}</dt>
        <dd>
          <AnimatedPrice cents={subtotalCents + feeCents} />
        </dd>
      </div>
    </dl>
  );
}

export default function CartDrawer() {
  const { cartOpen, closeCart, lines, count, subtotalCents, clearCart } = useShop();
  const [confirmClear, setConfirmClear] = useState(false);
  const navigate = useNavigate();

  const close = () => {
    setConfirmClear(false);
    closeCart();
  };

  return (
    <Dialog open={cartOpen} onClose={close} labelledBy="cart-title" variant="side" className="cart">
      <header className="cart__head">
        <h2 id="cart-title">
          Your order {count > 0 && <span className="cart__count">{count} {count === 1 ? 'item' : 'items'}</span>}
        </h2>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close your order">
          <Icon name="close" />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <div className="cart__empty-icon">
            <Icon name="bag" size={30} strokeWidth={1.5} />
          </div>
          <p className="cart__empty-title">Your order is empty</p>
          <Link to="/menu" className="btn btn--primary" onClick={close}>
            Go to menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart__lines">
            {lines.map((line, i) => (
              <CartLine key={line.key} line={line} index={i} />
            ))}
          </ul>
          <div className="cart__foot">
            <TotalsBlock subtotalCents={subtotalCents} />
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => {
                close();
                navigate('/checkout');
              }}
            >
              Checkout <AnimatedPrice className="btn__price" cents={subtotalCents} />
            </button>
            <div className="cart__clear">
              {confirmClear ? (
                <>
                  <span>Clear everything?</span>
                  <button type="button" className="text-btn text-btn--danger" onClick={() => { clearCart(); setConfirmClear(false); }}>
                    Yes, clear
                  </button>
                  <button type="button" className="text-btn" onClick={() => setConfirmClear(false)}>
                    Keep
                  </button>
                </>
              ) : (
                <button type="button" className="text-btn" onClick={() => setConfirmClear(true)}>
                  Clear order
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
