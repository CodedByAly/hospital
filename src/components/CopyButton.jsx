import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import Icon from './Icon';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure contexts
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

export default function CopyButton({ text, className = '' }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={`btn btn--sm btn--ghost ${className}`}
      onClick={async () => setCopied(await copyText(text))}
    >
      <Icon name={copied ? 'check' : 'copy'} size={17} />
      <span aria-live="polite">{copied ? t('checkout.copied') : t('checkout.copy')}</span>
    </button>
  );
}
