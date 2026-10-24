import { useEffect, useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, WhatsAppIcon } from '../components/Icons';
import WhishPanel from '../components/WhishPanel';
import { useCart } from '../context/CartContext';
import { restaurant } from '../data/restaurant';
import useDocumentMeta from '../hooks/useDocumentMeta';
import { describeLine } from '../lib/cartLine';
import { cents, money, pluralize } from '../lib/format';
import { buildOrder, orderWhatsappLink, paymentLabel, saveOrder, submitOrder } from '../lib/order';
import { readJSON, writeJSON } from '../lib/storage';
import './Checkout.css';

const DETAILS_KEY = 'cb.customer';
const { ordering } = restaurant;

const emptyForm = {
  name: '',
  phone: '',
  area: '',
  address: '',
  building: '',
  notes: '',
  pickupMode: 'asap',
  pickupTime: '',
};

// Accepts 70 123 456, 03 123 456, 03123456, +961 70 123 456, 00961…
export function isValidLebanesePhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00961')) digits = digits.slice(5);
  else if (digits.startsWith('961')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return /^\d{7,8}$/.test(digits);
}

function validate(form, type) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!form.phone.trim()) errors.phone = 'We need a number to confirm your order.';
  else if (!isValidLebanesePhone(form.phone)) errors.phone = 'Enter a Lebanese number, e.g. 70 123 456.';
  if (type === 'delivery') {
    if (!form.area.trim()) errors.area = 'Which area should we deliver to?';
    if (form.address.trim().length < 4) errors.address = 'Add a street and a landmark so the driver can find you.';
  } else if (form.pickupMode === 'later') {
    if (!form.pickupTime) errors.pickupTime = 'Choose a pickup time.';
    else if (minutesFromNow(form.pickupTime) < 15) errors.pickupTime = 'Pick a time at least 15 minutes from now.';
  }
  return errors;
}

