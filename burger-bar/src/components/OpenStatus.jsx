import { useEffect, useState } from 'react';
import { getOpenStatus } from '../lib/hours.js';

// Live "Open until 12:30 AM" / "Opens tomorrow at 1:00 PM" pill, refreshed every minute.
export default function OpenStatus({ className = '' }) {
  const [status, setStatus] = useState(getOpenStatus);
  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`open-status ${status.open ? 'is-open' : 'is-closed'} ${className}`}>
      <span className="open-status__dot" aria-hidden="true" />
      {status.label}
    </span>
  );
}
