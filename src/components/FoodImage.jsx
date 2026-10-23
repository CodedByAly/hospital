import { useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import Icon from './Icon'

/**
 * Product photo with a fade-in once loaded. Items without a photo get a
 * quiet branded placeholder instead of a stock image.
 */
export default function FoodImage({ item, className = '', sizes, eager = false, imgRef }) {
  const { pick, t } = useI18n()
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const studio = item.imageStyle === 'studio'

  if (!item.image || failed) {
    return (
      <div className={`food-img food-img--empty ${className}`} ref={imgRef}>
        <img src="/images/logo.webp" alt="" width="64" height="64" loading="lazy" className="food-img__mark" />
        <span className="visually-hidden">{t('item.noPhoto')}</span>
      </div>
    )
  }

  return (
    <div className={`food-img ${studio ? 'food-img--studio' : ''} ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        ref={imgRef}
        src={item.image}
        alt={pick(item.name)}
        width="640"
        height="480"
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {!loaded && <Icon name="bag" className="food-img__loading" size={22} />}
    </div>
  )
}
