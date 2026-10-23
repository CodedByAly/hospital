import { Link, useParams } from 'react-router-dom'
import { phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatPrice } from '../lib/format'
import { ORDER_TYPE_LABEL, describeLine, paymentLabel, pickupTimeLabel } from '../lib/order'
import { load } from '../lib/storage'
import CartTotals from '../components/CartTotals'
import CopyButton from '../components/CopyButton'
import { CheckIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons'
import { ORDERS_KEY } from './Checkout'

export default function OrderConfirmation() {
  const { number } = useParams()
  const order = load(ORDERS_KEY, []).find((o) => o.number === number)
  usePageMeta(order ? `طلب ${order.number}` : 'الطلب')

  if (!order) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title page-title--dark">ما لقينا هالطلب</h1>
        <p className="muted">ممكن يكون انطلب من جهاز تاني. لأي سؤال عن طلبك تواصل معنا مباشرة.</p>
        <div className="row-actions">
          <a href={whatsappLink()} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> واتساب
          </a>
          <Link to="/menu" className="btn btn--outline">
            المنيو
          </Link>
        </div>
      </div>
    )
  }

  const viaWhatsApp = order.channel === 'whatsapp'
  const c = order.customer
  const firstName = c.name.split(' ')[0]

  return (
    <div className="confirm">
      <header className="confirm__hero">
        <div className="container confirm__hero-inner">
          <span className="confirm__check" aria-hidden="true">
            <CheckIcon size={34} />
          </span>
          <p className="eyebrow eyebrow--ember">طلب رقم {order.number}</p>
          <h1 className="confirm__title">{viaWhatsApp ? `${firstName}، طلبك جاهز ينبعت` : `شكراً ${firstName}، وصلنا طلبك`}</h1>
          <p className="confirm__lead">
            {viaWhatsApp
              ? 'فتحنالك واتساب ومعه رسالة الطلب. اكبس إرسال ليوصلنا، ومنرد عليك لنأكّد.'
              : 'منتواصل معك على رقمك لنأكّد الطلب.'}
          </p>
          {viaWhatsApp && (
            <a href={order.whatsappUrl} className="btn btn--primary btn--large" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} />
              ابعت الطلب عالواتساب
            </a>
          )}
        </div>
      </header>

      <div className="container confirm__body">
        <ol className="confirm__steps">
          <li className="is-done">
            <span>1</span>
            {viaWhatsApp ? 'ابعت رسالة الطلب' : 'انبعت الطلب'}
          </li>
          <li>
            <span>2</span>
            منأكّد معك الطلب{order.payment === 'whish' ? ' والتحويل' : ''}
          </li>
          <li>
            <span>3</span>
            {order.type === 'delivery' ? 'منبعتلك ياه' : 'بتمرق بتاخده'}
          </li>
        </ol>

        <div className="confirm__grid">
          <section className="confirm-card" aria-labelledby="details-title">
            <h2 id="details-title" className="confirm-card__title">
              التفاصيل
            </h2>
            <dl className="details">
              <div>
                <dt>رقم الطلب</dt>
                <dd className="details__number">
                  <span dir="ltr">{order.number}</span>
                  <CopyButton value={order.number} />
                </dd>
              </div>
              <div>
                <dt>الاسم</dt>
                <dd>{c.name}</dd>
              </div>
              <div>
                <dt>الهاتف</dt>
                <dd dir="ltr">{c.phone}</dd>
              </div>
              <div>
                <dt>نوع الطلب</dt>
                <dd>{ORDER_TYPE_LABEL[order.type]}</dd>
              </div>
              {order.type === 'delivery' ? (
                <div>
                  <dt>العنوان</dt>
                  <dd>{[c.area, c.address, c.building].filter(Boolean).join('، ')}</dd>
                </div>
              ) : (
                <div>
                  <dt>وقت الاستلام</dt>
                  <dd>{pickupTimeLabel(c.pickupTime)}</dd>
                </div>
              )}
              <div>
                <dt>الدفع</dt>
                <dd>{paymentLabel(order.payment, order.type)}</dd>
              </div>
              {c.notes && (
                <div>
                  <dt>ملاحظات</dt>
                  <dd>{c.notes}</dd>
                </div>
              )}
            </dl>
            <p className="confirm-card__note">
              {order.type === 'delivery'
                ? 'وقت التوصيل ورسومه منأكدهن معك لما نرد عالطلب.'
                : 'منأكدلك الوقت لما نرد عالطلب. بس توصل عالمحل، قول رقم الطلب.'}
            </p>
          </section>

          <section className="confirm-card" aria-labelledby="items-title">
            <h2 id="items-title" className="confirm-card__title">
              الطلب
            </h2>
            <ul className="summary__lines">
              {order.lines.map((line, i) => (
                <li key={i}>
                  <span className="summary__qty">{line.quantity}×</span>
                  <span className="summary__name">
                    {line.name}
                    {describeLine(line).map((d) => (
                      <small key={d}>{d}</small>
                    ))}
                  </span>
                  <span className="summary__price">{formatPrice({ amount: line.unitPrice * line.quantity, currency: line.currency })}</span>
                </li>
              ))}
            </ul>
            <CartTotals totals={order.totals} type={order.type} />
          </section>

          <section className="confirm-card confirm-card--dark" aria-labelledby="help-title">
            <h2 id="help-title" className="confirm-card__title">
              في شي مش مظبوط؟
            </h2>
            <p>تواصل معنا وقول رقم الطلب.</p>
            <div className="row-actions">
              <a href={whatsappLink(`مرحبا، بخصوص الطلب ${order.number}`)} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> واتساب
              </a>
              <a href={phoneLink} className="btn btn--ghost-light">
                <PhoneIcon size={20} /> <span dir="ltr">{restaurant.phone.display}</span>
              </a>
            </div>
            <p className="confirm-card__meta">
              <PinIcon size={18} />
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {restaurant.address || 'موقع المحل على الخريطة'}
              </a>
            </p>
            <p className="confirm-card__meta">{restaurant.hoursLabel}</p>
          </section>
        </div>

        <div className="confirm__back">
          <Link to="/menu" className="link-arrow">
            رجوع عالمنيو
          </Link>
        </div>
      </div>
    </div>
  )
}
