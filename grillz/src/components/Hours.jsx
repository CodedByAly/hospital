import restaurant from '../config/restaurant';

/** Opening hours from the config, or an honest prompt until they're added. */
export default function Hours({ className = '' }) {
  if (!restaurant.hours?.length) return <p className={`hours hours--unknown ${className}`}>Call or WhatsApp us for today’s hours.</p>;
  return (
    <dl className={`hours ${className}`}>
      {restaurant.hours.map((h) => (
        <div key={h.days} className="hours__row">
          <dt>{h.days}</dt>
          <dd>{h.hours}</dd>
        </div>
      ))}
    </dl>
  );
}
