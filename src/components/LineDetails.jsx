import { useLanguage } from '../context/LanguageContext'
import { lineDetailParts } from '../lib/cart'

export default function LineDetails({ line }) {
  const { t, pick, lang } = useLanguage()
  const parts = lineDetailParts(line, t, pick, lang)
  return (
    <>
      {parts.length > 0 && <p className="line-details">{parts.join(' · ')}</p>}
      {line.config.notes && (
        <p className="line-details line-details--note">
          {t('cart.note')}: “{line.config.notes}”
        </p>
      )}
    </>
  )
}
