import { useLanguage } from '../i18n/LanguageContext';
import Icon from './Icon';

export default function QtyStepper({ value, onChange, min = 1, max = 99, size = 'md', label }) {
  const { t } = useLanguage();
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label ?? t.item.quantity}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t.item.decrease}
      >
        <Icon name={value <= 1 && min === 0 ? 'trash' : 'minus'} size={16} strokeWidth={2} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t.item.increase}>
        <Icon name="plus" size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
