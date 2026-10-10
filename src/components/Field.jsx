import { cloneElement, useId } from 'react'
import { useLanguage } from '../context/LanguageContext'

/** Label + control + hint + error, wired up with the right aria attributes. */
export default function Field({ label, hint, error, optional = false, children, className = '' }) {
  const { t } = useLanguage()
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      <label className="field-label" htmlFor={id}>
        {label}
        {optional && <span className="muted"> ({t('checkout.optional')})</span>}
      </label>
      {cloneElement(children, { id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && !error && <p className="field-hint" id={hintId}>{hint}</p>}
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  )
}
