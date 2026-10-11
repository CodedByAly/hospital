import { Link, useParams } from 'react-router-dom';
import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatDateTime, formatPrice, localized } from '../lib/format';
import { getOrder, orderMessage, paymentLabel } from '../lib/order';
import { hasWhatsApp, whatsappUrl } from '../lib/whatsapp';
import ContactList from '../components/ContactList';
import FoodImage from '../components/FoodImage';
import Icon from '../components/Icon';

export default function Confirmation() {
  const { id } = useParams();
  const { t, lang } = useLanguage();
  usePageMeta(t.confirm.title);
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="container page-pad">
        <div className="empty-state empty-state--page">
          <Icon name="info" size={40} strokeWidth={1.3} />
          <h1 className="empty-state__title">{t.confirm.notFound}</h1>
          <Link to="/menu" className="btn btn--primary">{t.confirm.newOrder}</Link>
        </div>
      </div>
    );
  }

  const isDelivery = order.type === 'delivery';
  const sep = lang === 'ar' ? '، ' : ', ';

  return (
    <div className="confirm container page-pad">
      <section className="confirm__hero" aria-labelledby="confirm-title">
        <span className="confirm__check" aria-hidden="true">
          <Icon name="check" size={30} strokeWidth={2.4} />
        </span>
        <p className="confirm__number">
          <span>{t.confirm.number}</span>
          <strong dir="ltr">{order.id}</strong>
        </p>
        <h1 id="confirm-title" className="page-title">{t.confirm.title}</h1>
        <p className="page-lead">{t.confirm.lead(order.customer.name)}</p>
        {hasWhatsApp ? (
          <div className="confirm__actions">
            <a
              className="btn btn--whatsapp btn--lg"
              href={whatsappUrl(orderMessage(order, lang))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={20} />
              {t.confirm.resend}
            </a>
            <p className="confirm__hint">{t.confirm.notSent}</p>
          </div>
        ) : null}
      </section>

      <div className="confirm__grid">
        <section className="confirm__card" aria-labelledby="confirm-details">
          <h2 id="confirm-details" className="sr-only">{t.confirm.number}</h2>
          <dl className="details">
            <div>
              <dt>{t.checkout.name}</dt>
              <dd>{order.customer.name}</dd>
            </div>
            <div>
              <dt>{t.checkout.phone}</dt>
              <dd dir="ltr">{order.customer.phone}</dd>
            </div>
            <div>
              <dt>{t.confirm.type}</dt>
              <dd>{isDelivery ? t.checkout.delivery : t.checkout.pickup}</dd>
            </div>
            {isDelivery ? (
              <div>
                <dt>{t.confirm.deliverTo}</dt>
                <dd>{[order.delivery.address, order.delivery.floor, order.delivery.area].filter(Boolean).join(sep)}</dd>
              </div>
            ) : (
              <div>
                <dt>{t.confirm.pickupAt}</dt>
                <dd>
                  {order.pickup.asap ? t.confirm.asap : <span dir="ltr">{order.pickup.time}</span>}
                  <span className="details__sub">{localized(restaurant.address, lang)}</span>
                </dd>
              </div>
            )}
            <div>
              <dt>{t.confirm.payment}</dt>
              <dd>{paymentLabel(order, lang)}</dd>
            </div>
            <div>
              <dt>{t.confirm.placed}</dt>
              <dd>{formatDateTime(order.createdAt, lang)}</dd>
            </div>
            {order.notes ? (
              <div className="details__full">
                <dt>{isDelivery ? t.checkout.deliveryNotes : t.checkout.orderNotes}</dt>
                <dd>{order.notes}</dd>
              </div>
            ) : null}
          </dl>
          {order.payment === 'whish' ? <p className="notice">{t.confirm.whishReminder}</p> : null}
        </section>

        <section className="confirm__card" aria-labelledby="confirm-items">
          <h2 id="confirm-items" className="summary__title">{t.confirm.items}</h2>
          <ul className="summary__lines">
            {order.lines.map((l, i) => {
              const o = l.options[lang] ?? l.options.en;
              return (
                <li key={i} className="summary__line">
                  <FoodImage src={l.image} alt="" className="summary__img" />
                  <div className="summary__info">
                    <p className="summary__name">
                      <span className="summary__qty">{l.qty}×</span> {l.name[lang] ?? l.name.en}
                    </p>
                    <ul className="line-options">
                      {o.choice ? <li>{o.choice}</li> : null}
                      {o.extras.map((x) => (
                        <li key={x}>+ {x}</li>
                      ))}
                      {o.removed.length ? (
                        <li className="line-options__removed">
                          {t.item.without} {o.removed.join(sep)}
                        </li>
                      ) : null}
                      {o.note ? <li className="line-options__note">“{o.note}”</li> : null}
                    </ul>
                  </div>
                  <p className="summary__price">{formatPrice(l.total, lang)}</p>
                </li>
              );
            })}
          </ul>
          <dl className="totals">
            <div className="totals__row">
              <dt>{t.cart.subtotal}</dt>
              <dd>{formatPrice(order.subtotal, lang)}</dd>
            </div>
            {isDelivery ? (
              <div className="totals__row">
                <dt>{t.cart.delivery}</dt>
                <dd>
                  {order.deliveryFee == null ? (
                    <span className="totals__tbc">{t.cart.deliveryTbc}</span>
                  ) : (
                    formatPrice(order.deliveryFee, lang)
                  )}
                </dd>
              </div>
            ) : null}
            <div className="totals__row totals__row--total">
              <dt>{t.cart.total}</dt>
              <dd>
                {formatPrice(order.total, lang)}
                {isDelivery && order.deliveryFee == null ? <small> {t.cart.totalPlusDelivery}</small> : null}
              </dd>
            </div>
          </dl>
        </section>

        <section className="confirm__card confirm__help" aria-labelledby="confirm-help">
          <h2 id="confirm-help" className="summary__title">{t.confirm.help}</h2>
          <p>{t.confirm.helpText}</p>
          <ContactList />
        </section>
      </div>

      <div className="confirm__back">
        <Link to="/menu" className="link-arrow">
          {t.confirm.newOrder}
          <Icon name="arrow" size={18} className="flip-rtl" />
        </Link>
      </div>
    </div>
  );
}
