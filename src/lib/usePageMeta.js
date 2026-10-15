import { useEffect } from 'react';

/** Per-route <title> and meta description (the static defaults live in index.html). */
export default function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    }
    if (title) document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  }, [title, description]);
}
