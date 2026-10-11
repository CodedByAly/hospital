import Icon from './Icon.jsx';

export default function QuantityStepper({ value, onChange, min = 1, max = 50, size = 'md', label = 'Quantity' }) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button type="button" className="stepper__btn" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Icon name="minus" size={size === 'sm' ? 16 : 18} />
      </button>
      <output className="stepper__value" aria-live="polite">{value}</output>
      <button type="button" className="stepper__btn" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={size === 'sm' ? 16 : 18} />
      </button>
    </div>
  );
}
