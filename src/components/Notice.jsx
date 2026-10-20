import { useUI } from '../context/UIContext'
import Icon from './Icon'

// Short confirmation after adding to the order. Also read out by screen readers.
export default function Notice() {
  const { notice } = useUI()
  return (
    <div className="notice-region" aria-live="polite" role="status">
      {notice && (
        <div className="notice" key={notice.id}>
          <Icon name="check" size={16} strokeWidth={2.4} />
          <span>{notice.text}</span>
        </div>
      )}
    </div>
  )
}
