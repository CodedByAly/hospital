import { useEffect } from 'react';
import { restaurant } from '../data/restaurant';

/** Per-page <title> and meta description. */
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${restaurant.name}` : `${restaurant.name} | ${restaurant.tagline}`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  }, [title, description]);
}
