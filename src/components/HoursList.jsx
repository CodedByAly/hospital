import { useI18n } from '../i18n/LanguageContext';
import { groupedHours, restaurantNow } from '../lib/hours';
import { formatTime } from '../lib/format';
import './HoursList.css';

export default function HoursList({ className = '' }) {
  const { t, lang } = useI18n();
  const today = restaurantNow().day;
  const days = t('days');
  const short = t('daysShort');

  return (
    <dl className={`hours-list ${className}`}>
      {groupedHours().map((group) => {
        const label =
          group.days.length === 1
            ? days[group.days[0]]
            : `${short[group.days[0]]} – ${short[group.days[group.days.length - 1]]}`;
        const isToday = group.days.includes(today);
        return (
          <div key={group.days.join()} className={`hours-list__row ${isToday ? 'is-today' : ''}`}>
            <dt>{label}</dt>
            <dd>
              <span className={lang === 'ar' ? '' : 'ltr'}>{formatTime(group.open, lang)} – {formatTime(group.close, lang)}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
