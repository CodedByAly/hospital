import { cloneElement, useId } from 'react';

/** Label + control + hint + error, wired up with the right aria attributes. */
export default function Field({ label, hint, error, required, requiredLabel, className = '', children }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const control = cloneElement(children, {
    id,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
    'aria-required': required ? 'true' : undefined,
  });
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id} className="field__label">
        {label}
        {required && (
          <span className="field__req" aria-hidden="true" title={requiredLabel}>
            *
          </span>
        )}
      </label>
      {control}
      {hint && !error && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
