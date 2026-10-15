import { useI18n } from '../i18n/LanguageContext';
import Icon from './Icon';
import './QuantityStepper.css';

export default function QuantityStepper({ value, onChange, min = 1, max = 50, size = 'md', label }) {
  const { t } = useI18n();
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label || t('common.quantity')}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t('common.decrease')}
      >
        <Icon name={value <= 1 && min === 0 ? 'trash' : 'minus'} size={size === 'sm' ? 16 : 18} />
      </button>
      <output className="stepper__value" aria-live="polite">{value}</output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t('common.increase')}
      >
        <Icon name="plus" size={size === 'sm' ? 16 : 18} />
      </button>
    </div>
  );
}
