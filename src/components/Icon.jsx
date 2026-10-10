/** Small inline icon set (stroke icons on a 24px grid) — avoids an icon library. */
const paths = {
  bag: <><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  back: <path d="M19 12H5m5 5-5-5 5-5" />,
  up: <path d="M12 19V5m-6 6 6-6 6 6" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  phone: <path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></>,
  edit: <path d="M4.5 19.5h4l10-10-4-4-10 10v4ZM13 7l4 4" />,
  trash: <path d="M5 7h14M10 7V5h4v2m-7 0 .8 12h8.4L17 7" />,
  home: <path d="M4 11 12 4l8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5V11Z" />,
  menu: <><path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15l-3-1.6-3 1.6-3-1.6-3 1.6V5A1.5 1.5 0 0 1 6 3.5Z" /><path d="M9 8.5h6M9 12h6" /></>,
  chat: <path d="M4.5 18.5 5.6 15A7.5 7.5 0 1 1 9 18.4l-4.5.1Z" />,
  star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8L12 3.8Z" />,
  cash: <><rect x="3" y="6.5" width="18" height="11" rx="1.5" /><circle cx="12" cy="12" r="2.5" /></>,
  wallet: <><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6H18v3" /><rect x="4" y="9" width="16" height="10" rx="1.5" /><path d="M16 14h.01" /></>,
  table: <path d="M3.5 9h17M6 9v10M18 9v10M8 5h8" />,
  walk: <><circle cx="13" cy="4.5" r="1.8" /><path d="m9 21 2.5-6.5L14 17v4m-4-8.5L12 8l3 3.5 3 1M10 12.5 7 14" /></>,
  scooter: <><circle cx="6" cy="17.5" r="2.5" /><circle cx="18" cy="17.5" r="2.5" /><path d="M8.5 17.5h7l-2-7H10m5.5 0H18l2.5 7M11 6.5h3" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5Z" /></>,
}

const brands = {
  instagram: (
    <path d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.1a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.3 8.2c-.1-1.5-.4-2.8-1.5-3.9s-2.4-1.4-3.9-1.5c-1.5-.1-6.2-.1-7.8 0-1.5.1-2.8.4-3.9 1.5S2.8 6.7 2.7 8.2c-.1 1.5-.1 6.2 0 7.8.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 6.2.1 7.8 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.6.1-6.2 0-7.8Zm-2 9.5a3.2 3.2 0 0 1-1.8 1.8c-1.2.5-4.2.4-5.5.4s-4.3.1-5.5-.4a3.2 3.2 0 0 1-1.8-1.8c-.5-1.2-.4-4.2-.4-5.5s-.1-4.3.4-5.5a3.2 3.2 0 0 1 1.8-1.8c1.2-.5 4.2-.4 5.5-.4s4.3-.1 5.5.4a3.2 3.2 0 0 1 1.8 1.8c.5 1.2.4 4.2.4 5.5s.1 4.3-.4 5.5Z" />
  ),
  whatsapp: (
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4ZM12 21.5a9.5 9.5 0 0 1-4.8-1.3l-.3-.2-3.6.9 1-3.5-.2-.4A9.5 9.5 0 1 1 12 21.5Zm0-21A11.4 11.4 0 0 0 2.2 17.7L.6 23.4l5.9-1.5A11.4 11.4 0 1 0 12 .5Z" />
  ),
}

export default function Icon({ name, size = 20, className = '', ...rest }) {
  const brand = brands[name]
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...(brand
        ? { fill: 'currentColor' }
        : { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' })}
      {...rest}
    >
      {brand ?? paths[name]}
    </svg>
  )
}
