import { formatPrice } from '../lib/format';

export default function Price({ value, className = '' }) {
  return <span className={`ltr price ${className}`}>{formatPrice(value)}</span>;
}
