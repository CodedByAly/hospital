/** The traced Qambri logo (cream wordmark + orange shrimp line drawing). */
export default function Logo({ className = '', label = 'Qambri', eager = false }) {
  return (
    <img
      src="/images/logo.svg"
      alt={label}
      className={`logo ${className}`}
      width="310"
      height="234"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
