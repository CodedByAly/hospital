import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { formatPrice, pluralize } from '../../lib/format';
import { describeSelection } from '../../lib/pricing';
import DishImage, { BeansMark } from '../DishImage';
import Icon from '../Icon';

function Line({ line, onEdit, onQty, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  const extras = describeSelection(line.item, line.selection);

  const remove = () => {
    setLeaving(true);
    window.setTimeout(onRemove, 260);
  };

  return (
    <li className={`order-line ${leaving ? 'is-leaving' : ''}`}>
      <div className="order-line__thumb">
        <DishImage item={line.item} size="sm" sizes="64px" />
      </div>
      <div className="order-line__main">
        <div className="order-line__top">
          <p className="order-line__name">{line.item.name}</p>
          <p className="order-line__total">{formatPrice(line.total)}</p>
        </div>
        {extras.length > 0 && <p className="order-line__meta">{extras.join(', ')}</p>}
        {line.note && <p className="order-line__note">&ldquo;{line.note}&rdquo;</p>}
        <p className="order-line__unit">{formatPrice(line.unit)} each</p>
        <div className="order-line__actions">
          <div className="stepper" role="group" aria-label={`Quantity of ${line.item.name}`}>
            <button
              type="button"
              onClick={() => (line.qty <= 1 ? remove() : onQty(line.qty - 1))}
              aria-label={line.qty <= 1 ? `Remove ${line.item.name}` : 'One less'}
            >
              <Icon name={line.qty <= 1 ? 'trash' : 'minus'} size={16} />
            </button>
            <output aria-live="polite">{line.qty}</output>
            <button type="button" onClick={() => onQty(line.qty + 1)} disabled={line.qty >= 99} aria-label="One more">
              <Icon name="plus" size={16} />
            </button>
          </div>
          <button type="button" className="order-line__link" onClick={onEdit}>
            <Icon name="edit" size={15} /> Edit
          </button>
          <button type="button" className="order-line__link" onClick={remove}>
            <Icon name="trash" size={15} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartStep({ onNext, onClose, lastOrder, onShowLast }) {
  const { lines, count, subtotal, total, setQty, remove, clear } = useCart();
  const { openItem } = useUI();
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!confirmClear) return undefined;
    const t = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  const browse = () => {
    onClose();
    window.setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  return (
    <>
      <header className="order__head">
        <div>
          <h2 id="order-title" className="order__title">
            Your order
          </h2>
          <p className="order__sub">{count > 0 ? `${pluralize(count, 'item')} · dine-in` : 'Dine-in at Talia'}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close your order">
          <Icon name="close" size={20} />
        </button>
      </header>

      {lines.length === 0 ? (
        <div className="order__empty">
          <BeansMark className="order__empty-mark" />
          <p className="order__empty-title">Nothing on your table yet</p>
          <p>Add dishes and drinks from the menu, then send the order to our team.</p>
          <button type="button" className="btn btn--wine" onClick={browse}>
            Browse the menu
          </button>
          {lastOrder && (
            <button type="button" className="text-link" onClick={onShowLast}>
              View your last order ({lastOrder.number})
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="order__body">
            <ul className="order__lines">
              {lines.map((line) => (
                <Line
                  key={line.key}
                  line={line}
                  onQty={(q) => setQty(line.key, q)}
                  onRemove={() => remove(line.key)}
                  onEdit={() => openItem(line.itemId, line.key)}
                />
              ))}
            </ul>
            <button
              type="button"
              className={`order__clear ${confirmClear ? 'is-confirming' : ''}`}
              onClick={() => (confirmClear ? (clear(), setConfirmClear(false)) : setConfirmClear(true))}
            >
              {confirmClear ? 'Tap again to clear everything' : 'Clear order'}
            </button>
          </div>

          <footer className="order__foot">
            <dl className="order__sums">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="order__sum-total">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <button type="button" className="btn btn--wine btn--block order__cta" onClick={onNext}>
              Continue
              <Icon name="arrowRight" size={18} />
            </button>
          </footer>
        </>
      )}
    </>
  );
}
