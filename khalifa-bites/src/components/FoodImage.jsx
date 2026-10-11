import { useState } from 'react';
import { asset } from '../lib/asset';

export const menuSrc = (name) => asset(`images/menu/${name}.webp`);

/**
 * Cut-out food photo (transparent WebP from the printed menu), lazy-loaded
 * and faded in once decoded. Items without a photo get a clean branded tile.
 */
export default function FoodImage({ name, alt, className = '', eager = false, sizes, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!name || failed) {
    return (
      <div className={`food food--placeholder ${className}`} role="img" aria-label={alt} {...rest}>
        <img src={asset('images/logo-white.svg')} alt="" className="food__mark" />
      </div>
    );
  }

  return (
    <div className={`food ${loaded ? 'is-loaded' : ''} ${className}`} {...rest}>
      <img
        src={menuSrc(name)}
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
    </div>
  );
}
