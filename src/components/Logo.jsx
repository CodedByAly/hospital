import fullSvg from '../assets/logo-full.svg?raw';
import wordmarkSvg from '../assets/logo-wordmark.svg?raw';

// Inline SVG so the logo takes the surrounding text colour (orange on light, white on orange/navy).
export default function Logo({ variant = 'wordmark', className = '', title = "Zaher's" }) {
  return (
    <span
      className={`logo ${className}`}
      role="img"
      aria-label={title}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: variant === 'full' ? fullSvg : wordmarkSvg }}
    />
  );
}
