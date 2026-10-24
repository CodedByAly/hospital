/**
 * The Chicago Burgers mark, redrawn as vector from the brand logo
 * so it stays sharp at any size. The wordmark is set in Oswald.
 */
export function LogoMark({ className = '', title, strokeWidth = 5 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 388 320"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M42 206C24 206 12 196 12 176V162C12 72 96 10 194 10S376 72 376 162V176C376 196 364 206 346 206C316 206 300 202 284 192C256 175 232 166 194 166S132 175 104 192C88 202 72 206 42 206Z" />
      <path d="M14 170Q194 4 374 170" />
      <path d="M12 214H376V236H100L64 262L74 249H12Z" />
      <path d="M12 250V266C12 296 26 312 54 312H334C362 312 376 296 376 266V250H118" />
    </svg>
  );
}

export function Logo({ className = '', stacked = false }) {
  return (
    <span className={`logo ${stacked ? 'logo--stacked' : ''} ${className}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__word">
        <span className="logo__chicago">Chicago</span>
        <span className="logo__burgers">Burgers</span>
      </span>
    </span>
  );
}
