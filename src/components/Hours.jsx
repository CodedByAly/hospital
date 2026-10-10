import { restaurant, whatsappLink } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'

/** Opening hours from config; a WhatsApp prompt while they haven't been provided. */
export default function Hours({ className = '' }) {
  const { t, pick } = useLanguage()
  if (!restaurant.hours?.length) {
    return (
      <p className={className}>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link">{t('info.hoursPending')}</a>
      </p>
    )
  }
  return (
    <dl className={`hours ${className}`}>
      {restaurant.hours.map((row) => (
        <div key={pick(row.days)}>
          <dt>{pick(row.days)}</dt>
          {row.closed ? <dd>{t('info.closed')}</dd> : <dd dir="ltr">{row.open} – {row.close}</dd>}
        </div>
      ))}
    </dl>
  )
}
