// Price written the way the printed Jungs menu does it: dollars big, cents raised and small ($11⁵⁰).
export function Price({ value, className = '' }) {
  const [dollars, cents] = value.toFixed(2).split('.')
  return (
    <span className={`price-tag ${className}`} aria-label={`$${value % 1 ? value.toFixed(2) : value}`}>
      <span aria-hidden="true">
        ${dollars}
        <sup>{cents === '00' ? '' : cents}</sup>
      </span>
    </span>
  )
}
