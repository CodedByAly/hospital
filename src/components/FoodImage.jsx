import { forwardRef, useState } from 'react'

/**
 * Food photo with a soft fade-in. Items without a photo get a typographic
 * tile in the style of the printed menu board instead of a stock image.
 */
const FoodImage = forwardRef(function FoodImage({ item, className = '', eager = false, sizes }, ref) {
  const [loaded, setLoaded] = useState(false)

  if (!item.image) {
    return (
      <div ref={ref} className={`food-media food-tile ${className}`} role="img" aria-label={item.name}>
        <span className="food-tile__name" aria-hidden="true">
          {item.name}
        </span>
      </div>
    )
  }

  return (
    <div ref={ref} className={`food-media ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        src={item.image}
        alt={item.name}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        onLoad={() => setLoaded(true)}
        ref={(img) => img?.complete && !loaded && setLoaded(true)}
      />
    </div>
  )
})

export default FoodImage
