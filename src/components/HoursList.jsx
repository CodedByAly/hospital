import { restaurant } from '../config/restaurant'
import { formatTime, groupedHours } from '../lib/hours'
import { useI18n } from '../i18n/I18nProvider'

export default function HoursList({ className = '', showLateNight = true }) {
  const { t, lang } = useI18n()
  const short = t('daysShort')
  const range = (days) => (days.length > 1 ? `${short[days[0]]}–${short[days[days.length - 1]]}` : t('days')[days[0]])
  const time = (open, close) => (
    <bdi className="time">
      {formatTime(open, lang)} – {formatTime(close, lang)}
    </bdi>
  )

  return (
    <dl className={`hours-list ${className}`}>
      {groupedHours().map((g) => (
        <div key={g.days.join()} className="hours-list__row">
          <dt>{range(g.days)}</dt>
          <dd>{time(g.open, g.close)}</dd>
        </div>
      ))}
      {showLateNight && (
        <div className="hours-list__row hours-list__row--late">
          <dt>
            {t('about.lateNight')} <small>({t('about.lateNightDays')})</small>
          </dt>
          <dd>{time(restaurant.lateNight.open, restaurant.lateNight.close)}</dd>
        </div>
      )}
    </dl>
  )
}
