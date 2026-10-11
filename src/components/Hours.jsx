import restaurant from '../config/restaurant';
import { useLanguage } from '../i18n/LanguageContext';
import { tr } from '../lib/format';

/** Opening hours from config, or an honest prompt to call when they aren't set yet. */
export default function Hours({ className = '' }) {
  const { t, lang } = useLanguage();
  if (!restaurant.hours?.length) return <p className={`hours hours--unknown ${className}`}>{t.common.hoursUnknown}</p>;
  return (
    <dl className={`hours ${className}`}>
      {restaurant.hours.map((h) => (
        <div key={tr(h.days, 'en')} className="hours__row">
          <dt>{tr(h.days, lang)}</dt>
          <dd dir="ltr">{h.hours}</dd>
        </div>
      ))}
    </dl>
  );
}
