import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import useDocumentMeta from '../hooks/useDocumentMeta';
import restaurant from '../config/restaurant';
import { findOrder, orderWhatsAppLink, describeItem, paymentLabel } from '../lib/order';
import { tr } from '../lib/format';
import { telLink, whatsappLink } from '../lib/links';
import Price from '../components/Price';
import Icon from '../components/Icon';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { t, lang } = useLanguage();
  useDocumentMeta(t.meta.order, t.meta.homeDescription);
  const order = findOrder(orderId);

  if (!order) {
    return (
      <div className="container narrow-page empty-state">
        <img src="/images/logo-shrimp.svg" alt="" className="empty-state__mark" />
        <h1 className="page-title">{t.confirmation.missingTitle}</h1>
        <p>{t.confirmation.missingHint}</p>
        <div className="empty-state__actions">
          <a href={whatsappLink()} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} /> {t.common.whatsapp}
          </a>
          <Link to="/menu" className="btn btn--outline">{t.confirmation.newOrder}</Link>
        </div>
      </div>
    );
  }

  const c = t.confirmation;
  const firstName = order.customer.name.split(/\s+/)[0];

  return (
    <div className="confirm">
      <div className="container confirm__grid">
        <section className="confirm__main" aria-labelledby="confirm-title">
          <div className="confirm__badge" aria-hidden="true">
            <svg viewBox="0 0 52 52" width="52" height="52">
              <circle cx="26" cy="26" r="24" className="confirm__ring" />
              <path d="M15 27l7 7 15-16" className="confirm__tick" />
            </svg>
          </div>
          <p className="eyebrow">{c.kicker}</p>
          <h1 id="confirm-title" className="page-title">{c.title(firstName)}</h1>
          <p className="confirm__lead">{c.lead}</p>

          <div className="confirm__resend">
            <span>{c.notSent}</span>
            <a href={orderWhatsAppLink(order)} className="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={20} />
              {c.resend}
            </a>
          </div>

          <dl className="confirm__facts">
            <div>
              <dt>{c.number}</dt>
              <dd className="confirm__id" dir="ltr">{order.id}</dd>
            </div>
            <div>
              <dt>{c.type}</dt>
              <dd>{t.order[order.type]}</dd>
            </div>
            <div>
              <dt>{c.payment}</dt>
              <dd>{paymentLabel(order, lang)}</dd>
            </div>
            <div>
              <dt>{c.when}</dt>
              <dd>{order.type === 'pickup' ? c.whenPickup(order.pickupTime) : c.whenDelivery}</dd>
            </div>
            {order.delivery && (
              <div className="confirm__wide">
                <dt>{c.deliverTo}</dt>
                <dd>{[order.delivery.address, order.delivery.building, order.delivery.area].filter(Boolean).join(lang === 'ar' ? '، ' : ', ')}</dd>
              </div>
            )}
          </dl>

          <div className="confirm__help">
            <h2>{c.problem}</h2>
            <p>{c.problemHint}</p>
            <div className="confirm__help-actions">
              <a href={telLink} className="btn btn--outline">
                <Icon name="phone" size={19} /> <span dir="ltr">{restaurant.phone.display}</span>
              </a>
              <a href={whatsappLink(`${t.wa.order}: ${order.id}`)} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" size={19} /> {t.common.whatsapp}
              </a>
            </div>
          </div>
        </section>

        <aside className="summary confirm__summary" aria-labelledby="confirm-summary">
          <h2 id="confirm-summary" className="summary__title">{t.checkout.summary}</h2>
          <ul className="summary__lines">
            {order.items.map((i, idx) => {
              const d = describeItem(i, lang);
              return (
                <li key={idx} className="summary__line">
                  <span className="summary__qty" dir="ltr">{i.qty}×</span>
                  <span className="summary__name">
                    {d.name}
                    {d.details && <span className="line-details">{d.details}</span>}
                  </span>
                  <Price value={i.unit * i.qty} />
                </li>
              );
            })}
          </ul>
          <dl className="totals">
            <div className="totals__row">
              <dt>{t.cart.subtotal}</dt>
              <dd><Price value={order.subtotal} /></dd>
            </div>
            {order.type === 'delivery' && (
              <div className="totals__row">
                <dt>{t.cart.delivery}</dt>
                <dd>{order.deliveryFee == null ? <span className="totals__tbd">{t.cart.deliveryTbd}</span> : <Price value={order.deliveryFee} />}</dd>
              </div>
            )}
            <div className="totals__row totals__row--grand">
              <dt>{t.cart.total}</dt>
              <dd><Price value={order.total} /></dd>
            </div>
          </dl>
          <div className="confirm__restaurant">
            <p className="confirm__restaurant-name">{restaurant.name} · {restaurant.nameAr}</p>
            <p>{tr(restaurant.address, lang)}</p>
            <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="link">
              {t.common.openMaps}
            </a>
          </div>
          <Link to="/menu" className="btn btn--primary btn--block">{c.newOrder}</Link>
        </aside>
      </div>
    </div>
  );
}
