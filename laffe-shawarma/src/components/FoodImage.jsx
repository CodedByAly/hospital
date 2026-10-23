import { forwardRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import mark from '../assets/images/logo-mark.webp'

/**
 * Food photo with a soft fade-in. Items without a photo get a branded tile
 * (the logo mark on paper) instead of a stock image.
 */
const FoodImage = forwardRef(function FoodImage({ item, className = '', eager = false }, ref) {
  const { pick } = useLang()
  const [loaded, setLoaded] = useState(false)
  const name = pick(item.name)

  if (!item.image) {
    return (
      <div ref={ref} className={`food-media food-tile ${className}`} role="img" aria-label={name}>
        <img src={mark} alt="" className="food-tile__mark" aria-hidden="true" decoding="async" />
      </div>
    )
  }

  return (
    <div ref={ref} className={`food-media ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        src={item.image}
        alt={name}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        onLoad={() => setLoaded(true)}
        ref={(img) => img?.complete && !loaded && setLoaded(true)}
      />
    </div>
  )
})

export default FoodImage
