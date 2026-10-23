import { Link, useParams } from 'react-router-dom'
import { phoneLink, restaurant, whatsappLink } from '../config/restaurant'
import { usePageMeta } from '../hooks/usePageMeta'
import { useLang } from '../i18n/LanguageContext'
import { paymentLabel, pickupTimeLabel } from '../lib/order'
import { load } from '../lib/storage'
import CartTotals from '../components/CartTotals'
import CopyButton from '../components/CopyButton'
import { CheckIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '../components/Icons'
import { ORDERS_KEY, SummaryLines } from './Checkout'

export default function OrderConfirmation() {
  const { t, pick, lang } = useLang()
  const { number } = useParams()
  const order = load(ORDERS_KEY, []).find((o) => o.number === number)
  usePageMeta(order ? t('confirm.number', { number: order.number }) : t('confirm.notFound'))

  if (!order) {
    return (
      <div className="container checkout-empty">
        <h1 className="page-title page-title--dark">{t('confirm.notFound')}</h1>
        <p className="muted">{t('confirm.notFoundHint')}</p>
        <div className="row-actions">
          <a href={whatsappLink()} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> WhatsApp
          </a>
          <Link to="/menu" className="btn btn--outline">
            {t('nav.menu')}
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
          <p className="eyebrow eyebrow--gold">{t('confirm.number', { number: order.number })}</p>
          <h1 className="confirm__title">{viaWhatsApp ? t('confirm.titleWa', { name: firstName }) : t('confirm.title', { name: firstName })}</h1>
          <p className="confirm__lead">{viaWhatsApp ? t('confirm.leadWa') : t('confirm.lead')}</p>
          {viaWhatsApp && (
            <a href={order.whatsappUrl} className="btn btn--primary btn--large" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={20} />
              {t('confirm.sendWa')}
            </a>
          )}
        </div>
      </header>

      <div className="container confirm__body">
        <ol className="confirm__steps">
          <li className="is-done">
            <span>1</span>
            {viaWhatsApp ? t('confirm.step1Wa') : t('confirm.step1')}
          </li>
          <li>
            <span>2</span>
            {order.payment === 'whish' ? t('confirm.step2Whish') : t('confirm.step2')}
          </li>
          <li>
            <span>3</span>
            {order.type === 'delivery' ? t('confirm.step3Delivery') : t('confirm.step3Pickup')}
          </li>
        </ol>

        <div className="confirm__grid">
          <section className="confirm-card" aria-labelledby="details-title">
            <h2 id="details-title" className="confirm-card__title">
              {t('confirm.details')}
            </h2>
            <dl className="details">
              <div>
                <dt>{t('confirm.orderNo')}</dt>
                <dd className="details__number">
                  <span dir="ltr">{order.number}</span>
                  <CopyButton value={order.number} />
                </dd>
              </div>
              <div>
                <dt>{t('confirm.name')}</dt>
                <dd>{c.name}</dd>
              </div>
              <div>
                <dt>{t('confirm.phone')}</dt>
                <dd dir="ltr">{c.phone}</dd>
              </div>
              <div>
                <dt>{t('confirm.type')}</dt>
                <dd>{t(`order.type.${order.type}`)}</dd>
              </div>
              {order.type === 'delivery' ? (
                <div>
                  <dt>{t('confirm.address')}</dt>
                  <dd>{[c.area, c.address, c.building].filter(Boolean).join(', ')}</dd>
                </div>
              ) : (
                <div>
                  <dt>{t('confirm.pickupTime')}</dt>
                  <dd>{pickupTimeLabel(c.pickupTime, t, lang)}</dd>
                </div>
              )}
              <div>
                <dt>{t('confirm.payment')}</dt>
                <dd>{paymentLabel(order.payment, order.type, t)}</dd>
              </div>
              {c.notes && (
                <div>
                  <dt>{t('confirm.notes')}</dt>
                  <dd>{c.notes}</dd>
                </div>
              )}
            </dl>
            <p className="confirm-card__note">{order.type === 'delivery' ? t('confirm.noteDelivery') : t('confirm.notePickup')}</p>
          </section>

          <section className="confirm-card" aria-labelledby="items-title">
            <h2 id="items-title" className="confirm-card__title">
              {t('confirm.items')}
            </h2>
            <SummaryLines lines={order.lines} />
            <CartTotals total={order.total} type={order.type} />
          </section>

          <section className="confirm-card confirm-card--dark" aria-labelledby="help-title">
            <h2 id="help-title" className="confirm-card__title">
              {t('confirm.help')}
            </h2>
            <p>{t('confirm.helpLead')}</p>
            <div className="row-actions">
              <a href={whatsappLink(t('confirm.helpWa', { number: order.number }))} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={20} /> WhatsApp
              </a>
              <a href={phoneLink} className="btn btn--ghost-light">
                <PhoneIcon size={20} /> <span dir="ltr">{restaurant.phone.display}</span>
              </a>
            </div>
            <p className="confirm-card__meta">
              <PinIcon size={18} />
              <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer">
                {pick(restaurant.address)}
              </a>
            </p>
            <p className="confirm-card__meta">{pick(restaurant.hoursLabel)}</p>
          </section>
        </div>

        <div className="confirm__back">
          <Link to="/menu" className="link-arrow">
            {t('confirm.back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
