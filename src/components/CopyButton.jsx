import { useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'

export default function CopyButton({ value, label = 'نسخ' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Older browsers / insecure contexts
      const area = document.createElement('textarea')
      area.value = value
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      area.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button type="button" className={`copy-btn ${copied ? 'is-copied' : ''}`} onClick={copy}>
      {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      <span aria-live="polite">{copied ? 'انتسخ' : label}</span>
    </button>
  )
}
