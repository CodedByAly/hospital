import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import Icon from './Icon';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / non-secure contexts.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

export default function CopyButton({ text, className = '' }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);
  return (
    <button type="button" className={`btn btn--small btn--outline copy-btn ${copied ? 'is-copied' : ''} ${className}`} onClick={async () => setCopied(await copyText(text))}>
      <Icon name={copied ? 'check' : 'copy'} size={17} />
      <span aria-live="polite">{copied ? t.common.copied : t.common.copy}</span>
    </button>
  );
}
