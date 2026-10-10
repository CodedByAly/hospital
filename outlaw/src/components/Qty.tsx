import { Minus, Plus } from 'lucide-react'
import './Qty.css'

export default function Qty({ value, onChange, min = 1, label }: { value: number; onChange: (n: number) => void; min?: number; label: string }) {
  return (
    <div className="qty" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min && min > 0} aria-label="Decrease quantity">
        <Minus size={16} aria-hidden="true" />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= 99} aria-label="Increase quantity">
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