function minutesFromNow(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const t = new Date(now);
  t.setHours(h, m, 0, 0);
  return (t - now) / 60000;
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function Checkout() {
  useDocumentMeta('Checkout', 'Complete your Chicago Burgers order for pickup or delivery.');
  const { lines, subtotal, count, clear, openCart } = useCart();
  const navigate = useNavigate();
  const ids = useId();
  const formRef = useRef(null);

  const [type, setType] = useState(ordering.delivery ? 'delivery' : 'pickup');
  const [payment, setPayment] = useState('cash');
  const [form, setForm] = useState(() => ({ ...emptyForm, ...readJSON(DETAILS_KEY, {}) }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);

  const fee = type === 'delivery' ? ordering.deliveryFee : 0;
  const total = cents(subtotal + (fee || 0));
  const feeUnknown = type === 'delivery' && fee == null;

  // Re-check fields the customer has already visited when the order type changes.
  useEffect(() => {
    setErrors((prev) => {
      const next = validate(form, type);
      return Object.fromEntries(Object.entries(next).filter(([k]) => touched[k] || prev[k]));
    });
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key) => (e) => {
    const next = { ...form, [key]: e.target.value };
    setForm(next);
    if (touched[key]) setErrors((errs) => ({ ...errs, [key]: validate(next, type)[key] }));
  };
  const blur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((errs) => ({ ...errs, [key]: validate(form, type)[key] }));
  };

  const fieldProps = (key) => ({
    id: `${ids}-${key}`,
    name: key,
    value: form[key],
    onChange: set(key),
    onBlur: blur(key),
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${ids}-${key}-err` : undefined,
  });

  const errorFor = (key) =>
    errors[key] ? (
      <p className="field__error" id={`${ids}-${key}-err`}>
        {errors[key]}
      </p>
    ) : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form, type);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(found).map((k) => [k, true])));
    if (Object.keys(found).length) {
      const first = formRef.current.querySelector('[aria-invalid="true"]') || formRef.current.querySelector(`#${CSS.escape(`${ids}-${Object.keys(found)[0]}`)}`);
      first?.focus();
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const customer = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      ...(type === 'delivery'
        ? { area: form.area.trim(), address: form.address.trim(), building: form.building.trim() }
        : { pickupTime: form.pickupMode === 'asap' ? 'asap' : formatTime(form.pickupTime) }),
    };
    const order = buildOrder({ type, payment, customer, lines, subtotal });

    // Remember contact details for next time (never payment data).
    writeJSON(DETAILS_KEY, {
      name: form.name,
      phone: form.phone,
      area: form.area,
      address: form.address,
      building: form.building,
    });

    setSubmitError('');
    if (!ordering.orderEndpoint) {
      // Open WhatsApp straight from the click so browsers don't block it.
      window.open(orderWhatsappLink(order), '_blank', 'noopener');
      saveOrder({ ...order, channel: 'whatsapp' });
      clear();
      navigate(`/order/${order.number}`, { replace: true });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitOrder(order);
      saveOrder({ ...order, channel: result.channel });
      clear();
      navigate(`/order/${order.number}`, { replace: true });
    } catch {
      setSubmitError('We couldn’t send your order. Please try again, or send it to us on WhatsApp.');
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="checkout checkout--empty container">
        <h1 className="display h2">Your order is empty</h1>
        <p className="lede">Add something from the menu first, then come back here to check out.</p>
        <Link to="/menu" className="btn btn--dark btn--lg">
          Go to the menu <ArrowRightIcon size={18} />
        </Link>
      </div>
    );
  }

  const summary = (
    <div className="summary">
      <ul className="summary__lines">
        {lines.map((l) => {
          const details = describeLine(l);
          return (
            <li key={l.key} className="summary__line">
              <span className="summary__qty">{l.qty}×</span>
              <span className="summary__name">
                {l.item.name}
                {details.length > 0 && <small>{details.join(' · ')}</small>}
                {l.note && <small>“{l.note}”</small>}
              </span>
              <span className="summary__price">{money(l.total)}</span>
            </li>
          );
        })}
      </ul>
      <button type="button" className="summary__edit text-link" onClick={openCart}>
        Edit order
      </button>
      <dl className="totals summary__totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        {type === 'delivery' && (
          <div className="totals__muted">
            <dt>Delivery</dt>
            <dd>{fee == null ? 'Confirmed on WhatsApp' : fee === 0 ? 'Free' : money(fee)}</dd>
          </div>
        )}
        <div className="totals__grand">
          <dt>Total</dt>
          <dd>
            {money(total)}
            {feeUnknown && <small> + delivery</small>}
          </dd>
        </div>
      </dl>
    </div>
  );

  return (
    <div className="checkout container">
      <div className="checkout__top">
        <Link to="/menu" className="checkout__back">
          <ArrowLeftIcon size={18} /> Back to menu
        </Link>
        <h1 className="display h2">Checkout</h1>
      </div>

      {/* Phones: collapsible summary above the form */}
      <div className="checkout__mobile-summary">
        <button type="button" className="mobile-summary__toggle" aria-expanded={summaryOpen} onClick={() => setSummaryOpen((o) => !o)}>
          <span>
            {summaryOpen ? 'Hide' : 'Show'} order · {pluralize(count, 'item')}
          </span>
          <span className="mobile-summary__total">
            {money(total)}
            <ChevronDownIcon size={18} className={summaryOpen ? 'is-flipped' : ''} />
          </span>
        </button>
        <div className={`mobile-summary__body ${summaryOpen ? 'is-open' : ''}`}>
          <div>{summary}</div>
        </div>
      </div>

      <div className="checkout__grid">
        <form ref={formRef} className="checkout__form" onSubmit={onSubmit} noValidate>
          {/* Order type */}
          {ordering.delivery && ordering.pickup && (
            <section className="co-block" aria-labelledby={`${ids}-type`}>
              <h2 id={`${ids}-type`} className="co-block__title">
                <span className="co-block__num">1</span> How do you want it?
              </h2>
              <div className="segmented" role="radiogroup" aria-labelledby={`${ids}-type`}>
                {[
                  ['delivery', 'Delivery', 'We bring it to you'],
                  ['pickup', 'Pickup', 'Collect from Gallery Semaan'],
                ].map(([value, label, hint]) => (
                  <label key={value} className={`segmented__opt ${type === value ? 'is-on' : ''}`}>
                    <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} />
                    <span className="segmented__label">{label}</span>
                    <span className="segmented__hint">{hint}</span>
                  </label>
                ))}
                <span className="segmented__thumb" style={{ '--i': type === 'delivery' ? 0 : 1 }} aria-hidden="true" />
              </div>
            </section>
          )}

          {/* Details */}
          <section className="co-block" aria-labelledby={`${ids}-details`}>
            <h2 id={`${ids}-details`} className="co-block__title">
              <span className="co-block__num">2</span> Your details
            </h2>
            <div className="co-fields">
              <div className="field">
                <label className="field__label" htmlFor={`${ids}-name`}>
                  Name
                </label>
                <input className="input" type="text" autoComplete="name" {...fieldProps('name')} />
                {errorFor('name')}
              </div>
              <div className="field">
                <label className="field__label" htmlFor={`${ids}-phone`}>
                  Phone number
                </label>
                <input className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="70 123 456" {...fieldProps('phone')} />
                {errorFor('phone')}
              </div>

              {type === 'delivery' ? (
                <>
                  <div className="field">
                    <label className="field__label" htmlFor={`${ids}-area`}>
                      Area
                    </label>
                    {ordering.deliveryAreas.length ? (
                      <select className="input" {...fieldProps('area')}>
                        <option value="">Choose your area</option>
                        {ordering.deliveryAreas.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input className="input" type="text" autoComplete="address-level2" placeholder="Your neighbourhood" {...fieldProps('area')} />
                    )}
                    {errorFor('area')}
                  </div>
                  <div className="field field--wide">
                    <label className="field__label" htmlFor={`${ids}-address`}>
                      Street &amp; landmark
                    </label>
                    <input className="input" type="text" autoComplete="street-address" placeholder="Street name, near…" {...fieldProps('address')} />
                    {errorFor('address')}
                  </div>
                  <div className="field field--wide">
                    <label className="field__label" htmlFor={`${ids}-building`}>
                      Building, floor, apartment <span className="optional">(optional)</span>
                    </label>
                    <input className="input" type="text" placeholder="Building name, 3rd floor, apt 5" {...fieldProps('building')} />
                  </div>
                </>
              ) : (
                <fieldset className="field field--wide">
                  <legend className="field__label">Pickup time</legend>
                  <div className="pickup-time">
                    <label className={`pill ${form.pickupMode === 'asap' ? 'is-on' : ''}`}>
                      <input type="radio" name="pickupMode" value="asap" checked={form.pickupMode === 'asap'} onChange={set('pickupMode')} />
                      As soon as possible
                    </label>
                    <label className={`pill ${form.pickupMode === 'later' ? 'is-on' : ''}`}>
                      <input type="radio" name="pickupMode" value="later" checked={form.pickupMode === 'later'} onChange={set('pickupMode')} />
                      Later today
                    </label>
                    {form.pickupMode === 'later' && (
                      <div className="pickup-time__input">
                        <label className="visually-hidden" htmlFor={`${ids}-pickupTime`}>
                          Pickup time
                        </label>
                        <input className="input" type="time" step="900" {...fieldProps('pickupTime')} />
                      </div>
                    )}
                  </div>
                  {errorFor('pickupTime')}
                  <p className="field__hint">We’ll confirm the exact time on WhatsApp.</p>
                </fieldset>
              )}

              <div className="field field--wide">
                <label className="field__label" htmlFor={`${ids}-notes`}>
                  {type === 'delivery' ? 'Delivery notes' : 'Order notes'} <span className="optional">(optional)</span>
                </label>
                <textarea
                  className="input"
                  rows={3}
                  maxLength={300}
                  placeholder={type === 'delivery' ? 'Ring twice, call when you arrive, change for $50…' : 'Anything we should know?'}
                  {...fieldProps('notes')}
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="co-block" aria-labelledby={`${ids}-pay`}>
            <h2 id={`${ids}-pay`} className="co-block__title">
              <span className="co-block__num">3</span> Payment
            </h2>
            <div className="pay-options" role="radiogroup" aria-labelledby={`${ids}-pay`}>
              <label className={`pay-opt ${payment === 'cash' ? 'is-on' : ''}`}>
                <input type="radio" name="payment" value="cash" checked={payment === 'cash'} onChange={() => setPayment('cash')} />
                <span className="pay-opt__radio" aria-hidden="true" />
                <span>
                  <span className="pay-opt__name">{paymentLabel('cash', type)}</span>
                  <span className="pay-opt__hint">{type === 'delivery' ? 'Pay the driver in cash when your order arrives.' : 'Pay at the counter when you collect.'}</span>
                </span>
              </label>
              <label className={`pay-opt ${payment === 'whish' ? 'is-on' : ''}`}>
                <input type="radio" name="payment" value="whish" checked={payment === 'whish'} onChange={() => setPayment('whish')} />
                <span className="pay-opt__radio" aria-hidden="true" />
                <span>
                  <span className="pay-opt__name">Whish Money</span>
                  <span className="pay-opt__hint">Transfer from your Whish app.</span>
                </span>
              </label>
            </div>
            {payment === 'whish' && <WhishPanel amount={total} feeUnknown={feeUnknown} />}
          </section>

          {submitError && (
            <p className="checkout__error" role="alert">
              {submitError}
            </p>
          )}

          <div className="checkout__submit">
            <button type="submit" className="btn btn--whatsapp btn--lg btn--block" disabled={submitting}>
              {ordering.orderEndpoint ? (
                submitting ? 'Sending…' : `Place order · ${money(total)}`
              ) : (
                <>
                  <WhatsAppIcon size={20} /> Send order on WhatsApp
                </>
              )}
            </button>
            {!ordering.orderEndpoint && (
              <p className="checkout__submit-note">
                WhatsApp opens with your order written out. Hit send and we’ll reply to confirm.
              </p>
            )}
          </div>
        </form>

        <aside className="checkout__aside" aria-label="Order summary">
          <div className="checkout__aside-inner">
            <h2 className="display checkout__aside-title">Your order</h2>
            {summary}
          </div>
        </aside>
      </div>
    </div>
  );
}
