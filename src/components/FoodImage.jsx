import { forwardRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import Logo from './Logo';

/** Menu photo with fixed aspect ratio, lazy loading and a branded placeholder. */
const FoodImage = forwardRef(function FoodImage({ src, alt, eager = false, className = '', sizes }, ref) {
  const { t } = useLanguage();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`food-img food-img--empty ${className}`} role="img" aria-label={alt}>
        <Logo />
        <span>{t.item.noImage}</span>
      </div>
    );
  }

  return (
    <div className={`food-img ${className}`}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        width="466"
        height="314"
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
        onError={() => setFailed(true)}
      />
    </div>
  );
});

export default FoodImage;
