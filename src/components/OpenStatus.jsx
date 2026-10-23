import { useEffect, useState } from 'react'
import { formatTime, openStatus } from '../lib/hours'
import { useI18n } from '../i18n/I18nProvider'

export function useOpenStatus() {
  const [status, setStatus] = useState(() => openStatus())
  useEffect(() => {
    const id = setInterval(() => setStatus(openStatus()), 60_000)
    return () => clearInterval(id)
  }, [])
  return status
}

export function statusText(status, t, lang) {
  if (status.open) return t('status.openUntil', { time: formatTime(status.closesAt, lang) })
  const time = formatTime(status.opensAt, lang)
  return status.opensToday
    ? t('status.closedOpensToday', { time })
    : t('status.closedOpensOn', { time, day: t('days')[status.opensDay] })
}

export default function OpenStatus({ className = '' }) {
  const { t, lang } = useI18n()
  const status = useOpenStatus()
  return (
    <p className={`open-status ${status.open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="open-status__dot" aria-hidden="true" />
      {statusText(status, t, lang)}
    </p>
  )
}
