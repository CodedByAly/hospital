import { useState } from 'react'
import { copy as t } from '../content/copy'
import './FoodImage.css'

interface Props {
  image?: string
  alt: string
  /** Pick a size hint so the browser fetches the small or large file. */
  sizes?: string
  eager?: boolean
  className?: string
}

export const imageUrl = (image: string, small = false) => `/images/menu/${image}${small ? '-sm' : ''}.webp`

/** Food photo with lazy loading, a soft fade-in, and a clean placeholder when no photo exists. */
export function FoodImage({ image, alt, sizes = '(max-width: 600px) 50vw, 360px', eager, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return (
      <div className={`food-img food-img--empty ${className}`} role="img" aria-label={alt}>
        <img src="/images/logo.webp" alt="" width="120" height="62" loading="lazy" />
        <span>{t.menu.photoSoon}</span>
      </div>
    )
  }

  return (
    <div className={`food-img ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        src={imageUrl(image)}
        srcSet={`${imageUrl(image, true)} 360w, ${imageUrl(image)} 680w`}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width="680"
        height="680"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
