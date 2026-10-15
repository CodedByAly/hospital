const paths = {
  bag: (
    <>
      <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 8h16M4 16h10" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </>
  ),
  trash: <path d="M5 7h14M10 7V5h4v2m-7 0 .8 12a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L18 7" />,
  edit: <path d="m14.5 5.5 4 4L9 19H5v-4l9.5-9.5Z" />,
  phone: (
    <path d="M6.6 3.8 9 4.2l1.3 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.3.4 2.4a2 2 0 0 1-2 2.3A16.6 16.6 0 0 1 2.3 5.8a2 2 0 0 1 2.3-2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11.5a7 7 0 1 0-14 0C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  store: (
    <>
      <path d="M4 9.5 5.5 4h13L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" />
    </>
  ),
  scooter: (
    <>
      <circle cx="6.5" cy="17" r="2.5" />
      <circle cx="17.5" cy="17" r="2.5" />
      <path d="M9 17h6l2-6h-3.5M14 6h2.5l1 5M4 13h5l1 4" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="1.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9.5v.01M17.5 14.5v.01" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6H18v3" />
      <rect x="4" y="9" width="16" height="10" rx="1.5" />
      <path d="M16 14h.01" />
    </>
  ),
  star: (
    <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6L12 16.6l-5 2.7.9-5.6-4-4 5.6-.8L12 3.8Z" />
  ),
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  chat: (
    <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5Z" />
  ),
  // Brand glyphs use fill instead of stroke.
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8v.01" strokeWidth="2.2" />
    </>
  ),
};

const filled = {
  whatsapp: (
    <path d="M12.04 2.5a9.43 9.43 0 0 0-8.1 14.26L2.5 21.5l4.87-1.4A9.44 9.44 0 1 0 12.04 2.5Zm0 17.2a7.8 7.8 0 0 1-3.98-1.1l-.28-.17-2.9.83.86-2.82-.19-.29a7.79 7.79 0 1 1 6.5 3.55Zm4.28-5.83c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06a6.4 6.4 0 0 1-3.17-2.77c-.24-.41.24-.38.68-1.27.08-.15.04-.29-.02-.4-.06-.12-.53-1.27-.72-1.74-.19-.46-.39-.39-.53-.4h-.45a.87.87 0 0 0-.63.29 2.64 2.64 0 0 0-.82 1.96 4.59 4.59 0 0 0 .96 2.43 10.5 10.5 0 0 0 4.02 3.55c1.5.65 2.08.7 2.83.6.46-.07 1.38-.57 1.58-1.12.2-.55.2-1.02.14-1.12-.06-.1-.21-.16-.44-.28Z" />
  ),
  facebook: (
    <path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6V21h3.1Z" />
  ),
  tiktok: (
    <path d="M16.6 3h-3v12.3a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.6a5.8 5.8 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.2 1.3V7.4A4.3 4.3 0 0 1 16.6 3Z" />
  ),
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.6 }) {
  const isFilled = name in filled;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {isFilled ? filled[name] : paths[name]}
    </svg>
  );
}
