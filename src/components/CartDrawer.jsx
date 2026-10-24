import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { restaurant } from '../data/restaurant';
import { describeLine } from '../lib/cartLine';
import { money, pluralize } from '../lib/format';
import Dialog from './Dialog';
import { ArrowRightIcon, CloseIcon, EditIcon } from './Icons';
import { LogoMark } from './Logo';
import QtyStepper from './QtyStepper';
import './CartDrawer.css';

const LEAVE_MS = 220;

export default function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQty, remove, clear, openItem } = useCart();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!isOpen) setConfirmClear(false);
  }, [isOpen]);

  const removeAnimated = (key) => {
    setLeaving((l) => [...l, key]);
    setTimeout(() => {
      remove(key);
      setLeaving((l) => l.filter((k) => k !== key));
    }, LEAVE_MS);
  };

  const fee = restaurant.ordering.deliveryFee;

  return (
    <Dialog open={isOpen} onClose={closeCart} labelledBy="cart-title" variant="side" className="cart">
      <header className="cart__head">
        <div>
          <h2 id="cart-title" className="display cart__title">
            Your order
          </h2>
          {count > 0 && <p className="cart__count">{pluralize(count, 'item')}</p>}
        </div>
        <button type="button" className="icon-btn" onClick={closeCart} aria-label="Close cart">
          <CloseIcon size={22} />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <LogoMark className="cart__empty-mark" strokeWidth={6} />
          <p className="display cart__empty-title">Nothing here yet</p>
          <p className="cart__empty-text">Pick something from the menu and it will show up here.</p>
          <Link to="/menu" className="btn btn--dark" onClick={closeCart}>
            Browse the menu <ArrowRightIcon size={18} />
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart__lines" aria-label="Items in your order">
            {lines.map((line) => {
              const details = describeLine(line);
              return (
                <li key={line.key} className={`cart-line ${leaving.includes(line.key) ? 'is-leaving' : ''}`}>
                  <div className="cart-line__inner">
                    <div className="cart-line__main">
                      <p className="cart-line__name">{line.item.name}</p>
                      {details.length > 0 && <p className="cart-line__details">{details.join(' · ')}</p>}
                      {line.note && <p className="cart-line__note">“{line.note}”</p>}
                      <div className="cart-line__actions">
                        <button
                          type="button"
                          className="cart-line__link"
                          onClick={() => openItem(line.itemId, line.key)}
                          aria-label={`Edit ${line.item.name}`}
                        >
                          <EditIcon size={14} /> Edit
                        </button>
                        <button type="button" className="cart-line__link" onClick={() => removeAnimated(line.key)} aria-label={`Remove ${line.item.name}`}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="cart-line__side">
                      <p className="cart-line__total">{money(line.total)}</p>
                      {line.qty > 1 && <p className="cart-line__unit">{money(line.unitPrice)} each</p>}
                      <QtyStepper
                        size="sm"
                        value={line.qty}
                        allowRemove
                        label={line.item.name}
                        onChange={(qty) => (qty <= 0 ? removeAnimated(line.key) : setQty(line.key, qty))}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <footer className="cart__foot">
            <dl className="totals">
              <div className="totals__grand">
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
            </dl>
            <p className="cart__fine">
              {fee == null
                ? 'Delivery fee is confirmed with you on WhatsApp. No fee for pickup.'
                : fee === 0
                  ? 'Free delivery. No fee for pickup either.'
                  : `Delivery adds ${money(fee)}. No fee for pickup.`}
            </p>
            <button
              type="button"
              className="btn btn--primary btn--lg btn--block"
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
            >
              Checkout <ArrowRightIcon size={18} />
            </button>
            <div className="cart__clear">
              {confirmClear ? (
                <span role="group" aria-label="Confirm clearing the cart">
                  Clear everything?{' '}
                  <button type="button" onClick={() => { clear(); setConfirmClear(false); }}>
                    Yes, clear
                  </button>{' '}
                  <button type="button" onClick={() => setConfirmClear(false)}>
                    Keep
                  </button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmClear(true)}>
                  Clear cart
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </Dialog>
  );
}
