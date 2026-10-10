// Small inline icon set (stroke icons, 24px grid). Brand marks use their official shapes.
const paths = {
  bag: <><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  phone: <path d="M6.6 3.5h2.6l1.4 4-2 1.3a12 12 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
  pin: <><path d="M12 21s-6.5-6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21Z" /><circle cx="12" cy="9.8" r="2.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></>,
  trash: <><path d="M4.5 7h15M10 11v6M14 11v6" /><path d="M6.5 7l.8 11.2a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" /></>,
  edit: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />,
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z" />,
  menu: <><path d="M5 4.5h11a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3v-12Z" /><path d="M9 9h6M9 12.5h6" /></>,
  chat: <path d="M4.5 18.5V6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-3.5 2Z" />,
  star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.8l-5.1 2.6 1-5.6-4.1-4 5.7-.8L12 3.8Z" />,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>,
  alert: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5.5M12 16.2h.01" /></>,
  wallet: <><rect x="3.5" y="6" width="17" height="13" rx="2" /><path d="M16 12.5h2M3.5 9.5h17" /></>,
  cash: <><rect x="3" y="6.5" width="18" height="11" rx="1.5" /><circle cx="12" cy="12" r="2.5" /><path d="M6.5 9.5v5M17.5 9.5v5" /></>,
  scooter: <><circle cx="6.5" cy="17" r="2.5" /><circle cx="17.5" cy="17" r="2.5" /><path d="M9 17h6l2.5-8H14M17.5 9 15 4.5h-2.5M4 13h6" /></>,
  store: <><path d="M4 9.5 5.5 4.5h13L20 9.5a2.7 2.7 0 0 1-5.3.6 2.7 2.7 0 0 1-5.4 0A2.7 2.7 0 0 1 4 9.5Z" /><path d="M5.5 12v7.5h13V12M10 19.5v-4.5h4v4.5" /></>,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.9" /><path d="M17.2 6.8h.01" strokeWidth="2.6" /></>,
  external: <path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10" />,
}

const brands = {
  whatsapp: (
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5a9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6a4.2 4.2 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.2-.6-.4ZM12 21.3a9.3 9.3 0 0 1-4.7-1.3l-.4-.2-3.5.9.9-3.4-.2-.4A9.3 9.3 0 1 1 12 21.3Zm7.9-17.2A11.1 11.1 0 0 0 2.4 17.5L.8 23.2l5.9-1.5a11.1 11.1 0 0 0 5.3 1.4 11.1 11.1 0 0 0 7.9-19Z" />
  ),
  facebook: <path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6a21 21 0 0 0-2.4-.1C12.2 2.5 10.6 4 10.6 6.6v1.9H8v3.2h2.6v9.8H14v-9.8h2.6l.4-3.2H14Z" />,
  tiktok: <path d="M16.6 3h-3.2v12.4a2.8 2.8 0 1 1-2-2.7V9.4a6 6 0 1 0 5.2 6V9.1a7.8 7.8 0 0 0 4.4 1.4V7.3A4.5 4.5 0 0 1 16.6 3Z" />,
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.8, ...rest }) {
  const brand = brands[name]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`icon ${className}`}
      fill={brand ? 'currentColor' : 'none'}
      stroke={brand ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {brand || paths[name]}
    </svg>
  )
}
