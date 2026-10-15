import { useState } from 'react';
import { TreeMark } from './Logo';
import './FoodImage.css';

/**
 * Dish photo with a fixed aspect ratio (no distortion, no layout shift).
 * When no photo is available yet, shows a quiet branded placeholder instead of a stock image.
 */
export default function FoodImage({ src, alt, ratio = '4 / 3', eager = false, label, className = '' }) {
  const [status, setStatus] = useState(src ? 'loading' : 'missing');

  return (
    <div className={`food-image food-image--${status} ${className}`} style={{ aspectRatio: ratio }}>
      {src && status !== 'error' ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      ) : (
        <div className="food-image__placeholder" role="img" aria-label={alt}>
          <TreeMark className="food-image__mark" />
          {label && <span className="food-image__label">{label}</span>}
        </div>
      )}
    </div>
  );
}
