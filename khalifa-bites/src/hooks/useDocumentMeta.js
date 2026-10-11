import { useEffect } from 'react';

function setMeta(selector, value) {
  const el = document.head.querySelector(selector);
  if (el && value) el.setAttribute('content', value);
}

/** Per-page <title> and description (mirrored to Open Graph tags). */
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    const full = title.includes('Khalifa') ? title : `${title} | Khalifa Bites`;
    document.title = full;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', full);
    setMeta('meta[property="og:description"]', description);
  }, [title, description]);
}
