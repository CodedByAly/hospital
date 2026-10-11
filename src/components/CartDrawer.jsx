import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useCart, unitPrice } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { itemsById } from '../data/menu';
import { tr } from '../lib/format';
import Overlay from './Overlay';
import FoodImage from './FoodImage';
import QuantityStepper from './QuantityStepper';
import Price from './Price';
import Icon from './Icon';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { t } = useLanguage();
  const { lines, count, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!cartOpen) setConfirmClear(false);
  }, [cartOpen]);

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Overlay open={cartOpen} onClose={closeCart} variant="drawer" labelledBy="cart-title" className="cart">
      <header className="cart__head">
        <h2 id="cart-title" className="cart__title">
          {t.cart.title}
          {count > 0 && <span className="cart__count">{t.common.items(count)}</span>}
        </h2>
        <button type="button" className="icon-btn" onClick={closeCart} aria-label={t.common.close} data-autofocus>
          <Icon name="close" />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="cart__empty">
          <img src="/images/logo-shrimp.svg" alt="" className="cart__empty-mark" />
          <p className="cart__empty-title">{t.cart.empty}</p>
          <p className="cart__empty-hint">{t.cart.emptyHint}</p>
          <Link to="/menu" className="btn btn--primary" onClick={closeCart}>
            {t.cart.browse}
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
              <div className="totals__row totals__row--grand">
                <dt>{t.cart.subtotal}</dt>
                <dd>
                  <Price value={subtotal} />
                </dd>
              </div>
            </dl>
            <p className="cart__foot-note">{t.cart.delivery}: {t.cart.deliveryTbd}</p>
            <button type="button" className="btn btn--primary btn--block btn--lg" onClick={goCheckout}>
              {t.cart.checkout}
              <Icon name="arrow" size={20} />
            </button>
            <div className="cart__clear">
              {confirmClear ? (
                <span className="cart__clear-confirm" role="group" aria-label={t.cart.clearConfirm}>
                  <span>{t.cart.clearConfirm}</span>
                  <button type="button" className="link-btn link-btn--danger" onClick={() => { clear(); setConfirmClear(false); }}>
                    {t.cart.yes}
                  </button>
                  <button type="button" className="link-btn" onClick={() => setConfirmClear(false)}>
                    {t.cart.no}
                  </button>
                </span>
              ) : (
                <button type="button" className="link-btn" onClick={() => setConfirmClear(true)}>
                  {t.cart.clear}
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </Overlay>
  );
}

/** Describes a line's choices: "No lettuce · Extra Dynamite Sauce · Note: …" */
export function LineDetails({ line }) {
  const { t, lang } = useLanguage();
  const item = itemsById[line.itemId];
  const ing = Object.fromEntries((item.ingredients || []).map((i) => [i.en, i]));
  const parts = [];
  if (line.sauces.length) parts.push(`${t.cart.sauces}: ${line.sauces.map((id) => tr(itemsById[id].name, lang)).join(lang === 'ar' ? '، ' : ', ')}`);
  for (const r of line.removed) parts.push(`${t.cart.without} ${tr(ing[r], lang)}`);
  for (const id of line.extras) parts.push(`${t.cart.extra} ${tr(itemsById[id].name, lang)}`);
  if (!parts.length && !line.note) return null;
  return (
    <ul className="line-details">
      {parts.map((p) => (
        <li key={p}>{p}</li>
      ))}
      {line.note && (
        <li className="line-details__note">
          {t.cart.note}: “{line.note}”
        </li>
      )}
    </ul>
  );
}

function CartLine({ line }) {
  const { t, lang } = useLanguage();
  const { setQty, remove, maxQty } = useCart();
  const { openItem } = useUI();
  const [leaving, setLeaving] = useState(false);
  const ref = useRef(null);
  const item = itemsById[line.itemId];
  const price = unitPrice(line);

  // Collapse the row smoothly before it is removed from the cart.
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

  const changeQty = (q) => (q < 1 ? handleRemove() : setQty(line.key, q));

  return (
    <li ref={ref} className={`cart-line ${leaving ? 'is-leaving' : ''}`}>
      <div className="cart-line__inner">
        <FoodImage name={item.image} alt="" className="cart-line__img" />
        <div className="cart-line__main">
          <div className="cart-line__top">
            <p className="cart-line__name">
              {tr(item.name, lang)}
              {item.note && <span className="cart-line__note"> ({tr(item.note, lang)})</span>}
            </p>
            <Price value={price * line.qty} className="cart-line__price" />
          </div>
          <LineDetails line={line} />
          {line.qty > 1 && (
            <p className="cart-line__each">
              <Price value={price} /> {t.cart.each}
            </p>
          )}
          <div className="cart-line__actions">
            <QuantityStepper value={line.qty} onChange={changeQty} min={0} max={maxQty} size="sm" />
            <button type="button" className="link-btn" onClick={() => openItem(line.itemId, line.key)}>
              <Icon name="edit" size={16} />
              {t.cart.edit}
            </button>
            <button type="button" className="link-btn link-btn--danger" onClick={handleRemove} aria-label={`${t.cart.remove} ${tr(item.name, lang)}`}>
              <Icon name="trash" size={16} />
              <span className="sr-only-sm">{t.cart.remove}</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
