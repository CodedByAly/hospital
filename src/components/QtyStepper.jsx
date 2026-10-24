import { MinusIcon, PlusIcon, TrashIcon } from './Icons';
import './QtyStepper.css';

/** Quantity control. With `allowRemove`, going below 1 shows a bin and calls onChange(0). */
export default function QtyStepper({ value, onChange, min = 1, max = 50, label, size = 'md', allowRemove = false }) {
  const atMin = value <= min;
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={`Quantity${label ? ` for ${label}` : ''}`}>
      <button
        type="button"
        className="qty__btn"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !allowRemove}
        aria-label={atMin && allowRemove ? `Remove ${label || 'item'}` : 'Decrease quantity'}
      >
        {atMin && allowRemove ? <TrashIcon size={16} /> : <MinusIcon size={16} />}
      </button>
      <output className="qty__value" aria-live="polite">
        {value}
      </output>
      <button type="button" className="qty__btn" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
