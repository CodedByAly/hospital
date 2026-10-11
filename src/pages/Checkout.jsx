import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { branches, ordering, payments } from '../config/site.js';
import { useShop } from '../context/ShopContext.jsx';
import { formatCents, formatPhone, formatPrice, normalizeLebanesePhone, toCents } from '../lib/format.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { placeOrder } from '../services/orders.js';
import { CartLine, TotalsBlock, describeLine } from '../components/CartDrawer.jsx';
import CopyButton from '../components/CopyButton.jsx';
import Icon from '../components/Icon.jsx';
import './Checkout.css';

const whishFor = (branchId) => (payments.whish.enabled ? branches.find((b) => b.id === branchId)?.whish ?? null : null);
const whishAnywhere = payments.whish.enabled && branches.some((b) => b.whish);

const initial = {
  type: 'pickup',
  branchId: '',
  name: '',
  phone: '',
  pickupMode: 'asap',
  pickupTime: '',
  area: '',
  address: '',
  building: '',
  notes: '',
  payment: 'cash',
};

function validate(form, subtotalCents) {
  const errors = {};
  if (!form.branchId) errors.branchId = 'Choose the branch you’re ordering from.';
  if (form.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!form.phone.trim()) errors.phone = 'We need a number to confirm your order.';
  else if (!normalizeLebanesePhone(form.phone)) errors.phone = 'Enter a Lebanese number, e.g. 71 123 456.';
  if (form.type === 'pickup' && form.pickupMode === 'later' && !/^\d{2}:\d{2}$/.test(form.pickupTime)) {
    errors.pickupTime = 'Pick a time, or choose “As soon as possible”.';
  }
  if (form.type === 'delivery') {
    if (!form.area.trim()) errors.area = 'Which area should we deliver to?';
    if (form.address.trim().length < 5) errors.address = 'Add the street and a landmark so the driver can find you.';
    if (ordering.deliveryMinimum != null && subtotalCents < toCents(ordering.deliveryMinimum)) {
      errors.type = `Delivery starts from ${formatPrice(ordering.deliveryMinimum)}.`;
    }
  }
  if (form.payment === 'whish' && form.branchId && !whishFor(form.branchId)) {
    errors.payment = 'This branch doesn’t take Whish yet. Please choose cash.';
  }
  return errors;
}

