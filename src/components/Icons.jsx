// Small inline icon set (stroke icons on a 24px grid) so no icon library is needed.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const make = (children) =>
  function Icon({ size = 20, ...props }) {
    return (
      <svg {...base} width={size} height={size} {...props}>
        {children}
      </svg>
    )
  }

export const IconBag = make(
  <>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>,
)
export const IconPlus = make(<path d="M12 5v14M5 12h14" />)
export const IconMinus = make(<path d="M5 12h14" />)
export const IconClose = make(<path d="M6 6l12 12M18 6 6 18" />)
export const IconSearch = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>,
)
export const IconArrowRight = make(<path d="M5 12h14m-5-6 6 6-6 6" />)
export const IconArrowUp = make(<path d="M12 19V5m-6 6 6-6 6 6" />)
export const IconArrowLeft = make(<path d="M19 12H5m5-6-6 6 6 6" />)
export const IconPhone = make(
  <path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
)
export const IconPin = make(
  <>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>,
)
export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
)
export const IconMail = make(
  <>
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </>,
)
export const IconHome = make(
  <>
    <path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4v-9.5Z" />
  </>,
)
export const IconMenuBook = make(
  <>
    <path d="M5 4.5h10.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z" />
    <path d="M9 9h6M9 12.5h6" />
  </>,
)
export const IconInfo = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8h.01" />
  </>,
)
export const IconChat = make(
  <path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6a2.5 2.5 0 0 1-2.5 2.5H9l-4 3Z" />,
)
export const IconCopy = make(
  <>
    <rect x="8.5" y="8.5" width="11" height="11" rx="1.5" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </>,
)
export const IconCheck = make(<path d="m5 12.5 4.5 4.5L19 7.5" />)
export const IconTrash = make(
  <>
    <path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7" />
  </>,
)
export const IconEdit = make(<path d="M15 5.5 18.5 9 9 18.5H5.5V15L15 5.5Z" />)
export const IconStar = ({ size = 20, filled, ...props }) => (
  <svg {...base} width={size} height={size} fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6L12 4Z" />
  </svg>
)
export const IconScooter = make(
  <>
    <circle cx="6.5" cy="17" r="2.5" />
    <circle cx="17.5" cy="17" r="2.5" />
    <path d="M9 17h6l2-7h-3M14 10l-2-4H9M4 13h6" />
  </>,
)
export const IconStore = make(
  <>
    <path d="M4 9.5 5.5 5h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
    <path d="M5.5 12v7.5h13V12M10 19.5v-4h4v4" />
  </>,
)
export const IconCash = make(
  <>
    <rect x="3" y="6.5" width="18" height="11" rx="1.5" />
    <circle cx="12" cy="12" r="2.5" />
  </>,
)
export const IconWallet = make(
  <>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17v3" />
    <rect x="4" y="8" width="16" height="11" rx="1.5" />
    <path d="M16 13.5h.01" />
  </>,
)

// Brand glyphs (filled)
export function IconInstagram({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 3.2c2.9 0 3.2 0 4.3.1 1 0 1.6.2 2 .4.5.2.9.4 1.3.8.4.4.6.8.8 1.3.1.4.3 1 .4 2 0 1.1.1 1.5.1 4.3s0 3.2-.1 4.3c0 1-.2 1.6-.4 2-.2.5-.4.9-.8 1.3-.4.4-.8.6-1.3.8-.4.1-1 .3-2 .4-1.1 0-1.5.1-4.3.1s-3.2 0-4.3-.1c-1 0-1.6-.2-2-.4-.5-.2-.9-.4-1.3-.8-.4-.4-.6-.8-.8-1.3-.1-.4-.3-1-.4-2 0-1.1-.1-1.5-.1-4.3s0-3.2.1-4.3c0-1 .2-1.6.4-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.1 1-.3 2-.4 1.1 0 1.4-.1 4.3-.1Zm0 4.4a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 7.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Zm4.6-8.4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
      />
    </svg>
  )
}

export function IconWhatsApp({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.6 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5Zm0 17.2c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.8 7.8 0 1 1 12 19.7Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.6 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.2Z"
      />
    </svg>
  )
}

export const socialIcons = { instagram: IconInstagram, whatsapp: IconWhatsApp }
