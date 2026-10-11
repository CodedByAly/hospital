import { useLanguage } from '../i18n/LanguageContext';
import Icon from './Icon';

export default function QuantityStepper({ value, onChange, min = 1, max = 50, size = 'md', label }) {
  const { t } = useLanguage();
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label || t.item.quantity}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t.item.decrease}
      >
        <Icon name="minus" size={18} />
      </button>
      <span className="stepper__value" aria-live="polite" key={value}>
        {value}
      </span>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t.item.increase}
      >
        <Icon name="plus" size={18} />
      </button>
    </div>
  );
}
