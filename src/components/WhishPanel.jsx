import { useState } from 'react'
import { restaurant, whatsappLink } from '../config/restaurant'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../lib/format'
import Icon from './Icon'

/** Whish Money instructions. Shows the number from config, or a WhatsApp prompt until one is set. */
export default function WhishPanel({ total }) {
  const { t, lang } = useLanguage()
  const [copied, setCopied] = useState(false)
  const { number, accountName } = restaurant.payments.whish

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number.replace(/\s/g, ''))
    } catch {
      // older browsers: select a temporary field
      const tmp = Object.assign(document.createElement('textarea'), { value: number })
      document.body.appendChild(tmp)
      tmp.select()
      document.execCommand('copy')
      tmp.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!number) {
    return (
      <div className="whish-panel">
        <p>{t('checkout.whishPending')}</p>
        <a className="btn btn--whatsapp btn--sm" href={whatsappLink(t('whatsapp.whishAsk'))} target="_blank" rel="noopener noreferrer">
          <Icon name="whatsapp" size={18} /> {t('checkout.whishAsk')}
        </a>
        <p className="field-hint">{t('checkout.whishManual')}</p>
      </div>
    )
  }

  return (
    <div className="whish-panel">
      <p>{t('checkout.whishSteps', { total: formatPrice(total, lang) })}</p>
      <div className="whish-panel__number">
        <div>
          <span className="whish-panel__label">{t('checkout.whishNumber')}</span>
          <strong dir="ltr">{number}</strong>
          {accountName && <span className="muted">{t('checkout.whishAccount')}: {accountName}</span>}
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'copy'} size={16} /> {copied ? t('common.copied') : t('common.copy')}
        </button>
      </div>
      <p className="field-hint">{t('checkout.whishManual')}</p>
    </div>
  )
}
