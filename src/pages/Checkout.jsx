import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart, deliveryFeeFor, unitPrice } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import useDocumentMeta from '../hooks/useDocumentMeta';
import restaurant from '../config/restaurant';
import { itemsById } from '../data/menu';
import { formatPrice, isValidLebanesePhone, tr } from '../lib/format';
import { createOrder, saveOrder, saveCustomer, loadCustomer, orderWhatsAppLink, submitOrder } from '../lib/order';
import { LineDetails } from '../components/CartDrawer';
import Field from '../components/Field';
import Price from '../components/Price';
import CopyButton from '../components/CopyButton';
import Icon from '../components/Icon';

const whish = restaurant.payments.whish;

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function validate(form, t) {
  const e = {};
  if (!form.name.trim()) e.name = t.checkout.errors.name;
  if (!isValidLebanesePhone(form.phone)) e.phone = t.checkout.errors.phone;
  if (form.type === 'pickup' && form.when === 'later') {
    if (!form.time) e.time = t.checkout.errors.time;
    else if (form.time <= nowHHMM()) e.time = t.checkout.errors.timePast;
  }
  if (form.type === 'delivery') {
    if (!form.area.trim()) e.area = t.checkout.errors.area;
    if (!form.address.trim()) e.address = t.checkout.errors.address;
  }
  return e;
}

