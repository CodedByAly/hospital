import Icon from './Icon'

export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', label = 'Quantity' }) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={min === 0 && value === 1 ? 'Remove' : 'Decrease quantity'}
      >
        <Icon name={min === 0 && value === 1 ? 'trash' : 'minus'} size={size === 'sm' ? 15 : 18} />
      </button>
      <output className="stepper__value" aria-live="polite">{value}</output>
      <button type="button" className="stepper__btn" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={size === 'sm' ? 15 : 18} />
      </button>
    </div>
  )
}
