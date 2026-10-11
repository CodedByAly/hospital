import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { restaurant } from '../config/restaurant';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatPrice, localized } from '../lib/format';
import { createOrderNumber, orderMessage, saveOrder, snapshotLines } from '../lib/order';
import { hasWhatsApp, openWhatsApp } from '../lib/whatsapp';
import { CartTotals, LineOptions } from '../components/CartDrawer';
import FoodImage from '../components/FoodImage';
import Icon from '../components/Icon';

const phoneDigits = (v) => v.replace(/\D/g, '');

function Field({ id, label, error, hint, optional, children }) {
  const { t } = useLanguage();
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? <span className="option-group__badge option-group__badge--muted">{t.common.optional}</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="field-hint" id={`${id}-hint`}>{hint}</p> : null}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceCard({ name, value, checked, onChange, icon, title, hint, disabled, badge }) {
  return (
    <label className={`choice-card ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} />
      <Icon name={icon} size={24} className="choice-card__icon" />
      <span className="choice-card__text">
        <span className="choice-card__title">
          {title}
          {badge ? <span className="tag">{badge}</span> : null}
        </span>
        <span className="choice-card__hint">{hint}</span>
      </span>
      <span className="choice-card__radio" aria-hidden="true" />
    </label>
  );
}

function WhishPanel({ total }) {
  const { t, lang } = useLanguage();
  const [copied, setCopied] = useState(false);
  const number = restaurant.whish.number;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the number stays visible to copy manually */
    }
  };

  return (
    <div className="whish">
      <div className="whish__number">
        <div>
          <span className="whish__label">{t.checkout.whishNumber}</span>
          <span className="whish__value" dir="ltr">{number}</span>
          <span className="whish__account">
            {t.checkout.whishAccount}: {restaurant.whish.accountName}
          </span>
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={16} />
          <span aria-live="polite">{copied ? t.common.copied : t.common.copy}</span>
        </button>
      </div>
      <ol className="whish__steps">
        {t.checkout.whishSteps.map((s, i) => (
          <li key={i}>{i === 0 ? `${s} (${formatPrice(total, lang)})` : s}</li>
        ))}
      </ol>
      <p className="whish__note">{t.checkout.whishManual}</p>
    </div>
  );
}

export default function Checkout() {
  const { t, lang } = useLanguage();
  usePageMeta(t.checkout.title);
  const navigate = useNavigate();
  const { lines, subtotal, clear } = useCart();
  const { openCart } = useUI();
  const formRef = useRef(null);
  const whishReady = Boolean(restaurant.whish.number);

  const [type, setType] = useState(restaurant.services.delivery ? 'delivery' : 'pickup');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    asap: true,
    time: '',
    area: '',
    address: '',
    floor: '',
    notes: '',
  });
  const [payment, setPayment] = useState('cash');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!lines.length && !busy) {
    return (
      <div className="container page-pad">
        <div className="empty-state empty-state--page">
          <Icon name="bag" size={44} strokeWidth={1.2} />
          <h1 className="empty-state__title">{t.checkout.emptyTitle}</h1>
          <p>{t.cart.emptyText}</p>
          <Link to="/menu" className="btn btn--primary">{t.cart.browse}</Link>
        </div>
      </div>
    );
  }

  const fee = type === 'delivery' ? restaurant.deliveryFee : 0;
  const total = subtotal + (fee ?? 0);

  const validate = (values = form, orderType = type, pay = payment) => {
    const e = {};
    if (values.name.trim().length < 2) e.name = t.checkout.errors.name;
    const digits = phoneDigits(values.phone);
    if (digits.length < 7 || digits.length > 15) e.phone = t.checkout.errors.phone;
    if (orderType === 'pickup' && !values.asap && !values.time) e.time = t.checkout.errors.time;
    if (orderType === 'delivery') {
      if (!values.area.trim()) e.area = t.checkout.errors.area;
      if (values.address.trim().length < 4) e.address = t.checkout.errors.address;
    }
    if (pay === 'whish' && !whishReady) e.payment = t.checkout.errors.payment;
    return e;
  };

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  };

  const changeType = (next) => {
    setType(next);
    if (submitted) setErrors(validate(form, next));
  };

  const aria = (key, hint) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `co-${key}-error` : hint ? `co-${key}-hint` : undefined,
  });

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = formRef.current?.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    setBusy(true);
    const order = {
      id: createOrderNumber(),
      createdAt: new Date().toISOString(),
      lang,
      type,
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      pickup: type === 'pickup' ? { asap: form.asap, time: form.asap ? null : form.time } : null,
      delivery:
        type === 'delivery'
          ? { area: form.area.trim(), address: form.address.trim(), floor: form.floor.trim() }
          : null,
      notes: form.notes.trim(),
      payment,
      lines: snapshotLines(lines),
      subtotal,
      deliveryFee: type === 'delivery' ? restaurant.deliveryFee : 0,
      total,
    };

    saveOrder(order);
    // Opened synchronously inside the submit handler so browsers treat it as user-initiated.
    if (hasWhatsApp) openWhatsApp(orderMessage(order, lang));
    clear();
    navigate(`/order/${order.id}`, { replace: true });
  };

  const isDelivery = type === 'delivery';

  return (
    <div className="checkout container page-pad">
      <h1 className="page-title">{t.checkout.title}</h1>

      <div className="checkout__grid">
        <form ref={formRef} className="checkout__form" onSubmit={submit} noValidate>
          {submitted && Object.keys(errors).length ? (
            <div className="alert" role="alert">
              {t.checkout.errors.summary}
            </div>
          ) : null}

          <fieldset className="checkout__block">
            <legend className="block-title">
              <span className="block-title__num">1</span>
              {t.checkout.howTitle}
            </legend>
            <div className="choice-grid">
              {restaurant.services.delivery ? (
                <ChoiceCard
                  name="type"
                  value="delivery"
                  checked={isDelivery}
                  onChange={() => changeType('delivery')}
                  icon="scooter"
                  title={t.checkout.delivery}
                  hint={localized(restaurant.deliveryArea, lang)}
                />
              ) : null}
              {restaurant.services.pickup ? (
                <ChoiceCard
                  name="type"
                  value="pickup"
                  checked={!isDelivery}
                  onChange={() => changeType('pickup')}
                  icon="store"
                  title={t.checkout.pickup}
                  hint={localized(restaurant.address, lang)}
                />
              ) : null}
            </div>
          </fieldset>

          <fieldset className="checkout__block">
            <legend className="block-title">
              <span className="block-title__num">2</span>
              {t.checkout.detailsTitle}
            </legend>
            <div className="field-grid">
              <Field id="co-name" label={t.checkout.name} error={errors.name}>
                <input id="co-name" className="input" autoComplete="name" value={form.name} onChange={set('name')} {...aria('name')} />
              </Field>
              <Field id="co-phone" label={t.checkout.phone} error={errors.phone} hint={t.checkout.phoneHint}>
                <input
                  id="co-phone"
                  className="input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={set('phone')}
                  {...aria('phone', true)}
                />
              </Field>
            </div>

            {isDelivery ? (
              <div className="field-grid reveal-in" key="delivery">
                <Field id="co-area" label={t.checkout.area} error={errors.area}>
                  <input
                    id="co-area"
                    className="input"
                    autoComplete="address-level3"
                    placeholder={t.checkout.areaPlaceholder}
                    value={form.area}
                    onChange={set('area')}
                    {...aria('area')}
                  />
                </Field>
                <Field id="co-floor" label={t.checkout.floor} optional>
                  <input id="co-floor" className="input" placeholder={t.checkout.floorPlaceholder} value={form.floor} onChange={set('floor')} />
                </Field>
                <div className="field-grid__full">
                  <Field id="co-address" label={t.checkout.address} error={errors.address}>
                    <input
                      id="co-address"
                      className="input"
                      autoComplete="street-address"
                      placeholder={t.checkout.addressPlaceholder}
                      value={form.address}
                      onChange={set('address')}
                      {...aria('address')}
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <div className="reveal-in" key="pickup">
                <fieldset className="field">
                  <legend className="field-label">{t.checkout.pickupTime}</legend>
                  <div className="segmented">
                    <label className={form.asap ? 'is-checked' : ''}>
                      <input type="radio" name="when" checked={form.asap} onChange={() => setForm({ ...form, asap: true })} />
                      {t.checkout.asap}
                    </label>
                    <label className={!form.asap ? 'is-checked' : ''}>
                      <input type="radio" name="when" checked={!form.asap} onChange={() => setForm({ ...form, asap: false })} />
                      {t.checkout.scheduled}
                    </label>
                  </div>
                </fieldset>
                {!form.asap ? (
                  <Field id="co-time" label={t.checkout.time} error={errors.time}>
                    <input id="co-time" className="input input--time" type="time" dir="ltr" value={form.time} onChange={set('time')} {...aria('time')} />
                  </Field>
                ) : null}
              </div>
            )}

            <Field id="co-notes" label={isDelivery ? t.checkout.deliveryNotes : t.checkout.orderNotes} optional>
              <textarea
                id="co-notes"
                className="input"
                rows={3}
                maxLength={300}
                placeholder={t.checkout.notesPlaceholder}
                value={form.notes}
                onChange={set('notes')}
              />
            </Field>
          </fieldset>

          <fieldset className="checkout__block" aria-describedby={errors.payment ? 'co-payment-error' : undefined}>
            <legend className="block-title">
              <span className="block-title__num">3</span>
              {t.checkout.paymentTitle}
            </legend>
            <div className="choice-grid">
              <ChoiceCard
                name="payment"
                value="cash"
                checked={payment === 'cash'}
                onChange={() => setPayment('cash')}
                icon="cash"
                title={isDelivery ? t.checkout.cashDelivery : t.checkout.cashPickup}
                hint={t.checkout.cashHint}
              />
              <ChoiceCard
                name="payment"
                value="whish"
                checked={payment === 'whish'}
                onChange={() => setPayment('whish')}
                icon="wallet"
                title={t.checkout.whish}
                hint={t.checkout.whishHint}
                disabled={!whishReady}
                badge={whishReady ? null : t.checkout.whishUnavailable}
              />
            </div>
            {errors.payment ? <p className="field-error" id="co-payment-error">{errors.payment}</p> : null}
            {payment === 'whish' && whishReady ? <WhishPanel total={total} /> : null}
          </fieldset>

          <div className="checkout__submit">
            <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={busy}>
              {busy ? t.checkout.placing : t.checkout.place}
              <span className="btn__price">{formatPrice(total, lang)}</span>
            </button>
            {hasWhatsApp ? (
              <p className="checkout__note">
                <Icon name="whatsapp" size={18} />
                {t.checkout.placeNote}
              </p>
            ) : null}
          </div>
        </form>

        <aside className="checkout__summary" aria-labelledby="summary-title">
          <div className="summary">
            <div className="summary__head">
              <h2 id="summary-title" className="summary__title">{t.checkout.summaryTitle}</h2>
              <button type="button" className="text-button" onClick={openCart}>
                {t.checkout.edit}
              </button>
            </div>
            <ul className="summary__lines">
              {lines.map((l) => (
                <li key={l.key} className="summary__line">
                  <FoodImage src={l.item.image} alt="" className="summary__img" />
                  <div className="summary__info">
                    <p className="summary__name">
                      <span className="summary__qty">{l.qty}×</span> {localized(l.item.name, lang)}
                    </p>
                    <LineOptions line={l} />
                  </div>
                  <p className="summary__price">{formatPrice(l.unit * l.qty, lang)}</p>
                </li>
              ))}
            </ul>
            <CartTotals subtotal={subtotal} delivery={isDelivery} />
          </div>
        </aside>
      </div>
    </div>
  );
}
