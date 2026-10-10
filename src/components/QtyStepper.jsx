import { useLanguage } from '../context/LanguageContext'
import Icon from './Icon'
import './QtyStepper.css'

export default function QtyStepper({ value, onChange, min = 1, max = 50, size = 'md', label }) {
  const { t } = useLanguage()
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={label ?? t('common.quantity')}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={t('common.decrease')}>
        <Icon name={value <= 1 && min === 0 ? 'trash' : 'minus'} size={size === 'sm' ? 16 : 18} />
      </button>
      <output aria-live="polite" key={value}>{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t('common.increase')}>
        <Icon name="plus" size={size === 'sm' ? 16 : 18} />
      </button>
    </div>
  )
}
