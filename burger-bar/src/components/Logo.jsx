import badge from '../assets/logo.png';

// The round BB badge, optionally followed by the "Burger Bar" wordmark.
export default function Logo({ withText = false, className = '', title = 'Burger Bar' }) {
  return (
    <span className={`logo ${className}`}>
      <img className="logo__badge" src={badge} alt={withText ? '' : title} width="485" height="485" />
      {withText && <span className="logo__text">Burger Bar</span>}
    </span>
  );
}
