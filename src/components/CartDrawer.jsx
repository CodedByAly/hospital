import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurant } from '../config/restaurant';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice, localized } from '../lib/format';
import { describeConfig } from '../lib/cart';
import Sheet from './Sheet';
import FoodImage from './FoodImage';
import QtyStepper from './QtyStepper';
import Icon from './Icon';

export function LineOptions({ line }) {
  const { t, lang } = useLanguage();
  const d = describeConfig(line.item, line.config, lang);
  if (!d.choice && !d.extras.length && !d.removed.length && !d.note) return null;
  return (
    <ul className="line-options">
      {d.choice ? <li>{localized(d.choice, lang)}</li> : null}
      {d.extras.map((x) => (
        <li key={x}>+ {x}</li>
      ))}
      {d.removed.length ? (
        <li className="line-options__removed">
          {t.item.without} {d.removed.join(lang === 'ar' ? '، ' : ', ')}
        </li>
      ) : null}
      {d.note ? <li className="line-options__note">“{d.note}”</li> : null}
    </ul>
  );
}

function CartLine({ line }) {
  const { t, lang } = useLanguage();
  const { setQty, remove } = useCart();
  const { openItem, closeCart } = useUI();
  const [leaving, setLeaving] = useState(false);
  const name = localized(line.item.name, lang);

  const removeLine = () => {
    setLeaving(true);
    setTimeout(() => remove(line.key), 220);
  };

  return (
    <li className={`cart-line ${leaving ? 'is-leaving' : ''}`}>
      <FoodImage src={line.item.image} alt="" className="cart-line__img" />
      <div className="cart-line__main">
        <div className="cart-line__head">
          <h3 className="cart-line__name">{name}</h3>
          <p className="cart-line__total">{formatPrice(line.unit * line.qty, lang)}</p>
        </div>
        <LineOptions line={line} />
        {line.qty > 1 ? (
          <p className="cart-line__unit">
            {formatPrice(line.unit, lang)} {t.cart.each}
          </p>
        ) : null}
        <div className="cart-line__actions">
          <QtyStepper
            size="sm"
            value={line.qty}
            min={0}
            onChange={(q) => (q <= 0 ? removeLine() : setQty(line.key, q))}
            label={`${t.item.quantity}: ${name}`}
          />
          <div className="cart-line__links">
            <button
              type="button"
              className="text-button"
              onClick={() => {
                closeCart();
                openItem(line.itemId, line);
              }}
            >
              <Icon name="edit" size={16} />
              {t.cart.edit}
            </button>
            <button type="button" className="text-button" onClick={removeLine} aria-label={t.cart.removeNamed(name)}>
              <Icon name="trash" size={16} />
              {t.cart.remove}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function CartTotals({ subtotal, delivery }) {
  const { t, lang } = useLanguage();
  const fee = restaurant.deliveryFee;
  const showDelivery = delivery && restaurant.services.delivery;
  const total = subtotal + (showDelivery && fee ? fee : 0);
  return (
    <dl className="totals">
      <div className="totals__row">
        <dt>{t.cart.subtotal}</dt>
        <dd>{formatPrice(subtotal, lang)}</dd>
      </div>
      {showDelivery ? (
        <div className="totals__row">
          <dt>{t.cart.delivery}</dt>
          <dd>{fee == null ? <span className="totals__tbc">{t.cart.deliveryTbc}</span> : formatPrice(fee, lang)}</dd>
        </div>
      ) : null}
      <div className="totals__row totals__row--total">
        <dt>{t.cart.total}</dt>
        <dd>
          {formatPrice(total, lang)}
          {showDelivery && fee == null ? <small> {t.cart.totalPlusDelivery}</small> : null}
        </dd>
      </div>
    </dl>
  );
}

export default function CartDrawer() {
  const { t } = useLanguage();
  const { lines, count, subtotal, clear } = useCart();
  const { cartOpen, closeCart } = useUI();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!cartOpen) setConfirming(false);
  }, [cartOpen]);

  return (
    <Sheet open={cartOpen} onClose={closeCart} variant="drawer" labelledBy="cart-title" className="cart">
      <header className="cart__header">
        <h2 id="cart-title">
          {t.cart.title}
          {count > 0 ? <span className="cart__count">{t.cart.itemCount(count)}</span> : null}
        </h2>
        <button type="button" className="icon-button" onClick={closeCart} aria-label={t.common.close} data-autofocus>
          <Icon name="close" size={20} />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <Icon name="bag" size={40} strokeWidth={1.2} />
          <h3>{t.cart.empty}</h3>
          <p>{t.cart.emptyText}</p>
          <Link to="/menu" className="btn btn--primary" onClick={closeCart}>
            {t.cart.browse}
          </Link>
        </div>
      ) : (
        <>
          <ul className="cart__lines">
            {lines.map((line) => (
              <CartLine key={line.key} line={line} />
            ))}
          </ul>

          <footer className="cart__footer">
            <CartTotals subtotal={subtotal} delivery />
            <Link to="/checkout" className="btn btn--primary btn--block btn--lg" onClick={closeCart}>
              {t.cart.checkout}
              <Icon name="arrow" size={18} className="flip-rtl" />
            </Link>
            {confirming ? (
              <div className="cart__confirm" role="alert">
                <span>{t.cart.clearConfirm}</span>
                <button type="button" className="text-button text-button--danger" onClick={() => { clear(); setConfirming(false); }}>
                  {t.cart.clear}
                </button>
                <button type="button" className="text-button" onClick={() => setConfirming(false)}>
                  {t.common.back}
                </button>
              </div>
            ) : (
              <button type="button" className="text-button cart__clear" onClick={() => setConfirming(true)}>
                {t.cart.clear}
              </button>
            )}
          </footer>
        </>
      )}
    </Sheet>
  );
}
