import Icon from './Icon';

export default function QuantityStepper({ value, onChange, min = 1, max = 50, size = 'md', label = 'Quantity' }) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button type="button" className="stepper__btn" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Icon name="minus" size={18} />
      </button>
      <span className="stepper__value" aria-live="polite" key={value}>
        {value}
      </span>
      <button type="button" className="stepper__btn" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
