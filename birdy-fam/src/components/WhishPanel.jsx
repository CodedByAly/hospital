import { useState } from 'react'
import { restaurant, formatPhone } from '../data/restaurant.js'
import { formatPrice } from '../lib/format.js'
import Icon from './Icon.jsx'

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers without async clipboard (older iOS, insecure context).
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

export default function WhishPanel({ amount, feeUnknown }) {
  const [copied, setCopied] = useState(false)
  const number = restaurant.whishNumber

  const copy = async () => {
    if (await copyText(number)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="whish" aria-live="polite">
      <p className="whish__label">Birdy Fam Whish number</p>
      <div className="whish__number-row">
        <span className="whish__number">{formatPhone(number)}</span>
        <button type="button" className={`whish__copy ${copied ? 'is-copied' : ''}`} onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={16} strokeWidth={2.2} />
          {copied ? 'Copied' : 'Copy number'}
        </button>
      </div>
      <ol className="whish__steps">
        {feeUnknown ? (
          <li>Send your order first. The branch replies on WhatsApp with the total including delivery.</li>
        ) : null}
        <li>
          In the Whish app, send <strong>{formatPrice(amount)}</strong>
          {feeUnknown ? ' plus the delivery fee' : ''} to {formatPhone(number)}.
        </li>
        <li>Share a screenshot of the transfer in the same WhatsApp chat as your order.</li>
        <li>We check the transfer and confirm. Transfers are checked by the team, not automatically.</li>
      </ol>
    </div>
  )
}