function Field({ id, label, error, optional, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label} {optional && <span className="field__optional">optional</span>}
      </label>
      {children}
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Checkout() {
  useDocumentMeta('Checkout');
  const { lines, subtotalCents, clearCart, openCart, branchId, setBranchId } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({ ...initial, branchId: branchId ?? '' }));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const formRef = useRef(null);

  const set = (key) => (event) => {
    const next = { ...form, [key]: event.target.value };
    setForm(next);
    if (key === 'branchId') setBranchId(event.target.value);
    if (submitted) setErrors(validate(next, subtotalCents));
  };

  const feeCents = form.type === 'delivery' && ordering.deliveryFee != null ? toCents(ordering.deliveryFee) : 0;
  const totalCents = subtotalCents + feeCents;
  const availableBranches = branches.filter((b) => (form.type === 'delivery' ? b.delivery : b.pickup));
  const selectedBranch = branches.find((b) => b.id === form.branchId);
  const whishNumber = whishFor(form.branchId);
  // Whish is offered when the chosen branch has a number (or, before choosing, when any branch does).
  const whishReady = form.branchId ? Boolean(whishNumber) : whishAnywhere;

  if (lines.length === 0 && !placing) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title">Checkout</h1>
        <p>Your order is empty. Add something from the menu first.</p>
        <Link to="/menu" className="btn btn--primary">
          Browse the menu
        </Link>
      </div>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(form, subtotalCents);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = formRef.current?.querySelector('[aria-invalid="true"], .field.has-error input, .has-error [type="radio"]');
      first?.focus();
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setPlacing(true);
    const order = placeOrder({
      type: form.type,
      branchId: form.branchId,
      pickupTime: form.type === 'pickup' ? (form.pickupMode === 'asap' ? 'asap' : form.pickupTime) : null,
      payment: form.payment,
      customer: {
        name: form.name.trim(),
        phone: normalizeLebanesePhone(form.phone),
        area: form.area.trim(),
        address: form.address.trim(),
        building: form.building.trim(),
        notes: form.notes.trim(),
      },
      lines: lines.map((l) => ({
        itemId: l.itemId,
        name: l.item.name,
        image: l.item.image,
        quantity: l.quantity,
        details: describeLine(l),
        removed: l.removed,
        note: l.note,
        unitCents: l.unitCents,
        totalCents: l.totalCents,
      })),
      subtotalCents,
      deliveryFeeCents: form.type === 'delivery' ? (ordering.deliveryFee == null ? null : feeCents) : 0,
      totalCents,
    });
    clearCart();
    navigate(`/order/${order.number}`, { replace: true });
  };

  const err = (key) => (errors[key] ? { 'aria-invalid': true, 'aria-describedby': `${key}-error` } : {});

  return (
    <div className="checkout">
      <div className="container">
        <Link to="/menu" className="back-link">
          <Icon name="arrowLeft" size={16} /> Back to menu
        </Link>
        <h1 className="page-title">Checkout</h1>
      </div>

      <div className="container checkout__grid">
        <form ref={formRef} className="checkout__form" onSubmit={submit} noValidate>
          <section className="checkout__block" aria-labelledby="type-title">
            <h2 id="type-title" className="checkout__step">
              <span>1</span> How do you want it?
            </h2>
            <div className="segmented" role="radiogroup" aria-label="Order type">
              {[
                { id: 'pickup', label: 'Pickup', sub: 'Collect from the branch', icon: 'store' },
                { id: 'delivery', label: 'Delivery', sub: 'We bring it to you', icon: 'scooter' },
              ].map((opt) => (
                <label key={opt.id} className={`segmented__opt ${form.type === opt.id ? 'is-selected' : ''}`}>
                  <input type="radio" name="type" value={opt.id} checked={form.type === opt.id} onChange={set('type')} />
                  <Icon name={opt.icon} size={22} />
                  <span>
                    <strong>{opt.label}</strong>
                    <small>{opt.sub}</small>
                  </span>
                </label>
              ))}
            </div>
            {errors.type && <p className="field__error">{errors.type}</p>}
          </section>

          <section className={`checkout__block ${errors.branchId ? 'has-error' : ''}`} aria-labelledby="branch-title">
            <h2 id="branch-title" className="checkout__step">
              <span>2</span> {form.type === 'pickup' ? 'Pick up from' : 'Deliver from'}
            </h2>
            <div className="branch-picker" role="radiogroup" aria-labelledby="branch-title" aria-describedby={errors.branchId ? 'branchId-error' : undefined}>
              {availableBranches.map((b) => (
                <label key={b.id} className={`branch-opt ${form.branchId === b.id ? 'is-selected' : ''}`}>
                  <input type="radio" name="branch" value={b.id} checked={form.branchId === b.id} onChange={set('branchId')} />
                  <strong>{b.name}</strong>
                  <small>{b.address}</small>
                  <small>{formatPhone(b.phone)}</small>
                </label>
              ))}
            </div>
            {errors.branchId && (
              <p className="field__error" id="branchId-error">
                {errors.branchId}
              </p>
            )}
          </section>

          <section className="checkout__block" aria-labelledby="details-title">
            <h2 id="details-title" className="checkout__step">
              <span>3</span> Your details
            </h2>
            <div className="field-row">
              <Field id="name" label="Full name" error={errors.name}>
                <input id="name" type="text" autoComplete="name" value={form.name} onChange={set('name')} {...err('name')} />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone} hint="The branch calls or messages this number to confirm.">
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="71 123 456" value={form.phone} onChange={set('phone')} {...err('phone')} />
              </Field>
            </div>

            {form.type === 'pickup' ? (
              <fieldset className={`field ${errors.pickupTime ? 'has-error' : ''}`}>
                <legend className="field__label">Pickup time</legend>
                <div className="pill-toggle">
                  <label className={form.pickupMode === 'asap' ? 'is-selected' : ''}>
                    <input type="radio" name="pickupMode" value="asap" checked={form.pickupMode === 'asap'} onChange={set('pickupMode')} />
                    As soon as possible
                  </label>
                  <label className={form.pickupMode === 'later' ? 'is-selected' : ''}>
                    <input type="radio" name="pickupMode" value="later" checked={form.pickupMode === 'later'} onChange={set('pickupMode')} />
                    Later today
                  </label>
                </div>
                {form.pickupMode === 'later' && (
                  <input
                    id="pickupTime"
                    className="time-input"
                    type="time"
                    aria-label="Pickup time"
                    value={form.pickupTime}
                    onChange={set('pickupTime')}
                    {...err('pickupTime')}
                  />
                )}
                {errors.pickupTime && (
                  <p className="field__error" id="pickupTime-error">
                    {errors.pickupTime}
                  </p>
                )}
              </fieldset>
            ) : (
              <>
                <div className="field-row">
                  <Field id="area" label="Area" error={errors.area}>
                    <input id="area" type="text" autoComplete="address-level2" placeholder="e.g. Hamra, Ras Beirut" value={form.area} onChange={set('area')} {...err('area')} />
                  </Field>
                  <Field id="building" label="Building, floor, apartment" optional>
                    <input id="building" type="text" placeholder="e.g. Bldg 12, 3rd floor" value={form.building} onChange={set('building')} />
                  </Field>
                </div>
                <Field id="address" label="Street and landmark" error={errors.address}>
                  <textarea id="address" rows={2} autoComplete="street-address" placeholder="Street name, nearest landmark" value={form.address} onChange={set('address')} {...err('address')} />
                </Field>
              </>
            )}

            <Field id="notes" label={form.type === 'delivery' ? 'Delivery notes' : 'Order notes'} optional>
              <textarea
                id="notes"
                rows={2}
                maxLength={300}
                placeholder={form.type === 'delivery' ? 'e.g. call when you arrive, no doorbell' : 'Anything the branch should know'}
                value={form.notes}
                onChange={set('notes')}
              />
            </Field>
          </section>

          <section className="checkout__block" aria-labelledby="pay-title">
            <h2 id="pay-title" className="checkout__step">
              <span>4</span> Payment
            </h2>
            <div className="pay-options" role="radiogroup" aria-labelledby="pay-title">
              <label className={`pay-opt ${form.payment === 'cash' ? 'is-selected' : ''}`}>
                <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={set('payment')} />
                <Icon name="cash" size={24} />
                <span>
                  <strong>{form.type === 'delivery' ? 'Cash on delivery' : 'Cash at pickup'}</strong>
                  <small>{form.type === 'delivery' ? 'Pay the driver when your order arrives.' : 'Pay at the counter when you collect.'}</small>
                </span>
              </label>
              <label className={`pay-opt ${form.payment === 'whish' ? 'is-selected' : ''} ${whishReady ? '' : 'is-disabled'}`}>
                <input type="radio" name="payment" value="whish" checked={form.payment === 'whish'} onChange={set('payment')} disabled={!whishReady} />
                <img className="pay-opt__logo" src={payments.whish.logo} alt="" width="40" height="40" />
                <span>
                  <strong>Whish Money</strong>
                  <small>{whishReady ? 'Transfer from your Whish app before we prepare your order.' : 'Not available at this branch yet. Please pay cash.'}</small>
                </span>
              </label>
            </div>
            {errors.payment && <p className="field__error">{errors.payment}</p>}

            {form.payment === 'whish' && whishReady && !whishNumber && (
              <p className="whish-panel whish-panel--hint">Choose your branch above to see its Whish number.</p>
            )}
            {form.payment === 'whish' && whishNumber && (
              <div className="whish-panel">
                <div className="whish-panel__brand">
                  <img src={payments.whish.logo} alt="Whish Money" width="44" height="44" />
                  <p className="whish-panel__label">Send {formatCents(totalCents)} to Zaher’s {selectedBranch?.name}</p>
                </div>
                <div className="whish-panel__number">
                  <span>{formatPhone(whishNumber)}</span>
                  <CopyButton text={whishNumber} label="Copy number" />
                </div>
                <p className="whish-panel__name">Same number as the branch’s WhatsApp</p>
                <ol className="whish-panel__steps">
                  <li>Open Whish Money and send the total to the number above.</li>
                  <li>Place your order below. You’ll get an order number.</li>
                  <li>Send a screenshot of the transfer with your order number to this same number on WhatsApp.</li>
                </ol>
                <p className="whish-panel__note">
                  Payments are checked by the branch, not automatically. Your order is prepared once the transfer is confirmed.
                  {form.type === 'delivery' && ordering.deliveryFee == null && ' If a delivery fee applies, the branch will tell you before sending your order.'}
                </p>
              </div>
            )}
          </section>

          <div className="checkout__submit">
            <div className="checkout__submit-total">
              <span>Total{form.type === 'delivery' && ordering.deliveryFee == null ? ' before delivery' : ''}</span>
              <strong>{formatCents(totalCents)}</strong>
            </div>
            <button type="submit" className="btn btn--primary btn--lg">
              Place order
            </button>
          </div>
          {submitted && Object.keys(errors).length > 0 && (
            <p className="checkout__error-summary" role="alert">
              Please check the highlighted fields.
            </p>
          )}
        </form>

        <aside className={`checkout__summary ${summaryOpen ? 'is-open' : ''}`} aria-label="Order summary">
          <button type="button" className="checkout__summary-toggle" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen}>
            <span>{summaryOpen ? 'Hide' : 'Show'} order summary</span>
            <strong>{formatCents(totalCents)}</strong>
          </button>
          <div className="checkout__summary-body">
            <div className="checkout__summary-head">
              <h2>Your order</h2>
              <button type="button" className="text-btn" onClick={openCart}>
                <Icon name="edit" size={16} /> Edit
              </button>
            </div>
            <ul className="checkout__lines">
              {lines.map((line) => (
                <CartLine key={line.key} line={line} compact />
              ))}
            </ul>
            <TotalsBlock subtotalCents={subtotalCents} orderType={form.type} />
          </div>
        </aside>
      </div>
    </div>
  );
}
