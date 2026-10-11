import { forwardRef, useState } from 'react';
import Logo from './Logo.jsx';

/*
 * Food photo with a fixed aspect ratio (no layout shift, no distortion) and a
 * branded placeholder for items that don't have a photo yet.
 */
const FoodImage = forwardRef(function FoodImage({ src, alt, className = '', eager = false, sizes }, ref) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div ref={ref} className={`food-img food-img--placeholder ${className}`} role="img" aria-label={`${alt} (photo coming soon)`}>
        <Logo className="food-img__mark" title="" />
      </div>
    );
  }

  return (
    <div className={`food-img ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        width="224"
        height="224"
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
});

export default FoodImage;
