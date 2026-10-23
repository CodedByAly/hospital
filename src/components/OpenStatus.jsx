import { useOpenStatus } from '../hooks/useOpenStatus'
import { openingLabel } from '../lib/hours'

export default function OpenStatus({ className = '' }) {
  const open = useOpenStatus()
  return (
    <span className={`open-status ${open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="open-status__dot" aria-hidden="true" />
      {open ? 'فاتحين هلّق' : `مسكّرين · منفتح ${openingLabel}`}
    </span>
  )
}
