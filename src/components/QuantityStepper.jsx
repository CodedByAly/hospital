import { MinusIcon, PlusIcon, TrashIcon } from './Icons'

export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', label = 'الكمية', removable = false }) {
  const atMin = value <= min
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="زيادة الكمية"
      >
        <PlusIcon size={18} />
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !removable}
        aria-label={atMin && removable ? 'حذف من السلة' : 'إنقاص الكمية'}
      >
        {atMin && removable ? <TrashIcon size={17} /> : <MinusIcon size={18} />}
      </button>
    </div>
  )
}
