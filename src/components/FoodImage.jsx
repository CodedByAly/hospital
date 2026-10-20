import { forwardRef } from 'react'

// Dish photos are cut-outs with transparent backgrounds, always shown
// whole (object-fit: contain), never cropped.
const FoodImage = forwardRef(function FoodImage({ name, alt, sizes = '(min-width: 900px) 320px, 45vw', eager = false, className = '' }, ref) {
  if (!name) return null
  return (
    <img
      ref={ref}
      className={`food-img ${className}`}
      src={`/images/menu/${name}-480.webp`}
      srcSet={`/images/menu/${name}-480.webp 480w, /images/menu/${name}-960.webp 960w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
    />
  )
})

export default FoodImage
