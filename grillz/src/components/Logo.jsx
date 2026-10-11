import { asset } from '../lib/asset';

/**
 * Grillz logo, traced to vector from the restaurant's profile picture.
 *  - "full": burger mark over the GRILLZ wordmark (footer, splash)
 *  - "lockup": mark beside the wordmark, for the header
 */
export default function Logo({ variant = 'full', className = '', label = 'Grillz', eager = false }) {
  const loading = eager ? 'eager' : 'lazy';
  if (variant === 'lockup') {
    return (
      <span className={`logo logo--lockup ${className}`} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
        <img src={asset('images/logo-mark.svg')} alt="" className="logo__mark" width="244" height="139" loading={loading} />
        <img src={asset('images/logo-word.svg')} alt="" className="logo__word" width="271" height="61" loading={loading} />
      </span>
    );
  }
  return <img src={asset('images/logo.svg')} alt={label} className={`logo ${className}`} width="284" height="244" loading={loading} decoding="async" />;
}
