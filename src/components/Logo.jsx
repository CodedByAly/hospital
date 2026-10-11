/** The O'snack script wordmark, tinted with `currentColor`. */
export default function Logo({ className = '' }) {
  return <span className={`wordmark ${className}`} role="img" aria-label="O'snack" />;
}
