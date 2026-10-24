// Small inline icons, 24px grid, stroke-based so they inherit text colour.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const InstagramIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

export const WhatsAppIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4.3 19.7l1.1-3.9A8.2 8.2 0 1 1 8.6 19z" />
    <path d="M9.2 8.4c.2-.4.5-.4.8-.4h.4c.2 0 .3.1.4.3l.6 1.4c.1.2 0 .4-.1.5l-.5.6c.5 1 1.3 1.8 2.3 2.3l.6-.5c.1-.1.3-.2.5-.1l1.4.6c.2.1.3.2.3.4v.4c0 .3-.1.6-.4.8-.5.4-1.3.6-2.2.3a8 8 0 0 1-4.3-4.3c-.3-.9-.2-1.8.2-2.3z" />
  </svg>
)

export const PhoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4.5h3l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7l1.3-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5z" />
  </svg>
)

export const PinIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
)

export const ClockIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.5 15.5L20 20" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ArrowUpIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
)

export const ArrowRightIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
