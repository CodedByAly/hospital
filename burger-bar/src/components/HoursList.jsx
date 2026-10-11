import { hoursRows, todayIndex } from '../lib/hours.js';

// Weekly hours with today's row highlighted.
export default function HoursList({ className = '' }) {
  const today = todayIndex();
  return (
    <dl className={`hours ${className}`}>
      {hoursRows().map((row) => (
        <div key={row.label} className={row.days.includes(today) ? 'is-today' : ''}>
          <dt>{row.label}</dt>
          <dd>{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}
