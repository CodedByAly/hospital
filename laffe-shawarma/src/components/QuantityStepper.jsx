import { useLang } from '../i18n/LanguageContext'
import { MinusIcon, PlusIcon, TrashIcon } from './Icons'

export default function QuantityStepper({ value, onChange, min = 1, max = 99, size = 'md', label, removable = false }) {
  const { t } = useLang()
  const atMin = value <= min
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label ?? t('qty.label')}>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={atMin && !removable}
        aria-label={atMin && removable ? t('qty.remove') : t('qty.dec')}
      >
        {atMin && removable ? <TrashIcon size={17} /> : <MinusIcon size={18} />}
      </button>
      <output className="stepper__value" aria-live="polite">
        {value}
      </output>
      <button type="button" className="stepper__btn" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={t('qty.inc')}>
        <PlusIcon size={18} />
      </button>
    </div>
  )
}
