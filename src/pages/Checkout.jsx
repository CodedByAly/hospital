import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { restaurant } from '../config/restaurant';
import { pickupSlots } from '../lib/hours';
import { normalizeLebanesePhone } from '../lib/phone';
import { formatPrice, formatTime } from '../lib/format';
import { readJSON, writeJSON } from '../lib/storage';
import usePageMeta from '../lib/usePageMeta';
import {
  createOrderId,
  orderWhatsappUrl,
  saveOrder,
  sendOrderToEndpoint,
  snapshotLines,
  usesEndpoint,
} from '../services/orders';
import CopyButton from '../components/CopyButton';
import Icon from '../components/Icon';
import Price from '../components/Price';
import { LineDetails } from '../components/CartDrawer';
import { statusText, useOpenStatus } from '../components/OpenStatus';
import { TreeMark } from '../components/Logo';
import './Checkout.css';

const CUSTOMER_KEY = 'lk.customer';

function Field({ id, label, optional, hint, error, children }) {
  const { t } = useI18n();
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {optional && <small>{t('checkout.optional')}</small>}
      </label>
      {children}
      {hint && !error && <span className="field__hint" id={`${id}-hint`}>{hint}</span>}
      {error && (
        <span className="field__error" id={`${id}-error`}>
          <Icon name="close" size={14} strokeWidth={2.2} /> {error}
        </span>
      )}
    </div>
  );
}

function Summary({ cart, type, collapsible }) {
  const { t, pick } = useI18n();
  const [open, setOpen] = useState(false);
  const fee = restaurant.ordering.deliveryFee;
  const total = cart.subtotal + (type === 'delivery' && fee ? fee : 0);

  const body = (
    <>
      <ul className="summary__lines">
        {cart.lines.map((line) => (
          <li key={line.key}>
            <span className="summary__qty">{line.qty}×</span>
            <div className="summary__item">
              <span className="summary__name">{pick(line.item.name)}</span>
              <LineDetails line={line} />
            </div>
            <Price value={line.total} />
          </li>
        ))}
      </ul>
      <dl className="summary__totals">
        <div><dt>{t('common.subtotal')}</dt><dd><Price value={cart.subtotal} /></dd></div>
        {type === 'delivery' && (
          <div>
            <dt>{t('common.deliveryFee')}</dt>
            <dd>{fee == null ? t('common.deliveryTbc') : <Price value={fee} />}</dd>
          </div>
        )}
        <div className="summary__total">
          <dt>{type === 'delivery' && fee == null ? t('common.totalExclDelivery') : t('common.total')}</dt>
          <dd><Price value={total} /></dd>
        </div>
      </dl>
    </>
  );

  if (!collapsible) {
    return (
      <div className="summary">
        <h2 className="summary__title">{t('checkout.summary')}</h2>
        {body}
      </div>
    );
  }

  return (
    <div className={`summary summary--collapsible ${open ? 'is-open' : ''}`}>
      <button type="button" className="summary__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="summary-body">
        <span>{t('checkout.summary')} <span className="summary__count">({cart.count})</span></span>
        <span className="summary__toggle-end">
          <Price value={total} />
          <Icon name="chevron" size={18} className="summary__chevron" />
        </span>
      </button>
      <div id="summary-body" className="summary__body" hidden={!open}>{body}</div>
    </div>
  );
}

