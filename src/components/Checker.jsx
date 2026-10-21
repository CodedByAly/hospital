// The checkerboard band from the printed menu. Purely decorative.
export function Checker({ tone = 'teal', className = '' }) {
  return <div className={`checker checker--${tone} ${className}`} aria-hidden="true" />
}
