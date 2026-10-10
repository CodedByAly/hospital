import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import './FoodImage.css'

/**
 * Menu photo with a fixed aspect ratio (no layout shift), lazy loading,
 * a soft fade-in and a clean branded placeholder when a photo is missing.
 */
export default function FoodImage({ src, alt, ratio = '1 / 1', eager = false, className = '', imgRef, sizes }) {
  const { t } = useLanguage()
  const [state, setState] = useState(src ? 'loading' : 'missing')
  const [prevSrc, setPrevSrc] = useState(src)
  if (src !== prevSrc) {
    setPrevSrc(src)
    setState(src ? 'loading' : 'missing')
  }

  return (
    <div className={`food-img ${className}`} style={{ aspectRatio: ratio }} data-state={state}>
      {src && state !== 'missing' ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          onLoad={() => setState('loaded')}
          onError={() => setState('missing')}
        />
      ) : (
        <div className="food-img__placeholder" role="img" aria-label={alt}>
          <img src="/img/brand/logo-mark-ink.png" alt="" width="64" height="50" />
          <span>{t('common.noPhoto')}</span>
        </div>
      )}
    </div>
  )
}
