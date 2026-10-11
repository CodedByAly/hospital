import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, deliveryFeeFor, unitPrice, lineName } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import useDocumentMeta from '../hooks/useDocumentMeta';
import restaurant from '../config/restaurant';
import { formatPrice, isValidLebanesePhone } from '../lib/format';
import { createOrder, saveOrder, saveCustomer, loadCustomer, orderWhatsAppLink, submitOrder } from '../lib/order';
import { LineDetails } from '../components/CartDrawer';
import Field from '../components/Field';
import CopyButton from '../components/CopyButton';
import Icon from '../components/Icon';

const whish = restaurant.payments.whish;

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function validate(form) {
  const e = {};
  if (!form.name.trim()) e.name = 'Please enter your name.';
  if (!isValidLebanesePhone(form.phone)) e.phone = 'Enter a valid Lebanese number, e.g. 70 123 456.';
  if (form.type === 'pickup' && form.when === 'later') {
    if (!form.time) e.time = 'Pick a time for pickup.';
    else if (form.time <= nowHHMM()) e.time = 'Pick a time later than now.';
  }
  if (form.type === 'delivery') {
    if (!form.area.trim()) e.area = 'Tell us your area.';
    if (!form.address.trim()) e.address = 'We need an address to deliver.';
  }
  return e;
}

