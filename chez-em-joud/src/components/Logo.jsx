import { logoGreen, logoRed, logoViewBox } from './logoPaths'

// "Chez Em Joud" in the two brand colours. Pass mono to draw it in currentColor.
export default function Logo({ className = '', title, mono = false }) {
  return (
    <svg
      className={`logo ${className}`}
      viewBox={logoViewBox}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path className="logo__green" fill={mono ? 'currentColor' : '#7b8347'} fillRule="evenodd" d={logoGreen} />
      <path className="logo__red" fill={mono ? 'currentColor' : '#841d2a'} fillRule="evenodd" d={logoRed} />
    </svg>
  )
}
