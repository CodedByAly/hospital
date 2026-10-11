import { useEffect } from 'react';

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
}

/** Per-page <title> and description (also mirrored to Open Graph tags). */
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    const full = title.includes('Qambri') || title.includes('كامبري') ? title : `${title} | Qambri`;
    document.title = full;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[property="og:description"]', 'content', description);
  }, [title, description]);
}
