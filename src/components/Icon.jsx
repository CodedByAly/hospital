// Small inline icon set (stroke icons on a 24px grid) so no icon
// library is shipped. Brand marks use their official simple shapes.
const paths = {
  bag: <><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  phone: <path d="M6.6 3.5h2.7l1.4 4.1-2 1.3a12 12 0 0 0 6.4 6.4l1.3-2 4.1 1.4v2.7a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  trash: <><path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l.8 12.1a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7" /></>,
  edit: <><path d="M4.5 19.5h4l10-10a2.1 2.1 0 0 0-4-4l-10 10v4Z" /><path d="m13.5 6.5 4 4" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15V15h-6v5.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z" /></>,
  menu: <><path d="M5 5.5h14M5 12h14M5 18.5h9" /></>,
  chat: <><path d="M5 18.5V6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5L5 19.5" /></>,
  truck: <><path d="M3.5 6.5h10v10h-10zM13.5 10h4l3 3.2v3.3h-7" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  store: <><path d="M4.5 9.5 6 4.5h12l1.5 5" /><path d="M4.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" /></>,
  cash: <><rect x="3" y="6.5" width="18" height="11" rx="1.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6.5 9.5v5M17.5 9.5v5" /></>,
  wallet: <><path d="M4.5 7.5v10a2 2 0 0 0 2 2h12v-12h-14Zm0 0 11-3v3" /><circle cx="15.5" cy="13.5" r="1.1" /></>,
  star: <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6L12 4Z" />,
  alert: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v4.5M12 16h.01" /></>,
}

const brands = {
  instagram: (
    <path d="M12 3.2c2.4 0 2.7 0 3.6.1 2.4.1 3.6 1.3 3.7 3.7.1.9.1 1.2.1 3.6v2.8c0 2.4 0 2.7-.1 3.6-.1 2.4-1.3 3.6-3.7 3.7-.9.1-1.2.1-3.6.1H9.2c-2.4 0-2.7 0-3.6-.1-2.4-.1-3.6-1.3-3.7-3.7-.1-.9-.1-1.2-.1-3.6v-2.8c0-2.4 0-2.7.1-3.6.1-2.4 1.3-3.6 3.7-3.7.9-.1 1.2-.1 3.6-.1H12Zm0-1.7H9.2C6.7 1.5 6.4 1.5 5.5 1.6 2.3 1.7.6 3.5.4 6.6.3 7.5.3 7.8.3 10.4v3.2c0 2.6 0 2.9.1 3.8.2 3.1 1.9 4.9 5.1 5 .9.1 1.2.1 3.8.1h5.4c2.6 0 2.9 0 3.8-.1 3.1-.1 4.9-1.9 5-5 .1-.9.1-1.2.1-3.8v-3.2c0-2.6 0-2.9-.1-3.8-.1-3.1-1.9-4.9-5-5-.9-.1-1.2-.1-3.8-.1H12Zm0 5.3a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm5.4-10a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z" />
  ),
  whatsapp: (
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1l-.9 1.2c-.2.2-.3.2-.6.1-1.5-.7-2.9-1.8-3.8-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.3 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.7.9 3.6.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4l-.5-.2ZM12 21.8c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.6.9 1-3.5-.2-.4A9.8 9.8 0 1 1 12 21.8Zm0-21.6A11.8 11.8 0 0 0 1.9 18L.2 23.8l6-1.6A11.8 11.8 0 1 0 12 .2Z" />
  ),
  facebook: <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4Z" />,
  tiktok: <path d="M16.6 2.5h-3.3v13.2a2.9 2.9 0 1 1-2-2.8V9.5a6.2 6.2 0 1 0 5.3 6.2V9a7.5 7.5 0 0 0 4.4 1.4V7.1a4.4 4.4 0 0 1-4.4-4.6Z" />,
}

export default function Icon({ name, size = 20, className, strokeWidth = 1.7, title }) {
  const brand = brands[name]
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' }
  if (brand) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...a11y}>
        {brand}
      </svg>
    )
  }
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
    >
      {paths[name]}
    </svg>
  )
}
