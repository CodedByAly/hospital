// Label + control + error message with the right aria wiring.
export default function Field({ id, label, optional, error, hint, children, className = '' }) {
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label className="field-label" htmlFor={id}>
        {label}
        {optional && <span className="field-optional">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function describedBy(id, error, hint) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}
