import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { openStatus } from '../lib/hours';
import { formatTime } from '../lib/format';
import './OpenStatus.css';

export function useOpenStatus() {
  const [status, setStatus] = useState(() => openStatus());
  useEffect(() => {
    const timer = window.setInterval(() => setStatus(openStatus()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return status;
}

export function statusText(status, t, lang) {
  if (status.open) return `${t('status.open')} · ${t('status.until', { time: formatTime(status.closes, lang) })}`;
  if (!status.next) return t('status.closed');
  const time = formatTime(status.next.time, lang);
  let when;
  if (status.next.inDays === 0) when = t('status.opensToday', { time });
  else if (status.next.inDays === 1) when = t('status.opensTomorrow', { time });
  else when = t('status.opensOn', { day: t('days')[status.next.day], time });
  return `${t('status.closed')} · ${when}`;
}

export default function OpenStatus({ tone = 'dark', className = '' }) {
  const { t, lang } = useI18n();
  const status = useOpenStatus();
  return (
    <span className={`open-status open-status--${tone} ${status.open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="open-status__dot" aria-hidden="true" />
      {statusText(status, t, lang)}
    </span>
  );
}
