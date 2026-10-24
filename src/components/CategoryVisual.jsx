import { useState } from 'react';
import './CategoryVisual.css';

/**
 * The picture for a menu category: the cut-out photo from the printed menu
 * on a brand-coloured panel, or a type-only panel when there is no photo.
 */
export default function CategoryVisual({ category, size = 'large', className = '', imgRef, eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const image = category.image;

  return (
    <div className={`cat-visual cat-visual--${category.tone} cat-visual--${size} ${image ? `is-${image.shape}` : 'is-type'} ${className}`}>
      {image ? (
        <img
          ref={imgRef}
          src={size === 'large' ? image.src : image.thumb}
          alt={image.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`cat-visual__img img-fade ${loaded ? 'is-loaded' : ''}`}
          style={{ objectPosition: image.focus, objectFit: image.fit }}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <span className="cat-visual__word" aria-hidden="true">
          {category.name}
        </span>
      )}
    </div>
  );
}
