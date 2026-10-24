import { useEffect, useState } from 'react'
import Modal from './Modal'
import Logo from './Logo'
import { CheckIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from './Icons'
import { useCart } from '../cart/CartContext'
import { lineDetails } from '../cart/order'
import { itemsById } from '../data/menu'
import { money, site, telLink, whatsappLink } from '../data/site'
import './Confirmation.css'

export default function Confirmation() {
  const { order, showOrder } = useCart()
  const [shown, setShown] = useState(order)
  useEffect(() => {
    if (order) setShown(order)
  }, [order])

  const o = shown
  const firstName = o?.customer.name.split(' ')[0]
  const delivery = o?.type === 'delivery'

  return (
    <Modal open={!!order} onClose={() => showOrder(null)} label="Order summary" variant="page" closeLabel="Back to the menu">
      {o && (
        <div className="confirm">
          <div className="confirm__inner">
            <Logo className="confirm__logo" />

            <div className="confirm__status">
              <span className="confirm__tick">
                <CheckIcon />
              </span>
              <p className="eyebrow">Order {o.number}</p>
              <h2 className="display confirm__title">Thanks, {firstName}. One last tap.</h2>
              <p className="confirm__lede">
                WhatsApp opened in a new tab with your order written out. Press <strong>send</strong> there
                and we’ll reply to confirm it and let you know when it’s{' '}
                {delivery ? 'on its way' : 'ready to collect'}.
              </p>
              <a href={whatsappLink(o.message)} className="btn confirm__resend" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> Didn’t open? Send it again
              </a>
            </div>

            <div className="confirm__grid">
              <section className="confirm__card" aria-labelledby="confirm-order">
                <h3 id="confirm-order" className="confirm__h">
                  Your order
                </h3>
                <ul className="confirm__lines">
                  {o.lines.map((l) => {
                    const item = itemsById[l.id]
                    return (
                      <li key={l.key}>
                        <div>
                          <p>
                            {l.qty} × {item.name}
                          </p>
                          {lineDetails(l).map((d) => (
                            <small key={d}>{d}</small>
                          ))}
                        </div>
                        <span>{money(item.price * l.qty)}</span>
                      </li>
                    )
                  })}
                </ul>
                <dl className="totals">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{money(o.totals.subtotal)}</dd>
                  </div>
                  {delivery && (
                    <div className="totals__muted">
                      <dt>Delivery</dt>
                      <dd>{o.totals.fee == null ? 'Confirmed on WhatsApp' : money(o.totals.fee)}</dd>
                    </div>
                  )}
                  <div className="totals__grand">
                    <dt>Total</dt>
                    <dd>
                      {money(o.totals.total)}
                      {delivery && o.totals.fee == null && <small> + delivery</small>}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="confirm__card" aria-labelledby="confirm-details">
                <h3 id="confirm-details" className="confirm__h">
                  Details
                </h3>
                <dl className="confirm__dl">
                  <div>
                    <dt>Name</dt>
                    <dd>{o.customer.name}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{o.customer.phone}</dd>
                  </div>
                  <div>
                    <dt>Order type</dt>
                    <dd>{delivery ? 'Delivery' : 'Pickup'}</dd>
                  </div>
                  {delivery ? (
                    <div>
                      <dt>Deliver to</dt>
                      <dd>
                        {[o.customer.area, o.customer.address, o.customer.building].filter(Boolean).join(', ')}
                      </dd>
                    </div>
                  ) : (
                    <div>
                      <dt>Pickup</dt>
                      <dd>{o.customer.pickupTime === 'asap' ? 'As soon as possible' : o.customer.pickupAt}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Payment</dt>
                    <dd>{o.payment}</dd>
                  </div>
                  <div>
                    <dt>{delivery ? 'Delivery time' : 'Ready by'}</dt>
                    <dd>We confirm it on WhatsApp</dd>
                  </div>
                </dl>
              </section>
            </div>

            <section className="confirm__help" aria-labelledby="confirm-help">
              <h3 id="confirm-help" className="confirm__h">
                Something wrong with your order?
              </h3>
              <p>Message or call {site.name} and we’ll sort it out.</p>
              <div className="confirm__actions">
                {site.whatsapp && (
                  <a href={whatsappLink(`Hi, about my order ${o.number}: `)} className="btn btn--olive" target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> WhatsApp
                  </a>
                )}
                <a href={telLink} className="btn btn--ghost">
                  <PhoneIcon /> {site.phone.display}
                </a>
                {site.social.map((s) => (
                  <a key={s.id} href={s.href} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon /> {s.handle}
                  </a>
                ))}
              </div>
            </section>

            <button type="button" className="btn btn--ghost confirm__back" onClick={() => showOrder(null)}>
              Back to the menu
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
