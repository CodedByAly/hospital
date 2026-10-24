import { restaurant, whatsappLink } from '../data/restaurant';

/** Opening hours from the config, or a WhatsApp prompt until they are filled in. */
export default function Hours({ compact = false }) {
  const hours = restaurant.openingHours;
  if (!hours.length) {
    return (
      <p className={compact ? 'hours hours--compact' : 'hours'}>
        For today’s hours,{' '}
        <a href={whatsappLink('Hi, are you open today? What are your hours?')} target="_blank" rel="noopener noreferrer" className="text-link">
          message us on WhatsApp
        </a>
        .
      </p>
    );
  }
  return (
    <dl className={compact ? 'hours hours--compact' : 'hours'}>
      {hours.map((h) => (
        <div key={h.days} className="hours__row">
          <dt>{h.days}</dt>
          <dd>{h.hours}</dd>
        </div>
      ))}
    </dl>
  );
}