export default function Checkout() {
  const { t, lang } = useI18n();
  const cart = useCart();
  const navigate = useNavigate();
  const status = useOpenStatus();
  const formRef = useRef(null);
  usePageMeta(t('meta.checkoutTitle'));

  const saved = useMemo(() => readJSON(CUSTOMER_KEY, {}), []);
  const slots = useMemo(() => pickupSlots(), []);
  const { pickup: canPickup, delivery: canDeliver, deliveryFee } = restaurant.ordering;

  const [form, setForm] = useState({
    type: canPickup ? 'pickup' : 'delivery',
    name: saved.name || '',
    phone: saved.phone || '',
    pickupSlot: status.open ? 'asap' : slots[0]?.id || '',
    area: saved.area || '',
    address: saved.address || '',
    building: saved.building || '',
    notes: '',
    payment: 'cash',
    whishRef: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));
  const isDelivery = form.type === 'delivery';
  const total = cart.subtotal + (isDelivery && deliveryFee ? deliveryFee : 0);
  const whishNumber = restaurant.payments.whish.number;

  const errors = useMemo(() => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t('checkout.errors.name');
    if (!normalizeLebanesePhone(form.phone)) e.phone = t('checkout.errors.phone');
    if (isDelivery) {
      if (!form.area.trim()) e.area = t('checkout.errors.area');
      if (form.address.trim().length < 4) e.address = t('checkout.errors.address');
    } else if (!form.pickupSlot) {
      e.pickupTime = t('checkout.errors.pickupTime');
    }
    return e;
  }, [form, isDelivery, t]);

  const show = (key) => (submitted ? errors[key] : undefined);
  const aria = (key, id) => ({
    id,
    'aria-invalid': show(key) ? 'true' : undefined,
    'aria-describedby': show(key) ? `${id}-error` : undefined,
  });

  if (cart.lines.length === 0) {
    return (
      <section className="container checkout-empty">
        <TreeMark className="checkout-empty__mark" />
        <h1>{t('cart.empty')}</h1>
        <p>{t('cart.emptyText')}</p>
        <Link to="/menu" className="btn">{t('cart.browse')}</Link>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setSubmitError('');

    if (Object.keys(errors).length) {
      // Focus the first invalid field, in form order.
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }

    const order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      lang,
      type: form.type,
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      pickupSlot: isDelivery ? null : form.pickupSlot,
      delivery: isDelivery
        ? { area: form.area.trim(), address: form.address.trim(), building: form.building.trim() }
        : null,
      notes: form.notes.trim(),
      payment: form.payment,
      whishRef: form.payment === 'whish' ? form.whishRef.trim() : '',
      lines: snapshotLines(cart.lines),
      subtotal: cart.subtotal,
      deliveryFee: isDelivery ? deliveryFee : null,
      total,
      channel: usesEndpoint() ? 'endpoint' : 'whatsapp',
    };

    if (usesEndpoint()) {
      setSending(true);
      try {
        await sendOrderToEndpoint(order);
      } catch {
        setSending(false);
        setSubmitError(t('checkout.errors.submit'));
        return;
      }
    } else {
      // Must run synchronously inside the submit event, or popup blockers step in.
      window.open(orderWhatsappUrl(order), '_blank', 'noopener');
    }

    saveOrder(order);
    writeJSON(CUSTOMER_KEY, {
      name: order.customer.name,
      phone: order.customer.phone,
      ...(order.delivery || { area: form.area, address: form.address, building: form.building }),
    });
    cart.clear();
    navigate(`/order/${order.id}`, { replace: true });
  };

  const errorCount = submitted ? Object.keys(errors).length : 0;

  return (
    <div className="checkout container">
      <header className="checkout__head">
        <Link to="/menu" className="checkout__back">
          <Icon name="arrow" size={18} className="checkout__back-icon" /> {t('checkout.backToMenu')}
        </Link>
        <h1>{t('checkout.title')}</h1>
      </header>

      <div className="checkout__layout">
        <div className="checkout__summary-mobile">
          <Summary cart={cart} type={form.type} collapsible />
        </div>

        <form ref={formRef} className="checkout__form" onSubmit={handleSubmit} noValidate>
          {errorCount > 0 && (
            <div className="form-alert" role="alert">
              <Icon name="close" size={18} strokeWidth={2} /> {t('checkout.errors.summary')}
            </div>
          )}
          {!status.open && (
            <p className="checkout__notice">
              <Icon name="clock" size={18} /> {t('checkout.closedNow', { status: statusText(status, t, lang) })}
            </p>
          )}

          {/* 1. Order type */}
          <fieldset className="checkout__section">
            <legend className="checkout__legend">{t('checkout.orderType')}</legend>
            <div className="type-cards">
              {canPickup && (
                <label className="choice type-card">
                  <input type="radio" name="type" value="pickup" checked={form.type === 'pickup'} onChange={set('type')} />
                  <Icon name="store" size={26} className="type-card__icon" />
                  <span className="choice__body">
                    <span className="choice__title">{t('checkout.pickup')}</span>
                    <span className="choice__text">{t('checkout.pickupText', { area: restaurant.location.area[lang] })}</span>
                  </span>
                  <span className="choice__control" />
                </label>
              )}
              {canDeliver && (
                <label className="choice type-card">
                  <input type="radio" name="type" value="delivery" checked={form.type === 'delivery'} onChange={set('type')} />
                  <Icon name="scooter" size={26} className="type-card__icon" />
                  <span className="choice__body">
                    <span className="choice__title">{t('checkout.delivery')}</span>
                    <span className="choice__text">{t('checkout.deliveryText')}</span>
                  </span>
                  <span className="choice__control" />
                </label>
              )}
            </div>
          </fieldset>

          {/* 2. Details */}
          <fieldset className="checkout__section">
            <legend className="checkout__legend">{t('checkout.details')}</legend>
            <div className="checkout__grid">
              <Field id="co-name" label={t('checkout.name')} error={show('name')}>
                <input className="input" type="text" autoComplete="name" value={form.name} onChange={set('name')} {...aria('name', 'co-name')} />
              </Field>
              <Field id="co-phone" label={t('checkout.phone')} hint={t('checkout.phoneHint')} error={show('phone')}>
                <input
                  className="input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="03 123 456"
                  value={form.phone}
                  onChange={set('phone')}
                  {...aria('phone', 'co-phone')}
                  aria-describedby={show('phone') ? 'co-phone-error' : 'co-phone-hint'}
                />
              </Field>
            </div>

            {isDelivery ? (
              <div className="checkout__grid checkout__reveal" key="delivery">
                <Field id="co-area" label={t('checkout.area')} error={show('area')}>
                  <input className="input" type="text" autoComplete="address-level2" placeholder={t('checkout.areaPlaceholder')} value={form.area} onChange={set('area')} {...aria('area', 'co-area')} />
                </Field>
                <Field id="co-building" label={t('checkout.building')} optional>
                  <input className="input" type="text" placeholder={t('checkout.buildingPlaceholder')} value={form.building} onChange={set('building')} id="co-building" />
                </Field>
                <div className="checkout__full">
                  <Field id="co-address" label={t('checkout.address')} error={show('address')}>
                    <input className="input" type="text" autoComplete="street-address" placeholder={t('checkout.addressPlaceholder')} value={form.address} onChange={set('address')} {...aria('address', 'co-address')} />
                  </Field>
                </div>
              </div>
            ) : (
              <div className="checkout__grid checkout__reveal" key="pickup">
                <Field id="co-time" label={t('checkout.pickupTime')} error={show('pickupTime')}>
                  <select className="input" value={form.pickupSlot} onChange={set('pickupSlot')} {...aria('pickupTime', 'co-time')}>
                    {status.open && <option value="asap">{t('checkout.asap')}</option>}
                    {!slots.length && !status.open && <option value="">—</option>}
                    {[0, 1].map((inDays) => {
                      const daySlots = slots.filter((s) => s.inDays === inDays);
                      if (!daySlots.length) return null;
                      return (
                        <optgroup key={inDays} label={inDays === 0 ? t('checkout.today') : t('checkout.tomorrow')}>
                          {daySlots.map((slot) => (
                            <option key={slot.id} value={slot.id}>
                              {(inDays === 0 ? t('checkout.today') : t('checkout.tomorrow'))} · {formatTime(slot.time, lang)}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </Field>
              </div>
            )}

            <Field id="co-notes" label={isDelivery ? t('checkout.deliveryNotes') : t('checkout.pickupNotes')} optional>
              <textarea className="input" id="co-notes" rows={3} maxLength={400} placeholder={t('checkout.notesPlaceholder')} value={form.notes} onChange={set('notes')} />
            </Field>
          </fieldset>

          {/* 3. Payment */}
          <fieldset className="checkout__section">
            <legend className="checkout__legend">{t('checkout.payment')}</legend>
            <div className="choice-list">
              <label className="choice">
                <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={set('payment')} />
                <span className="choice__control" />
                <span className="choice__body">
                  <span className="choice__title">{isDelivery ? t('checkout.cashDelivery') : t('checkout.cashPickup')}</span>
                  <span className="choice__text">{isDelivery ? t('checkout.cashDeliveryText') : t('checkout.cashPickupText')}</span>
                </span>
                <Icon name="cash" size={24} className="payment-icon" />
              </label>
              <label className="choice">
                <input type="radio" name="payment" value="whish" checked={form.payment === 'whish'} onChange={set('payment')} />
                <span className="choice__control" />
                <span className="choice__body">
                  <span className="choice__title">{t('checkout.whish')}</span>
                  <span className="choice__text">{t('checkout.whishText')}</span>
                </span>
                <Icon name="wallet" size={24} className="payment-icon" />
              </label>
            </div>

            {form.payment === 'whish' && (
              <div className="whish checkout__reveal">
                {whishNumber ? (
                  <>
                    <p className="whish__steps">{t('checkout.whishSteps', { total: formatPrice(total) })}</p>
                    <div className="whish__number">
                      <div>
                        <span className="whish__label">{t('checkout.whishNumber')}</span>
                        <span className="whish__value ltr">{whishNumber}</span>
                        <span className="whish__name">{t('checkout.whishName')}: {restaurant.payments.whish.accountName}</span>
                      </div>
                      <CopyButton text={whishNumber.replace(/\s+/g, '')} />
                    </div>
                  </>
                ) : (
                  <p className="whish__steps">{t('checkout.whishPending')}</p>
                )}
                <Field id="co-whish" label={t('checkout.whishRef')} hint={t('checkout.whishRefHint')}>
                  <input className="input" id="co-whish" type="text" value={form.whishRef} onChange={set('whishRef')} />
                </Field>
              </div>
            )}
          </fieldset>

          <div className="checkout__submit">
            {submitError && <p className="form-alert" role="alert">{submitError}</p>}
            <button type="submit" className={`btn btn--block ${usesEndpoint() ? '' : 'btn--whatsapp'}`} disabled={sending}>
              {!usesEndpoint() && <Icon name="whatsapp" />}
              <span>{sending ? t('checkout.placing') : usesEndpoint() ? t('checkout.placeEndpoint') : t('checkout.place')}</span>
              <span className="checkout__submit-total"><Price value={total} /></span>
            </button>
            {!usesEndpoint() && <p className="checkout__how">{t('checkout.howItWorks')}</p>}
          </div>
        </form>

        <aside className="checkout__summary-desktop">
          <Summary cart={cart} type={form.type} />
        </aside>
      </div>
    </div>
  );
}
