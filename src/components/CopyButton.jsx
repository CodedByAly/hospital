import { useState } from 'react'
import Icon from './Icon'

export default function CopyButton({ text, label = 'Copy', className = '' }) {
  const [state, setState] = useState('idle')

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2000)
  }

  return (
    <button type="button" className={`copy-btn ${state === 'copied' ? 'is-copied' : ''} ${className}`} onClick={copy}>
      <Icon name={state === 'copied' ? 'check' : 'copy'} size={16} strokeWidth={2} />
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : label}</span>
    </button>
  )
}
