import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useCart, unitPrice, lineName, lineImage, lineDetails } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import Overlay from './Overlay';
import FoodImage from './FoodImage';
import QuantityStepper from './QuantityStepper';
import Icon from './Icon';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { lines, count, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!cartOpen) setConfirmClear(false);
  }, [cartOpen]);

  return (
    <Overlay open={cartOpen} onClose={closeCart} variant="drawer" labelledBy="cart-title" className="cart">
      <header className="cart__head">
        <h2 id="cart-title" className="cart__title">
          Your order
          {count > 0 && <span className="cart__count">{count} {count === 1 ? 'item' : 'items'}</span>}
        </h2>
        <button type="button" className="icon-btn" onClick={closeCart} aria-label="Close cart" data-autofocus>
          <Icon name="close" />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <span className="cart__empty-icon" aria-hidden="true">
            <Icon name="bag" size={40} strokeWidth={1.4} />
          </span>
          <p className="cart__empty-title">Your cart is empty</p>
          <p className="cart__empty-hint">Burgers, subs, shawarma — pick something and it lands here.</p>
          <Link to="/menu" className="btn btn--primary" onClick={closeCart}>
            Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart__lines" data-scroll>
            {lines.map((line) => (
              <CartLine key={line.key} line={line} />
            ))}
          </ul>
          <footer className="cart__foot">
            <dl className="totals">
              <div className="totals__row">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="totals__row">
                <dt>Delivery</dt>
                <dd className="totals__tbd">Confirmed on WhatsApp</dd>
              </div>
            </dl>
            <button
              type="button"
              className="btn btn--primary btn--block btn--lg"
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
            >
              Checkout · {formatPrice(subtotal)}
              <Icon name="arrow" size={20} />
            </button>
            <div className="cart__clear">
              {confirmClear ? (
                <span className="cart__clear-confirm" role="group" aria-label="Clear the cart?">
                  <span>Remove everything?</span>
                  <button type="button" className="link-btn link-btn--danger" onClick={() => { clear(); setConfirmClear(false); }}>
                    Yes, clear
                  </button>
                  <button type="button" className="link-btn" onClick={() => setConfirmClear(false)}>
                    Keep
                  </button>
                </span>
              ) : (
                <button type="button" className="link-btn" onClick={() => setConfirmClear(true)}>
                  Clear cart
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </Overlay>
  );
}

/** "Honey BBQ sauce · No lettuce" + the note, as a compact list. */
export function LineDetails({ line }) {
  const parts = lineDetails(line);
  if (!parts.length && !line.note) return null;
  return (
    <ul className="line-details">
      {parts.map((p) => (
        <li key={p}>{p}</li>
      ))}
      {line.note && <li className="line-details__note">“{line.note}”</li>}
    </ul>
  );
}

function CartLine({ line }) {
  const { setQty, remove, maxQty } = useCart();
  const { openItem } = useUI();
  const [leaving, setLeaving] = useState(false);
  const ref = useRef(null);
  const price = unitPrice(line);
  const name = lineName(line);

  // Collapse the row smoothly before it leaves the cart.
  const handleRemove = () => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return remove(line.key);
    el.style.height = `${el.offsetHeight}px`;
    setLeaving(true);
    requestAnimationFrame(() => {
      el.style.height = '0px';
    });
    window.setTimeout(() => remove(line.key), 300);
  };

  return (
    <li ref={ref} className={`cart-line ${leaving ? 'is-leaving' : ''}`}>
      <div className="cart-line__inner">
        <FoodImage name={lineImage(line)} alt="" className="cart-line__img" />
        <div className="cart-line__main">
          <div className="cart-line__top">
            <p className="cart-line__name">{name}</p>
            <span className="cart-line__price">{formatPrice(price * line.qty)}</span>
          </div>
          <LineDetails line={line} />
          {line.qty > 1 && <p className="cart-line__each">{formatPrice(price)} each</p>}
          <div className="cart-line__actions">
            <QuantityStepper value={line.qty} onChange={(q) => (q < 1 ? handleRemove() : setQty(line.key, q))} min={0} max={maxQty} size="sm" />
            <button type="button" className="link-btn" onClick={() => openItem(line.itemId, { editKey: line.key })}>
              <Icon name="edit" size={16} /> Edit
            </button>
            <button type="button" className="link-btn link-btn--danger" onClick={handleRemove} aria-label={`Remove ${name}`}>
              <Icon name="trash" size={16} />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
