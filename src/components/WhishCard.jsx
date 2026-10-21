import { useState } from 'react'
import { restaurant } from '../config/restaurant.js'
import { IconCheck, IconCopy } from './Icons.jsx'

// Shows the restaurant's Whish number with a copy button. Payment is confirmed by the team, not automatically.
export function WhishCard({ children }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(restaurant.whish.copyValue)
    } catch {
      // Older browsers: fall back to a temporary input.
      const input = document.createElement('input')
      input.value = restaurant.whish.copyValue
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="whish">
      <div className="whish__row">
        <div>
          <p className="whish__label">Whish Money number</p>
          <p className="whish__number">{restaurant.whish.number}</p>
          <p className="whish__name">Account: {restaurant.whish.accountName}</p>
        </div>
        <button type="button" className={`btn btn--small ${copied ? 'btn--done' : 'btn--ghost'}`} onClick={copy}>
          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy number'}</span>
        </button>
      </div>
      {children}
    </div>
  )
}
