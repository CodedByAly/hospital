import { useI18n } from '../i18n/I18nProvider'
import Icon from './Icon'

export default function QtyStepper({ value, onChange, min = 1, max = 99, size = 'md', label }) {
  const { t } = useI18n()
  return (
    <div className={`qty qty--${size}`} role="group" aria-label={label ?? t('item.quantity')}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t('item.decrease')}
      >
        <Icon name={value <= 1 && min === 0 ? 'trash' : 'minus'} size={size === 'sm' ? 16 : 18} />
      </button>
      <output className="num" aria-live="polite">
        {value}
      </output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t('item.increase')}>
        <Icon name="plus" size={size === 'sm' ? 16 : 18} />
      </button>
    </div>
  )
}
