import { useEffect, useState } from 'react'
import { t } from '../content/text'
import Icon from './Icon'

export default function CopyButton({ value, className = '' }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Fallback for browsers without the async clipboard API.
      const input = document.createElement('textarea')
      input.value = value
      input.setAttribute('readonly', '')
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
  }

  return (
    <button type="button" className={`copy-btn ${copied ? 'is-copied' : ''} ${className}`} onClick={copy}>
      <Icon name={copied ? 'check' : 'copy'} size={16} />
      <span aria-live="polite">{copied ? t('checkout.copied') : t('checkout.copy')}</span>
    </button>
  )
}
