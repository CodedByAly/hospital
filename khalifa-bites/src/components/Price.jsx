import { formatPrice } from '../lib/format';

/** Price in the menu's outlined "tag" style, or plain text with `plain`. */
export default function Price({ value, from = false, plain = false, className = '' }) {
  const text = formatPrice(value);
  if (plain) return <span className={`price ${className}`}>{from ? `from ${text}` : text}</span>;
  return (
    <span className={`price-tag ${className}`}>
      {from && <small>from</small>}
      {text}
    </span>
  );
}
