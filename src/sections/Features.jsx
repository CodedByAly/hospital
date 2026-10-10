import { asset } from '../lib/asset'
import { getItem } from '../data/menu'
import { formatPrice } from '../lib/format'
import { useLanguage } from '../context/LanguageContext'
import { useItemDialog } from '../context/ItemContext'
import FloatStage from '../components/FloatStage'
import Icon from '../components/Icon'
import { bubbleFeature, smoothieFeature } from './floatSets'
import './Features.css'

function SizePrices({ item }) {
  const { pick, lang } = useLanguage()
  if (!item.sizes) return <p className="feature__price">{formatPrice(item.price, lang)}</p>
  return (
    <ul className="feature__sizes">
      {item.sizes.map((s) => (
        <li key={s.id}>
          <span>{pick(s.label)}</span>
          <span>{formatPrice(s.price, lang)}</span>
        </li>
      ))}
    </ul>
  )
}

export function SignatureSmoothie() {
  const { t, pick } = useLanguage()
  const { openItem } = useItemDialog()
  const item = getItem('streets-smoothie')
  return (
    <section className="feature feature--mango" aria-labelledby="sig-title">
      <span className="feature__bigword" aria-hidden="true">Streets</span>
      <div className="container feature__grid">
        <FloatStage
          className="feature__stage"
          items={smoothieFeature}
          subject={{ src: asset('img/float/streets-smoothie.webp'), alt: pick(item.name), width: 700, height: 1112 }}
        />
        <div className="feature__copy reveal">
          <p className="eyebrow">{t('signature.eyebrow')}</p>
          <h2 id="sig-title" className="feature__title">{t('signature.title')}</h2>
          <p className="feature__text">{pick(item.description)}</p>
          <SizePrices item={item} />
          <button type="button" className="btn btn--primary btn--lg" onClick={() => openItem(item.id)}>
            {t('signature.cta')} <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

export function BubbleTea() {
  const { t, pick, lang } = useLanguage()
  const { openItem } = useItemDialog()
  const items = ['brown-sugar-bubble-tea', 'streets-popping-pearls'].map(getItem)
  return (
    <section className="feature feature--bubble" aria-labelledby="bubble-title">
      <span className="feature__strip" aria-hidden="true"><span>Bubble Tea</span></span>
      <div className="container feature__grid feature__grid--flip">
        <div className="feature__copy reveal">
          <p className="eyebrow">{t('bubble.eyebrow')}</p>
          <h2 id="bubble-title" className="feature__title">{t('bubble.title')}</h2>
          <ul className="feature__items">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <h3>{pick(item.name)}</h3>
                  <p>{pick(item.description)}</p>
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
        </div>
        <FloatStage
          className="feature__stage feature__stage--bubble"
          items={bubbleFeature}
          subject={{ src: asset('img/float/bubble.webp'), alt: pick(items[0].name), width: 659, height: 1314 }}
        />
      </div>
    </section>
  )
}

export function RoyalWhite() {
  const { t, pick } = useLanguage()
  const { openItem } = useItemDialog()
  const item = getItem('signature-milkshake')
  return (
    <section className="feature feature--royal" aria-labelledby="royal-title">
      <div className="container feature__grid">
        <FloatStage
          className="feature__stage feature__stage--royal"
          subject={{ src: asset('img/float/royal.webp'), alt: t('royal.eyebrow'), width: 720, height: 1226 }}
        />
        <div className="feature__copy reveal">
          <p className="eyebrow eyebrow--light">{t('royal.eyebrow')}</p>
          <h2 id="royal-title" className="feature__title feature__title--quote">{t('royal.title')}</h2>
          <p className="feature__text">{pick(item.name)}</p>
          <SizePrices item={item} />
          <button type="button" className="btn btn--accent btn--lg" onClick={() => openItem(item.id, null, { options: { type: 'royal-white' } })}>
            {t('royal.cta')} <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
