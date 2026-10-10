import { asset } from '../lib/asset'
import { getItem } from '../data/menu'
import { formatPrice } from '../lib/format'
import { whatsappLink } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'
import { useItemDialog } from '../context/ItemContext'
import FloatStage from '../components/FloatStage'
import Icon from '../components/Icon'
import { cheesyDuo, sidesFeature } from './floatSets'
import './Features.css'

function ItemList({ ids }) {
  const { t, pick, lang } = useLanguage()
  const { openItem } = useItemDialog()
  return (
    <ul className="feature__items">
      {ids.map(getItem).map((item) => (
        <li key={item.id}>
          <div>
            <h3>{pick(item.name)}</h3>
            {item.description && <p>{pick(item.description)}</p>}
          </div>
          <div className="feature__item-end">
            <span className="feature__item-price">{formatPrice(item.price, lang)}</span>
            <button type="button" className="round-add" onClick={() => openItem(item.id)} aria-label={`${t('common.add')}: ${pick(item.name)}`}>
              <Icon name="plus" size={20} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

/** "Beef or Chicken?" — the two Cheesy burgers side by side. */
export function CheesyDuo() {
  const { t } = useLanguage()
  return (
    <section className="feature feature--red" aria-labelledby="duo-title">
      <span className="feature__bigword" aria-hidden="true">Cheesy</span>
      <div className="container feature__grid">
        <FloatStage className="feature__stage feature__stage--duo" items={cheesyDuo} />
        <div className="feature__copy reveal">
          <p className="eyebrow eyebrow--light">{t('signature.eyebrow')}</p>
          <h2 id="duo-title" className="feature__title">{t('signature.title')}</h2>
          <p className="feature__text">{t('signature.text')}</p>
          <ItemList ids={['cheesy-beef', 'cheesy-chicken']} />
        </div>
      </div>
    </section>
  )
}

/** Fries, sauces and the other sides. */
export function Sides() {
  const { t, pick } = useLanguage()
  return (
    <section className="feature feature--sides" aria-labelledby="sides-title">
      <span className="feature__strip" aria-hidden="true"><span>{t('sides.strip')}</span></span>
      <div className="container feature__grid feature__grid--flip">
        <div className="feature__copy reveal">
          <p className="eyebrow">{t('sides.eyebrow')}</p>
          <h2 id="sides-title" className="feature__title">{t('sides.title')}</h2>
          <p className="feature__text">{t('sides.text')}</p>
          <ItemList ids={['french-fries', 'mozzarella-sticks', 'onion-rings']} />
        </div>
        <FloatStage
          className="feature__stage feature__stage--wide"
          items={sidesFeature}
          subject={{ src: asset('img/float/fries-sauces.webp'), alt: pick(getItem('french-fries').name), width: 900, height: 509 }}
        />
      </div>
    </section>
  )
}

/** 20% off for university students (from the restaurant's own campaign). */
export function StudentOffer() {
  const { t } = useLanguage()
  return (
    <section className="feature feature--offer" aria-labelledby="offer-title">
      <div className="container feature__grid">
        <div className="feature__stage feature__stage--wide feature__stage--offer">
          <span className="feature__badge" aria-hidden="true" dir="ltr">{t('offer.badge')}</span>
          <FloatStage
            className="feature__offer-stage"
            subject={{ src: asset('img/float/student-duo.webp'), alt: t('offer.title'), width: 1000, height: 374 }}
          />
        </div>
        <div className="feature__copy reveal">
          <p className="eyebrow eyebrow--light">{t('offer.eyebrow')}</p>
          <h2 id="offer-title" className="feature__title feature__title--quote">{t('offer.title')}</h2>
          <p className="feature__text">{t('offer.text')}</p>
          <a href={whatsappLink(t('offer.whatsapp'))} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--lg">
            <Icon name="whatsapp" size={20} /> {t('offer.cta')}
          </a>
        </div>
      </div>
    </section>
  )
}
