import { IconMinus, IconPlus, IconTrash } from './Icons.jsx'

export function QuantityStepper({ value, onChange, min = 1, max = 50, label = 'Quantity', size = 'md', removeAtMin = false }) {
  const atMin = value <= min
  const showTrash = removeAtMin && value <= 1
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !removeAtMin}
        aria-label={showTrash ? 'Remove item' : 'Decrease quantity'}
      >
        {showTrash ? <IconTrash size={16} /> : <IconMinus size={16} />}
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <IconPlus size={16} />
      </button>
    </div>
  )
}
