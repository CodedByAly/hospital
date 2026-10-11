import { restaurant } from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { localized } from '../lib/format';

/** Renders nothing until opening hours are filled in the config. */
export default function OpeningHours({ className = '' }) {
  const { lang } = useLanguage();
  if (!restaurant.openingHours.length) return null;
  return (
    <dl className={`hours ${className}`}>
      {restaurant.openingHours.map((row) => (
        <div key={row.days.en} className="hours__row">
          <dt>{localized(row.days, lang)}</dt>
          <dd dir="ltr">
            {row.open} – {row.close}
          </dd>
        </div>
      ))}
    </dl>
  );
}
