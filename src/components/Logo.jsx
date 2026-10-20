// The Chippy wordmark (vector redraw of the logo, see /public/logo.svg).
// `light` is the white version used on the dark footer.
export default function Logo({ className, light = false, alt = 'Chippy, A Taste To Remember' }) {
  return (
    <img
      className={className}
      src={light ? '/logo-light.svg' : '/logo.svg'}
      width="393"
      height="204"
      alt={alt}
      decoding="async"
    />
  )
}