export default function Checkout() {
  const { t, lang } = useLanguage();
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  useDocumentMeta(t.meta.checkout, t.meta.homeDescription);

  const saved = useMemo(loadCustomer, []);
  const [form, setForm] = useState({
    type: restaurant.ordering.pickup ? 'pickup' : 'delivery',
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

  const errors = validate(form, t);
  const shown = (k) => (submitted || touched[k] ? errors[k] : undefined);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setTouched((x) => ({ ...x, [k]: true }));

  const fee = deliveryFeeFor(form.type);
  const total = subtotal + (fee || 0);

  if (!lines.length && !busy) {
    return (
      <div className="container narrow-page empty-state">
        <img src="/images/logo-shrimp.svg" alt="" className="empty-state__mark" />
        <h1 className="page-title">{t.checkout.emptyTitle}</h1>
        <p>{t.checkout.emptyHint}</p>
        <Link to="/menu" className="btn btn--primary">
          {t.cart.browse}
        </Link>
      </div>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      // Bring the first problem into view and focus it.
      requestAnimationFrame(() => {
        const first = formRef.current?.querySelector('[aria-invalid="true"]');
        first?.focus();
      });
      return;
    }
    setBusy(true);
    const order = createOrder({ form, lines, lang });
    saveOrder(order);
    saveCustomer(form);
    submitOrder(order); // optional backend; WhatsApp is the main channel
    // Opened synchronously inside the click so browsers don't block it.
    window.open(orderWhatsAppLink(order), '_blank', 'noopener');
    clear();
    navigate(`/order/${order.id}`, { replace: true });
  };

  const submitErrors = submitted && Object.keys(errors).length > 0;

  return (
    <div className="checkout">
      <div className="container">
        <header className="checkout__head">
          <Link to="/menu" className="back-link">
            <Icon name="arrow" size={18} className="back-link__icon" />
            {t.nav.menu}
          </Link>
          <h1 className="page-title">{t.checkout.title}</h1>
        </header>

        <form id="checkout-form" ref={formRef} className="checkout__grid" onSubmit={onSubmit} noValidate>
          <div className="checkout__main">
            {submitErrors && (
              <div className="form-alert" role="alert">
                <Icon name="alert" size={20} />
                {t.checkout.errors.summary}
              </div>
            )}

            {/* 1 — Pickup or delivery */}
            <fieldset className="checkout__step">
              <legend className="checkout__step-title">
                <span className="checkout__num">1</span>
                {t.checkout.howTitle}
              </legend>
              <div className="segmented" role="radiogroup">
                {restaurant.ordering.pickup && (
                  <ChoiceCard name="type" value="pickup" checked={form.type === 'pickup'} onChange={set('type')} icon="store" title={t.checkout.pickup} hint={t.checkout.pickupHint} />
                )}
                {restaurant.ordering.delivery && (
                  <ChoiceCard name="type" value="delivery" checked={form.type === 'delivery'} onChange={set('type')} icon="truck" title={t.checkout.delivery} hint={t.checkout.deliveryHint} />
                )}
              </div>
            </fieldset>

            {/* 2 — Details */}
            <fieldset className="checkout__step">
              <legend className="checkout__step-title">
                <span className="checkout__num">2</span>
                {t.checkout.detailsTitle}
              </legend>
              <div className="form-grid">
                <Field label={t.checkout.name} required requiredLabel={t.checkout.required} error={shown('name')}>
                  <input className="field__input" type="text" autoComplete="name" value={form.name} onChange={set('name')} onBlur={blur('name')} maxLength={80} />
                </Field>
                <Field label={t.checkout.phone} required requiredLabel={t.checkout.required} hint={t.checkout.phoneHint} error={shown('phone')}>
                  <input className="field__input" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="70 123 456" value={form.phone} onChange={set('phone')} onBlur={blur('phone')} maxLength={20} />
                </Field>

                {form.type === 'pickup' ? (
                  <div className="field field--full">
                    <span className="field__label" id="when-label">{t.checkout.pickupTime}</span>
                    <div className="pill-toggle" role="radiogroup" aria-labelledby="when-label">
                      {['asap', 'later'].map((v) => (
                        <label key={v} className={`pill-toggle__opt ${form.when === v ? 'is-on' : ''}`}>
                          <input type="radio" name="when" value={v} checked={form.when === v} onChange={set('when')} />
                          {v === 'asap' ? t.checkout.asap : t.checkout.later}
                        </label>
                      ))}
                    </div>
                    {form.when === 'later' && (
                      <Field label={t.checkout.time} required requiredLabel={t.checkout.required} error={shown('time')} className="field--time">
                        <input className="field__input" type="time" value={form.time} onChange={set('time')} onBlur={blur('time')} min={nowHHMM()} dir="ltr" />
                      </Field>
                    )}
                  </div>
                ) : (
                  <>
                    <Field label={t.checkout.area} required requiredLabel={t.checkout.required} error={shown('area')}>
                      <input className="field__input" type="text" autoComplete="address-level2" placeholder={t.checkout.areaPlaceholder} value={form.area} onChange={set('area')} onBlur={blur('area')} maxLength={60} />
                    </Field>
                    <Field label={t.checkout.address} required requiredLabel={t.checkout.required} error={shown('address')}>
                      <input className="field__input" type="text" autoComplete="street-address" placeholder={t.checkout.addressPlaceholder} value={form.address} onChange={set('address')} onBlur={blur('address')} maxLength={140} />
                    </Field>
                    <Field label={t.checkout.building} className="field--full">
                      <input className="field__input" type="text" placeholder={t.checkout.buildingPlaceholder} value={form.building} onChange={set('building')} maxLength={80} />
                    </Field>
                  </>
                )}

                <Field label={form.type === 'delivery' ? t.checkout.deliveryNotes : t.checkout.orderNotes} className="field--full">
                  <textarea className="field__input field__input--area" rows={3} placeholder={t.checkout.notesPlaceholder} value={form.notes} onChange={set('notes')} maxLength={300} />
                </Field>
              </div>
            </fieldset>

            {/* 3 — Payment */}
            <fieldset className="checkout__step">
              <legend className="checkout__step-title">
                <span className="checkout__num">3</span>
                {t.checkout.paymentTitle}
              </legend>
              <div className="segmented">
                <ChoiceCard
                  name="payment"
                  value="cash"
                  checked={form.payment === 'cash'}
                  onChange={set('payment')}
                  icon="cash"
                  title={form.type === 'delivery' ? t.checkout.cashDelivery : t.checkout.cashPickup}
                  hint={t.checkout.cashHint}
                />
                <ChoiceCard
                  name="payment"
                  value="whish"
                  checked={form.payment === 'whish'}
                  onChange={set('payment')}
                  icon="wallet"
                  title={t.checkout.whish}
                  hint={whish ? t.checkout.whishHint : t.checkout.whishUnavailable}
                  disabled={!whish}
                />
              </div>

              {form.payment === 'whish' && whish && (
                <div className="whish">
                  <div className="whish__number">
                    <div>
                      <p className="whish__label">{t.checkout.whishNumber}</p>
                      <p className="whish__value" dir="ltr">{whish.display}</p>
                    </div>
                    <CopyButton text={whish.raw || whish.display} />
                  </div>
                  <p className="whish__how">{t.checkout.whishHow}</p>
                  <ol className="whish__steps">
                    {t.checkout.whishSteps(formatPrice(total, lang)).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  <p className="whish__note">{t.checkout.whishNote}</p>
                </div>
              )}
            </fieldset>
          </div>

          <aside className="checkout__aside" aria-labelledby="summary-title">
            <div className="summary">
              <div className="summary__head">
                <h2 id="summary-title" className="summary__title">{t.checkout.summary}</h2>
                <EditCartButton />
              </div>
              <ul className="summary__lines">
                {lines.map((l) => (
                  <li key={l.key} className="summary__line">
                    <span className="summary__qty" dir="ltr">{l.qty}×</span>
                    <span className="summary__name">
                      {tr(itemsById[l.itemId].name, lang)}
                      <LineDetails line={l} />
                    </span>
                    <Price value={unitPrice(l) * l.qty} />
                  </li>
                ))}
              </ul>
              <dl className="totals">
                <div className="totals__row">
                  <dt>{t.cart.subtotal}</dt>
                  <dd><Price value={subtotal} /></dd>
                </div>
                {form.type === 'delivery' && (
                  <div className="totals__row">
                    <dt>{t.cart.delivery}</dt>
                    <dd>{fee == null ? <span className="totals__tbd">{t.cart.deliveryTbd}</span> : <Price value={fee} />}</dd>
                  </div>
                )}
                <div className="totals__row totals__row--grand">
                  <dt>{t.cart.total}</dt>
                  <dd><Price value={total} /></dd>
                </div>
              </dl>
              <button type="submit" className="btn btn--whatsapp btn--block btn--lg" disabled={busy}>
                <Icon name="whatsapp" size={21} />
                {busy ? t.checkout.placing : t.checkout.place}
              </button>
              <p className="summary__hint">{t.checkout.placeHint}</p>
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
      <span className="choice__icon">
        <Icon name={icon} size={24} />
      </span>
      <span className="choice__text">
        <span className="choice__title">{title}</span>
        <span className="choice__hint">{hint}</span>
      </span>
      <span className="choice__radio" aria-hidden="true" />
    </label>
  );
}

function EditCartButton() {
  const { t } = useLanguage();
  const { openCart } = useUI();
  return (
    <button type="button" className="link-btn" onClick={openCart}>
      <Icon name="edit" size={16} />
      {t.checkout.edit}
    </button>
  );
}
