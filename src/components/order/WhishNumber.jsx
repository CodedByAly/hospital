import { useState } from 'react';
import Icon from '../Icon';

const pretty = (n) => {
  const d = String(n).replace(/\D/g, '');
  return d.startsWith('961') ? `+961 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : `+${d}`;
};

export default function WhishNumber({ number }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = `+${String(number).replace(/\D/g, '')}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without the async clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="whish-number">
      <span className="whish-number__value">{pretty(number)}</span>
      <button type="button" className="btn btn--ghost btn--sm" onClick={copy} aria-live="polite">
        <Icon name={copied ? 'check' : 'copy'} size={16} />
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
