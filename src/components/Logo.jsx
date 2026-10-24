import { lockupBean, lockupText, lockupViewBox, markBean, markViewBox } from './logoPaths'

// Full "bean + BEAN AVENUE" lockup. Colour comes from `currentColor`.
export function Lockup({ className = '', title }) {
  return (
    <svg
      className={`lockup ${className}`}
      viewBox={lockupViewBox}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path className="lockup__bean" fill="currentColor" fillRule="evenodd" d={lockupBean} />
      <path className="lockup__text" fill="currentColor" fillRule="evenodd" d={lockupText} />
    </svg>
  )
}

// The bean on its own (Instagram avatar version).
export function BeanMark({ className = '', ...rest }) {
  return (
    <svg className={className} viewBox={markViewBox} aria-hidden="true" focusable="false" {...rest}>
      <path fill="currentColor" fillRule="evenodd" d={markBean} />
    </svg>
  )
}
