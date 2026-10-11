import { useEffect } from 'react';
import { site } from '../config/site.js';

export function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.legalName}` : `${site.legalName} | Burgers, Sandwiches & Grills in West Bekaa`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
