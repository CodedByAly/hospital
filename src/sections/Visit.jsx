import { asset } from '../lib/asset'
import { restaurant, whatsappLink } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'
import Hours from '../components/Hours'
import Icon from '../components/Icon'
import SocialLinks from '../components/SocialLinks'
import './Visit.css'

/** Address, contact, hours and services — used on Home, About and Contact. */
export default function Visit({ headingLevel = 2, showPhoto = true, id = 'visit' }) {
  const { t, pick } = useLanguage()
  const H = `h${headingLevel}`
  const S = `h${headingLevel + 1}`
  const o = restaurant.ordering
  return (
    <section className="section visit" aria-labelledby={`${id}-title`}>
      <div className="container visit__grid">
        {showPhoto && (
          <figure className="visit__photo reveal">
            <img src={asset('img/brand/storefront.webp')} alt={`${restaurant.fullName} — ${pick(restaurant.address)}`} loading="lazy" decoding="async" width="1290" height="564" />
            <figcaption>{t('about.global')}</figcaption>
          </figure>
        )}
        <div className="visit__info reveal">
          <p className="eyebrow">{t('sections.visit')}</p>
          <H id={`${id}-title`} className="section__title">{t('sections.visitTitle')}</H>

          <dl className="visit__list">
            <div>
              <dt><Icon name="pin" size={18} />{t('info.address')}</dt>
              <dd>
                {pick(restaurant.address)}
                <a href={restaurant.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  {t('common.directions')} <Icon name="arrow" size={16} className="flip-rtl" />
                </a>
              </dd>
            </div>
            <div>
              <dt><Icon name="phone" size={18} />{t('info.phone')}</dt>
              <dd><a href={`tel:${restaurant.phone}`} dir="ltr" className="link">{restaurant.phoneDisplay}</a></dd>
            </div>
            <div>
              <dt><Icon name="clock" size={18} />{t('info.hours')}</dt>
              <dd><Hours /></dd>
            </div>
            <div>
              <dt><Icon name="check" size={18} />{t('info.services')}</dt>
              <dd className="visit__services">
                {o.dineIn && <span>{t('info.dineIn')}</span>}
                {o.pickup && <span>{t('info.pickup')}</span>}
                {o.delivery && <span>{t('info.delivery')}</span>}
                <span>{t('info.payments')}</span>
              </dd>
            </div>
          </dl>

          <div className="visit__actions">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
              <Icon name="whatsapp" size={20} /> {t('common.whatsapp')}
            </a>
            <a href={`tel:${restaurant.phone}`} className="btn btn--outline">
              <Icon name="phone" size={18} /> {t('common.call')}
            </a>
          </div>
          <S className="visually-hidden">{t('info.follow')}</S>
          <SocialLinks className="visit__social" showHandle />
        </div>
      </div>
    </section>
  )
}
