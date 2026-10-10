// Hand-drawn sticker-style SVG food used for the flying/floating decorations.
// All are decorative: callers render them inside aria-hidden containers.

const INK = '#1C1917'
const s = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }

export function Drumstick(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M78 34c14 14 12 38-6 50S30 92 24 78 40 34 52 28s18-2 26 6z" fill="#D97706" {...s} />
      <path d="M44 46c6-6 14-8 20-6" fill="none" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
      <path d="M72 82l18 18" {...s} strokeWidth="12" stroke={INK} />
      <path d="M72 82l18 18" stroke="#FFF7ED" strokeWidth="6" strokeLinecap="round" />
      <circle cx="96" cy="98" r="8" fill="#FFF7ED" {...s} />
      <circle cx="88" cy="106" r="8" fill="#FFF7ED" {...s} />
    </svg>
  )
}

export function Fries(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      {[30, 42, 54, 66, 78, 90].map((x, i) => (
        <rect key={x} x={x - 5} y={14 + (i % 3) * 8} width="10" height="56" rx="3" fill="#FBBF24" {...s} transform={`rotate(${(i - 2.5) * 5} ${x} 70)`} />
      ))}
      <path d="M22 52h76l-10 58H32z" fill="#E8412F" {...s} />
      <path d="M34 66c8 6 18 9 26 9s18-3 26-9" fill="none" stroke="#FFF7ED" strokeWidth="5" strokeLinecap="round" />
      <circle cx="60" cy="92" r="8" fill="#FFF7ED" {...s} strokeWidth="3" />
    </svg>
  )
}

export function Burger(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M16 54c0-22 20-36 44-36s44 14 44 36z" fill="#F59E0B" {...s} />
      {[[40, 32], [58, 28], [76, 34], [50, 42], [68, 44]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="3" ry="1.8" fill="#FFF7ED" />
      ))}
      <path d="M12 60c10 8 18-6 28 2s18-6 28 2 18-6 28 2 12 0 12 0" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
      <path d="M14 62h92l-6 10H20z" fill="#FACC15" {...s} />
      <rect x="14" y="72" width="92" height="16" rx="8" fill="#7C2D12" {...s} />
      <path d="M18 92h84c0 10-8 16-18 16H36c-10 0-18-6-18-16z" fill="#F59E0B" {...s} />
    </svg>
  )
}

export function Chili(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M84 30c-6 30-26 60-62 74-6 2-6-6-2-8 24-14 38-38 46-66 2-6 18-8 18 0z" fill="#DC2626" {...s} />
      <path d="M70 22c4 2 10 4 14 8M78 26c4-8 10-12 18-12" fill="none" stroke="#16A34A" strokeWidth="7" strokeLinecap="round" />
      <path d="M64 46c-4 14-12 28-22 38" fill="none" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Soda(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M66 6l-4 26" {...s} stroke={INK} strokeWidth="9" />
      <path d="M66 6l-4 26" stroke="#2FC0CC" strokeWidth="4" strokeLinecap="round" />
      <path d="M32 30h56l-8 82H40z" fill="#2FC0CC" {...s} />
      <rect x="28" y="24" width="64" height="12" rx="4" fill="#FFF7ED" {...s} />
      <path d="M38 58h44l-3 30H41z" fill="#FFF7ED" {...s} strokeWidth="3" />
      <circle cx="60" cy="73" r="7" fill="#E8412F" />
    </svg>
  )
}

export function Wrap(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M34 20l56 22-30 72-50-28z" fill="#FDE68A" {...s} />
      <path d="M34 20c10-6 20-2 22 6 10-6 22 0 22 8 8-2 14 4 12 8" fill="#22C55E" {...s} />
      <path d="M40 30c8 2 14 8 16 14M58 36c8 0 14 6 16 12" fill="none" stroke="#E8412F" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 70l40 22" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10" />
      <path d="M44 54l40 22" fill="none" stroke="#D97706" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10" />
    </svg>
  )
}

export function Sub(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path d="M10 62c0-14 10-22 26-22h48c16 0 26 8 26 22z" fill="#F59E0B" {...s} />
      {[24, 40, 56, 72, 88].map((x, i) => (
        <ellipse key={x} cx={x + 4} cy={50 + (i % 2) * 4} rx="3" ry="1.8" fill="#FFF7ED" />
      ))}
      <path d="M8 64c8 6 14-4 22 2s14-4 22 2 14-4 22 2 14-4 22 2 12-2 16 0" fill="none" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" />
      <rect x="10" y="66" width="100" height="12" rx="6" fill="#D97706" {...s} />
      <path d="M12 82h96c0 10-8 14-18 14H30c-10 0-18-4-18-14z" fill="#F59E0B" {...s} />
    </svg>
  )
}

export function Bowl(props) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <circle cx="40" cy="52" r="16" fill="#22C55E" {...s} />
      <circle cx="62" cy="44" r="18" fill="#16A34A" {...s} />
      <circle cx="82" cy="54" r="14" fill="#22C55E" {...s} />
      <circle cx="56" cy="58" r="7" fill="#E8412F" {...s} strokeWidth="3" />
      <path d="M14 62h92c0 26-20 44-46 44S14 88 14 62z" fill="#FFF7ED" {...s} />
      <path d="M30 76c8 8 18 12 30 12s22-4 30-12" fill="none" stroke="#2FC0CC" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export function Footprint(props) {
  // Chicken footprint like the trail printed on the menu
  return (
    <svg viewBox="0 0 40 40" {...props}>
      <path d="M20 36V18M20 18L8 6M20 18L32 6M20 18V3M20 30l-8 6" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

export function Chick(props) {
  // Simplified Taktawook mascot
  return (
    <svg viewBox="0 0 120 120" color="#E8412F" {...props}>
      <path d="M52 22c-4-8 4-14 10-10 2-6 12-6 12 2 6-2 10 4 6 8z" fill="currentColor" />
      <path d="M30 70c-2-10 2-18 8-20l2 8 6-10c4-14 12-24 26-24 16 0 24 12 22 24l12 6-12 4c-2 12-6 22-14 30-14 12-46 10-50-18z" fill="currentColor" />
      <circle cx="76" cy="44" r="9" fill="#FFF" />
      <circle cx="78" cy="44" r="4" fill={INK} />
      <path d="M58 100v12M58 112h-6M58 112l6 2M66 100v10l6 2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export const FLYERS = { Drumstick, Fries, Burger, Chili, Soda, Wrap, Chick, Sub, Bowl }
