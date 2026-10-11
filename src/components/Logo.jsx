import { LOGO_PATH, LOGO_VIEWBOX } from './logoPath.js';

export default function Logo({ className = '', title = 'Sukun' }) {
  return (
    <svg className={`logo ${className}`} viewBox={LOGO_VIEWBOX} role="img" aria-label={title}>
      <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
