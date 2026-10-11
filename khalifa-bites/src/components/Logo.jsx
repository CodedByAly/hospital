import { asset } from '../lib/asset';

/** Khalifa Bites logo, extracted as vector artwork from the printed menu. */
export default function Logo({ variant = 'blue', className = '', label = 'Khalifa Bites', eager = false }) {
  return (
    <img
      src={asset(variant === 'white' ? 'images/logo-white.svg' : 'images/logo.svg')}
      alt={label}
      className={`logo ${className}`}
      width="240"
      height="82"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
