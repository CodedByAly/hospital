import { useState } from 'react';
import { imageUrl } from '../data/menu';
import { LOGO_BEANS } from './Logo';

export function BeansMark(props) {
  return (
    <svg viewBox="790 90 260 240" aria-hidden="true" focusable="false" {...props}>
      <path d={LOGO_BEANS} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

// Dish photo with lazy loading and a clean branded placeholder when there is no photo.
export default function DishImage({ item, size = 'lg', eager = false, className = '', sizes, imgRef }) {
  const [failed, setFailed] = useState(false);
  const src = imageUrl(item.image, size);

  if (!src || failed) {
    return (
      <div className={`dish-placeholder ${className}`} role="img" aria-label={`${item.name} (photo coming soon)`}>
        <BeansMark />
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      className={className}
      src={src}
      srcSet={`${imageUrl(item.image, 'sm')} 320w, ${imageUrl(item.image, 'lg')} 590w`}
      sizes={sizes || '(max-width: 640px) 40vw, 300px'}
      alt={item.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      width="590"
      height="590"
      onError={() => setFailed(true)}
    />
  );
}
