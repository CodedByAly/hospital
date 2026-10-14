import { copy as t } from '../content/copy'
import { Icon } from './Icon'
import './QtyStepper.css'

interface Props {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  label: string
  small?: boolean
}

export function QtyStepper({ value, onChange, min = 1, max = 99, label, small }: Props) {
  return (
    <div className={`qty ${small ? 'qty--sm' : ''}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${t.item.decrease} ${label}`}>
        <Icon name="minus" />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${t.item.increase} ${label}`}>
        <Icon name="plus" />
      </button>
    </div>
  )
}
