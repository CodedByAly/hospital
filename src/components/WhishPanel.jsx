import { useEffect, useState } from 'react';
import { restaurant, whatsappLink } from '../data/restaurant';
import { money } from '../lib/format';
import { CheckIcon, CopyIcon } from './Icons';
import './WhishPanel.css';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers without the async clipboard API.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

/** Whish Money transfer instructions. Payment is checked by the restaurant, not automatically. */
export default function WhishPanel({ amount, feeUnknown = false, orderNumber }) {
  const [copied, setCopied] = useState(false);
  const { whish } = restaurant;

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="whish">
      <div className="whish__number-row">
        <div>
          <p className="whish__label">Whish number</p>
          <p className="whish__number">{whish.number}</p>
          <p className="whish__name">{whish.accountName}</p>
        </div>
        <button
          type="button"
          className={`whish__copy ${copied ? 'is-done' : ''}`}
          onClick={async () => setCopied(await copyText(whish.number.replace(/\s/g, '')))}
        >
          {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? 'Whish number copied' : ''}
      </span>
      <ol className="whish__steps">
        <li>
          <span>
            Send <strong>{money(amount)}</strong>
            {feeUnknown ? ' plus the delivery fee we confirm with you' : ''} to {whish.number} in your Whish app.
          </span>
        </li>
        <li>
          <span>
          {orderNumber ? (
            <>
              Send the transfer receipt to us on{' '}
              <a href={whatsappLink(`Whish transfer for order ${orderNumber}`)} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{' '}
              with order <strong>{orderNumber}</strong>.
            </>
          ) : (
            'Send us the transfer receipt on WhatsApp with your order number.'
          )}
          </span>
        </li>
        <li>
          <span>We check the transfer and confirm your order. Payments are verified by hand, not automatically.</span>
        </li>
      </ol>
    </div>
  );
}
