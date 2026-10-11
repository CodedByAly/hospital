import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const foodSrc = (name, ext = 'webp') => `/images/food/${name}.${ext}`;

/**
 * Food photo with WebP + JPEG fallback, lazy loading, a soft fade-in once
 * decoded, and a clean branded placeholder when there's no photo yet.
 */
export default function FoodImage({ name, alt, className = '', eager = false, sizes, ...rest }) {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!name || failed) {
    return (
      <div className={`food-img food-img--placeholder ${className}`} role="img" aria-label={alt} {...rest}>
        <img src="/images/logo-shrimp.svg" alt="" className="food-img__mark" />
        <span className="food-img__soon">{t.common.photoSoon}</span>
      </div>
    );
  }

  return (
    <div className={`food-img ${loaded ? 'is-loaded' : ''} ${className}`} {...rest}>
      <picture>
        <source srcSet={foodSrc(name)} type="image/webp" />
        <img
          src={foodSrc(name, 'jpg')}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          ref={(img) => {
            if (img?.complete && img.naturalWidth) setLoaded(true);
          }}
        />
      </picture>
    </div>
  );
}
