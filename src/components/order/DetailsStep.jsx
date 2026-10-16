import { useState } from 'react';
import { restaurant } from '../../data/restaurant';
import { useCart } from '../../context/CartContext';
import { formatPrice, makeOrderNumber } from '../../lib/format';
import { describeSelection } from '../../lib/pricing';
import { load, save } from '../../lib/storage';
import Icon from '../Icon';
import WhishNumber from './WhishNumber';

const GUEST_KEY = 'talia.guest.v1';

export const paymentLabels = {
  cash: 'Cash',
  whish: 'Whish Money',
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please add your name so the team knows who ordered.';
  else if (values.name.trim().length < 2) errors.name = 'That name looks too short.';
  if (!values.table.trim()) errors.table = 'Which table are you sitting at?';
  else if (!/^[a-z0-9\- ]{1,8}$/i.test(values.table.trim())) errors.table = 'Use the number or code shown on your table.';
  if (!values.payment) errors.payment = 'Choose how you would like to pay.';
  return errors;
}

export default function DetailsStep({ onBack, onClose, onPlace }) {
  const { lines, total } = useCart();
  const whish = restaurant.ordering.payments.whishNumber;
  const remembered = load(GUEST_KEY, {});
  const [values, setValues] = useState({
    name: remembered.name ?? '',
    table: '',
    notes: '',
    payment: 'cash',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`order-${first}`)?.focus();
      return;
    }
    save(GUEST_KEY, { name: values.name.trim() });
    onPlace({
      number: makeOrderNumber(),
      createdAt: new Date().toISOString(),
      name: values.name.trim(),
      table: values.table.trim(),
      notes: values.notes.trim(),
      payment: values.payment,
      total,
      lines: lines.map((l) => ({
        name: l.item.name,
        qty: l.qty,
        unit: l.unit,
        total: l.total,
        extras: describeSelection(l.item, l.selection),
        note: l.note,
      })),
    });
  };

  return (
    <form className="order__form" onSubmit={submit} noValidate>
      <header className="order__head">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to your order">
          <Icon name="arrowLeft" size={20} />
        </button>
        <div className="order__head-text">
          <h2 id="order-title" className="order__title">
            Your table
          </h2>
          <p className="order__sub">Step 2 of 2 &middot; dine-in</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close your order">
          <Icon name="close" size={20} />
        </button>
      </header>

      <div className="order__body order__fields">
        <div className="field">
          <label htmlFor="order-name">Your name</label>
          <input
            id="order-name"
            className="input"
            autoComplete="given-name"
            value={values.name}
            onChange={set('name')}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'order-name-error' : undefined}
          />
          {errors.name && (
            <p className="field-error" id="order-name-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="order-table">Table number</label>
          <input
            id="order-table"
            className="input order__table-input"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 7"
            value={values.table}
            onChange={set('table')}
            aria-invalid={errors.table ? 'true' : undefined}
            aria-describedby={errors.table ? 'order-table-error' : 'order-table-hint'}
          />
          {errors.table ? (
            <p className="field-error" id="order-table-error">
              {errors.table}
            </p>
          ) : (
            <p className="field-hint" id="order-table-hint">
              You&rsquo;ll find it on the corner of your table.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="order-notes">
            Notes for the team <span className="optional">(optional)</span>
          </label>
          <textarea
            id="order-notes"
            className="input"
            rows={2}
            maxLength={240}
            placeholder="Allergies, timing, anything else we should know"
            value={values.notes}
            onChange={set('notes')}
          />
        </div>

        <fieldset className="field order__pay" aria-describedby={errors.payment ? 'order-payment-error' : undefined}>
          <legend id="order-payment">Payment</legend>
          <label className={`pay-option ${values.payment === 'cash' ? 'is-on' : ''}`}>
            <input type="radio" name="payment" value="cash" checked={values.payment === 'cash'} onChange={set('payment')} />
            <span>
              <strong>Cash</strong>
              <small>Pay at your table or at the counter when you&rsquo;re done.</small>
            </span>
          </label>
          {whish && (
            <label className={`pay-option ${values.payment === 'whish' ? 'is-on' : ''}`}>
              <input type="radio" name="payment" value="whish" checked={values.payment === 'whish'} onChange={set('payment')} />
              <span>
                <strong>Whish Money</strong>
                <small>Transfer the total through the Whish app and show the confirmation to our team.</small>
              </span>
            </label>
          )}
          {values.payment === 'whish' && whish && (
            <div className="order__whish">
              <p>
                Send <strong>{formatPrice(total)}</strong> to Talia&rsquo;s Whish number:
              </p>
              <WhishNumber number={whish} />
              <p className="field-hint">Our team confirms Whish transfers by hand before closing your bill.</p>
            </div>
          )}
          {errors.payment && (
            <p className="field-error" id="order-payment-error">
              {errors.payment}
            </p>
          )}
        </fieldset>
      </div>

      <footer className="order__foot">
        <dl className="order__sums">
          <div className="order__sum-total">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <button type="submit" className="btn btn--wine btn--block order__cta">
          Place order
        </button>
      </footer>
    </form>
  );
}
