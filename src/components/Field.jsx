import { useId } from 'react'
import './Field.css'

export default function Field({ label, error, hint, optional, as = 'input', className = '', ...props }) {
  const id = useId()
  const Tag = as
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__optional"> ({optional})</span>}
      </label>
      <Tag id={id} className="field__input" aria-invalid={error ? 'true' : undefined} aria-describedby={describedBy} {...props} />
      {hint && !error && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
