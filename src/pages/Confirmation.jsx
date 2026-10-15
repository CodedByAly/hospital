import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import { restaurant } from '../config/restaurant';
import { formatPrice } from '../lib/format';
import { whatsappLink } from '../lib/whatsapp';
import usePageMeta from '../lib/usePageMeta';
import { findOrder, orderWhatsappUrl, pickupLabel } from '../services/orders';
import Icon from '../components/Icon';
import Price from '../components/Price';
import { TreeMark } from '../components/Logo';
import './Confirmation.css';

function Details({ details, lang, t }) {
  const parts = details[lang] || details.en;
  const rows = [
    ...parts.options,
    ...parts.addons.map((a) => `+ ${a.name} (${formatPrice(a.price)})`),
    parts.removed.length ? `${t('cart.without')} ${parts.removed.join(lang === 'ar' ? '، ' : ', ')}` : null,
    parts.note ? `${t('cart.note')}: ${parts.note}` : null,
  ].filter(Boolean);
  if (!rows.length) return null;
  return (
    <ul className="line-details">
      {rows.map((row) => <li key={row}>{row}</li>)}
    </ul>
  );
}

export default function Confirmation() {
  const { t, lang, pick } = useI18n();
  const { orderId } = useParams();
  const order = findOrder(orderId);
  usePageMeta(t('meta.orderTitle'));

  if (!order) {
    return (
      <section className="container confirmation-missing">
        <h1>{t('confirmation.notFound')}</h1>
        <Link to="/menu" className="btn">{t('confirmation.newOrder')}</Link>
      </section>
    );
  }

  const viaWhatsapp = order.channel === 'whatsapp';
  const isDelivery = order.type === 'delivery';
  const whishNumber = restaurant.payments.whish.number;
  const totalLabel = isDelivery && order.deliveryFee == null ? t('common.totalExclDelivery') : t('common.total');
  const paymentLabel =
    order.payment === 'whish'
      ? t('checkout.whish')
      : isDelivery
        ? t('checkout.cashDelivery')
        : t('checkout.cashPickup');

  return (
    <div className="confirmation container">
      <header className="confirmation__head">
        <div className="confirmation__mark" aria-hidden="true">
          <TreeMark />
          <span className="confirmation__check"><Icon name="check" size={18} strokeWidth={2.4} /></span>
        </div>
        <h1>{t('confirmation.title', { name: order.customer.name.split(' ')[0] })}</h1>
        <p className="lead">{viaWhatsapp ? t('confirmation.lead') : t('confirmation.leadEndpoint')}</p>
        {viaWhatsapp && (
          <div className="confirmation__resend">
            <span>{t('confirmation.notSent')}</span>
            <a className="btn btn--whatsapp btn--sm" href={orderWhatsappUrl(order)} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} /> {t('confirmation.resend')}
            </a>
          </div>
        )}
      </header>

      <div className="confirmation__grid">
        <section className="ticket" aria-labelledby="ticket-number">
          <div className="ticket__top">
            <span className="ticket__label">{t('confirmation.number')}</span>
            <span id="ticket-number" className="ticket__number ltr">{order.id}</span>
          </div>

          <dl className="ticket__facts">
            <div>
              <dt>{t('confirmation.type')}</dt>
              <dd>{isDelivery ? t('order.delivery') : t('order.pickup')}</dd>
            </div>
            {isDelivery ? (
              <div>
                <dt>{t('confirmation.deliverTo')}</dt>
                <dd>
                  {order.delivery.area}, {order.delivery.address}
                  {order.delivery.building && <><br />{order.delivery.building}</>}
                </dd>
              </div>
            ) : (
              <div>
                <dt>{t('confirmation.time')}</dt>
                <dd>{pickupLabel(order.pickupSlot, lang)}</dd>
              </div>
            )}
            <div>
              <dt>{t('checkout.name')}</dt>
              <dd>{order.customer.name} · <span className="ltr">{order.customer.phone}</span></dd>
            </div>
            <div>
              <dt>{t('confirmation.payment')}</dt>
              <dd>{paymentLabel}</dd>
            </div>
          </dl>

          <ul className="ticket__lines">
            {order.lines.map((line, index) => (
              <li key={`${line.itemId}-${index}`}>
                <span className="ticket__qty">{line.qty}×</span>
                <div>
                  <span className="ticket__name">{pick(line.name)}</span>
                  <Details details={line.details} lang={lang} t={t} />
                </div>
                <Price value={line.total} />
              </li>
            ))}
          </ul>

          <dl className="ticket__totals">
            <div><dt>{t('common.subtotal')}</dt><dd><Price value={order.subtotal} /></dd></div>
            {isDelivery && (
              <div>
                <dt>{t('common.deliveryFee')}</dt>
                <dd>{order.deliveryFee == null ? t('common.deliveryTbc') : <Price value={order.deliveryFee} />}</dd>
              </div>
            )}
            <div className="ticket__total"><dt>{totalLabel}</dt><dd><Price value={order.total} /></dd></div>
          </dl>

          {order.notes && <p className="ticket__notes">{order.notes}</p>}
        </section>

        <aside className="confirmation__aside">
          <div className="confirmation__box">
            <Icon name="clock" size={22} />
            <p>{isDelivery ? t('confirmation.expectedDelivery') : t('confirmation.expectedPickup')}</p>
          </div>
          {order.payment === 'whish' && (
            <div className="confirmation__box">
              <Icon name="wallet" size={22} />
              <p>
                {whishNumber
                  ? t('confirmation.whishReminder', { total: formatPrice(order.total), number: whishNumber })
                  : t('confirmation.whishReminderPending')}
              </p>
            </div>
          )}

          <div className="confirmation__help">
            <h2>{t('confirmation.problem')}</h2>
            <p>{t('confirmation.problemText')}</p>
            <div className="confirmation__help-actions">
              <a className="btn btn--ghost" href={`tel:${restaurant.phone.tel}`}>
                <Icon name="phone" size={18} /> <span className="ltr">{restaurant.phone.display}</span>
              </a>
              <a className="btn btn--ghost" href={whatsappLink(`Hi Life Kitchen, about my order ${order.id}: `)} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={18} /> {t('common.whatsapp')}
              </a>
            </div>
            <p className="confirmation__address">
              <Icon name="pin" size={17} /> Life Kitchen, {pick(restaurant.location.area)} ·{' '}
              <a className="text-link" href={restaurant.location.mapsUrl} target="_blank" rel="noopener noreferrer">{t('common.directions')}</a>
            </p>
          </div>

          <Link to="/menu" className="text-link">
            {t('confirmation.newOrder')} <Icon name="arrow" size={18} className="flip-rtl" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