export default function Checkout() {
  useDocumentMeta('Checkout', 'Complete your Khalifa Bites order for pickup or delivery.');
  const { lines, subtotal, clear } = useCart();
  const { openCart } = useUI();
  const navigate = useNavigate();
  const saved = useMemo(loadCustomer, []);
  const [form, setForm] = useState({
    type: 'pickup',
    name: saved.name || '',
    phone: saved.phone || '',
    when: 'asap',
    time: '',
    area: saved.area || '',
    address: saved.address || '',
    building: saved.building || '',
    notes: '',
    payment: 'cash',
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const formRef = useRef(null);

  const errors = validate(form);
  const shown = (k) => (submitted || touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setTouched((x) => ({ ...x, [k]: true }));
  const fee = deliveryFeeFor(form.type);
  const total = subtotal + (fee || 0);

  if (!lines.length && !busy) {
    return (
      <div className="container narrow-page empty-state">
        <span className="empty-state__icon" aria-hidden="true"><Icon name="bag" size={36} /></span>
        <h1 className="page-title">Nothing to check out yet</h1>
        <p>Your cart is empty. Add a few things from the menu first.</p>
        <Link to="/menu" className="btn btn--primary">Browse the menu</Link>
      </div>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setBusy(true);
    const order = createOrder(form, lines);
    saveOrder(order);
    saveCustomer(form);
    submitOrder(order); // optional backend; WhatsApp is the main channel
    // Opened inside the click so browsers don't block it.
    window.open(orderWhatsAppLink(order), '_blank', 'noopener');
    clear();
    navigate(`/order/${order.id}`, { replace: true });
  };

  const hasErrors = submitted && Object.keys(errors).length > 0;

  return (
    <div className="checkout">
      <div className="container">
        <header className="checkout__head">
          <Link to="/menu" className="back-link">
            <Icon name="arrow" size={18} className="back-link__icon" /> Back to menu
          </Link>
          <h1 className="page-title">Checkout</h1>
        </header>

        <form id="checkout-form" ref={formRef} className="checkout__grid" onSubmit={onSubmit} noValidate>
          <div className="checkout__main">
            {hasErrors && (
              <div className="form-alert" role="alert">
                <Icon name="alert" size={20} /> A few details need fixing before we can send your order.
              </div>
            )}

            <fieldset className="checkout__step">
              <legend className="checkout__step-title"><span className="checkout__num">1</span>Pickup or delivery?</legend>
              <div className="segmented">
                <ChoiceCard name="type" value="pickup" checked={form.type === 'pickup'} onChange={set('type')} icon="store" title="Pickup" hint="Collect from us in Saida" />
                <ChoiceCard name="type" value="delivery" checked={form.type === 'delivery'} onChange={set('type')} icon="truck" title="Delivery" hint="We bring it to your door" />
              </div>
            </fieldset>

            <fieldset className="checkout__step">
              <legend className="checkout__step-title"><span className="checkout__num">2</span>Your details</legend>
              <div className="form-grid">
                <Field label="Full name" required error={shown('name')}>
                  <input className="field__input" type="text" autoComplete="name" value={form.name} onChange={set('name')} onBlur={blur('name')} maxLength={80} />
                </Field>
                <Field label="Phone number" required hint="We’ll call or WhatsApp this number to confirm." error={shown('phone')}>
                  <input className="field__input" type="tel" inputMode="tel" autoComplete="tel" placeholder="70 123 456" value={form.phone} onChange={set('phone')} onBlur={blur('phone')} maxLength={20} />
                </Field>

                {form.type === 'pickup' ? (
                  <div className="field field--full">
                    <span className="field__label" id="when-label">Pickup time</span>
                    <div className="pill-toggle" role="radiogroup" aria-labelledby="when-label">
                      {[['asap', 'As soon as it’s ready'], ['later', 'Later today']].map(([v, label]) => (
                        <label key={v} className={`pill-toggle__opt ${form.when === v ? 'is-on' : ''}`}>
                          <input type="radio" name="when" value={v} checked={form.when === v} onChange={set('when')} />
                          {label}
                        </label>
                      ))}
                    </div>
                    {form.when === 'later' && (
                      <Field label="Time" required error={shown('time')} className="field--time">
                        <input className="field__input" type="time" value={form.time} onChange={set('time')} onBlur={blur('time')} min={nowHHMM()} />
                      </Field>
                    )}
                  </div>
                ) : (
                  <>
                    <Field label="Area / town" required error={shown('area')}>
                      <input className="field__input" type="text" autoComplete="address-level2" placeholder="e.g. Saida" value={form.area} onChange={set('area')} onBlur={blur('area')} maxLength={60} />
                    </Field>
                    <Field label="Street address" required error={shown('address')}>
                      <input className="field__input" type="text" autoComplete="street-address" placeholder="Street, nearby landmark" value={form.address} onChange={set('address')} onBlur={blur('address')} maxLength={140} />
                    </Field>
                    <Field label="Building, floor, apartment" className="field--full">
                      <input className="field__input" type="text" placeholder="Optional" value={form.building} onChange={set('building')} maxLength={80} />
                    </Field>
                  </>
                )}

                <Field label={form.type === 'delivery' ? 'Delivery notes' : 'Order notes'} className="field--full">
                  <textarea className="field__input field__input--area" rows={3} placeholder="Optional" value={form.notes} onChange={set('notes')} maxLength={300} />
                </Field>
              </div>
            </fieldset>

            <fieldset className="checkout__step">
              <legend className="checkout__step-title"><span className="checkout__num">3</span>Payment</legend>
              <div className="segmented">
                <ChoiceCard
                  name="payment"
                  value="cash"
                  checked={form.payment === 'cash'}
                  onChange={set('payment')}
                  icon="cash"
                  title={form.type === 'delivery' ? 'Cash on delivery' : 'Cash on pickup'}
                  hint="Pay when you get your order."
                />
                <ChoiceCard
                  name="payment"
                  value="whish"
                  checked={form.payment === 'whish'}
                  onChange={set('payment')}
                  icon="wallet"
                  title="Whish Money"
                  hint={whish ? 'Transfer to our Whish account' : 'Not available online yet — please choose cash.'}
                  disabled={!whish}
                />
              </div>
              {form.payment === 'whish' && whish && (
                <div className="whish">
                  <div className="whish__number">
                    <div>
                      <p className="whish__label">Our Whish number</p>
                      <p className="whish__value">{whish.display}</p>
                    </div>
                    <CopyButton text={whish.raw || whish.display} />
                  </div>
                  <p className="whish__how">How it works</p>
                  <ol className="whish__steps">
                    <li>Send {formatPrice(total)} to the Whish number above.</li>
                    <li>Send your order on WhatsApp (next step) with the transfer screenshot.</li>
                    <li>We confirm once we see the transfer, then your order goes to the kitchen.</li>
                  </ol>
                  <p className="whish__note">Transfers are checked by hand — there’s no automatic payment verification.</p>
                </div>
              )}
            </fieldset>
          </div>

          <aside className="checkout__aside" aria-labelledby="summary-title">
            <div className="summary">
              <div className="summary__head">
                <h2 id="summary-title" className="summary__title">Order summary</h2>
                <button type="button" className="link-btn" onClick={openCart}>
                  <Icon name="edit" size={16} /> Edit
                </button>
              </div>
              <ul className="summary__lines">
                {lines.map((l) => (
                  <li key={l.key} className="summary__line">
                    <span className="summary__qty">{l.qty}×</span>
                    <span className="summary__name">
                      {lineName(l)}
                      <LineDetails line={l} />
                    </span>
                    <span>{formatPrice(unitPrice(l) * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="totals">
                <div className="totals__row"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
                {form.type === 'delivery' && (
                  <div className="totals__row">
                    <dt>Delivery</dt>
                    <dd>{fee == null ? <span className="totals__tbd">Confirmed on WhatsApp</span> : formatPrice(fee)}</dd>
                  </div>
                )}
                <div className="totals__row totals__row--grand"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>
              <button type="submit" className="btn btn--whatsapp btn--block btn--lg" disabled={busy}>
                <Icon name="whatsapp" size={21} />
                {busy ? 'Preparing your order…' : 'Send order on WhatsApp'}
              </button>
              <p className="summary__hint">WhatsApp opens with your order written out. Press send and we’ll confirm.</p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function ChoiceCard({ name, value, checked, onChange, icon, title, hint, disabled }) {
  return (
    <label className={`choice ${checked ? 'is-on' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} />
      <span className="choice__icon"><Icon name={icon} size={24} /></span>
      <span className="choice__text">
        <span className="choice__title">{title}</span>
        <span className="choice__hint">{hint}</span>
      </span>
      <span className="choice__radio" aria-hidden="true" />
    </label>
  );
}
