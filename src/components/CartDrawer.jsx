import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { describeSelection } from '../lib/cart';
import { formatPrice } from '../lib/format';
import Dialog from './Dialog';
import Icon from './Icon';
import Price from './Price';
import QuantityStepper from './QuantityStepper';
import { TreeMark } from './Logo';
import './CartDrawer.css';

const LEAVE_MS = 220;

export function LineDetails({ line }) {
  const { t, lang } = useI18n();
  const parts = describeSelection(line.item, line.selection, lang);
  const hasAny = parts.options.length || parts.addons.length || parts.removed.length || parts.note;
  if (!hasAny) return null;
  return (
    <ul className="line-details">
      {parts.options.map((text) => <li key={text}>{text}</li>)}
      {parts.addons.map((addon) => (
        <li key={addon.name}>+ {addon.name} <span className="ltr">({formatPrice(addon.price)})</span></li>
      ))}
      {parts.removed.length > 0 && <li>{t('cart.without')} {parts.removed.join(lang === 'ar' ? '، ' : ', ')}</li>}
      {parts.note && <li className="line-details__note">{t('cart.note')}: {parts.note}</li>}
    </ul>
  );
}

export default function CartDrawer() {
  const { t, pick } = useI18n();
  const cart = useCart();
  const { openItem, announce } = useUI();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const removeLine = (line) => {
    setLeaving((keys) => [...keys, line.key]);
    window.setTimeout(() => {
      cart.remove(line.key);
      setLeaving((keys) => keys.filter((k) => k !== line.key));
      announce(t('cart.removed', { name: pick(line.item.name) }));
    }, LEAVE_MS);
  };

  const goToCheckout = () => {
    cart.close();
    navigate('/checkout');
  };

  const isEmpty = cart.lines.length === 0;

  return (
    <Dialog open={cart.isOpen} onClose={cart.close} variant="drawer" labelledBy="cart-title" className="cart">
      <header className="cart__head">
        <h2 id="cart-title" className="cart__title">
          {t('cart.title')}
          {!isEmpty && <span className="cart__count">{cart.count === 1 ? t('common.item') : t('common.items', { count: cart.count })}</span>}
        </h2>
        <button type="button" className="cart__close" onClick={cart.close} aria-label={t('common.close')}>
          <Icon name="close" size={22} />
        </button>
      </header>

      {isEmpty ? (
        <div className="cart__empty">
          <TreeMark className="cart__empty-mark" />
          <h3>{t('cart.empty')}</h3>
          <p>{t('cart.emptyText')}</p>
          <Link to="/menu" className="btn" onClick={cart.close}>{t('cart.browse')}</Link>
        </div>
      ) : (
        <>
          <ul className="cart__lines">
            {cart.lines.map((line) => (
              <li key={line.key} className={`cart-line ${leaving.includes(line.key) ? 'is-leaving' : ''}`}>
                <div className="cart-line__main">
                  <div className="cart-line__top">
                    <h3 className="cart-line__name">{pick(line.item.name)}</h3>
                    <Price value={line.total} className="cart-line__total" />
                  </div>
                  <LineDetails line={line} />
                  {line.qty > 1 && (
                    <p className="cart-line__unit"><span className="ltr">{line.qty} × {formatPrice(line.unit)}</span></p>
                  )}
                </div>
                <div className="cart-line__actions">
                  <QuantityStepper
                    size="sm"
                    min={0}
                    value={line.qty}
                    label={`${t('common.quantity')}: ${pick(line.item.name)}`}
                    onChange={(qty) => (qty < 1 ? removeLine(line) : cart.setQty(line.key, qty))}
                  />
                  <div className="cart-line__links">
                    <button type="button" onClick={() => openItem(line.itemId, { lineKey: line.key })}>
                      {t('common.edit')}
                    </button>
                    <button type="button" onClick={() => removeLine(line)}>{t('common.remove')}</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <footer className="cart__foot">
            {confirmClear ? (
              <div className="cart__confirm" role="alertdialog" aria-label={t('cart.clearConfirm')}>
                <p>{t('cart.clearConfirm')}</p>
                <div>
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirmClear(false)}>{t('cart.clearNo')}</button>
                  <button
                    type="button"
                    className="btn btn--sm"
                    onClick={() => {
                      cart.clear();
                      setConfirmClear(false);
                    }}
                  >
                    {t('cart.clearYes')}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="cart__clear" onClick={() => setConfirmClear(true)}>
                <Icon name="trash" size={16} /> {t('cart.clear')}
              </button>
            )}
            <dl className="cart__totals">
              <div><dt>{t('common.subtotal')}</dt><dd><Price value={cart.subtotal} /></dd></div>
            </dl>
            <p className="cart__note">{t('cart.deliveryInfo')}</p>
            <button type="button" className="btn btn--block cart__checkout" onClick={goToCheckout}>
              <span>{t('cart.checkout')}</span>
              <Icon name="arrow" className="flip-rtl" />
            </button>
          </footer>
        </>
      )}
    </Dialog>
  );
}
