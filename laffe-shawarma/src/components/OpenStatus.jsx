import { useOpenStatus } from '../hooks/useOpenStatus'
import { useLang } from '../i18n/LanguageContext'
import { openingLabel } from '../lib/hours'

export default function OpenStatus({ className = '' }) {
  const { t, lang } = useLang()
  const open = useOpenStatus()
  return (
    <span className={`open-status ${open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="open-status__dot" aria-hidden="true" />
      {open ? t('status.open') : t('status.closed', { time: openingLabel(lang) })}
    </span>
  )
}
