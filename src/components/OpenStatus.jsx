import { useOpenStatus } from '../hooks/useOpenStatus'
import { site } from '../data/site'

// "Open now" with a live dot. Falls back to the posted hours before hydration.
export default function OpenStatus({ className = '' }) {
  const status = useOpenStatus()
  const state = status ? (status.open ? 'open' : 'closed') : 'unknown'
  return (
    <span className={`open-status open-status--${state} ${className}`}>
      <span className="open-status__dot" aria-hidden="true" />
      {status ? status.label : site.hours.display}
    </span>
  )
}
