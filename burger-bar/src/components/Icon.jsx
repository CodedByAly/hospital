// Small hand-picked icon set (stroke icons on a 24px grid) — avoids pulling in an icon library.
const paths = {
  bag: <><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
  phone: <path d="M6.6 3.5h2.6l1.5 4-2 1.3a11 11 0 0 0 6.5 6.5l1.3-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2.1-2.2Z" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2" /><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5" /></>,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" />,
  trash: <><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4v-9.5Z" /></>,
  menu: <><path d="M5 6.5h14M5 12h14M5 17.5h9" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.6v.2" /></>,
  chat: <><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12Z" /></>,
  store: <><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /><path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" /></>,
  scooter: <><circle cx="6" cy="17" r="2.5" /><circle cx="18" cy="17" r="2.5" /><path d="M8.5 17h7M15 6h2.5l2 8.5M15 6v5.5H9.5L8 14.5M3.5 11.5h6" /></>,
  cash: <><rect x="3" y="6.5" width="18" height="11" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6.5 9.5v.01M17.5 14.5v.01" /></>,
  wallet: <><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" /><rect x="4" y="8" width="16" height="11" rx="2" /><path d="M16 13.5h.01" /></>,
  star: <path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6L12 4Z" />,
};

export default function Icon({ name, size = 20, className, strokeWidth = 1.8, filled = false }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

// Brand marks use their official solid shapes.
export function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M19.1 4.9A9.9 9.9 0 0 0 3.5 16.8L2.1 22l5.3-1.4A9.9 9.9 0 0 0 22 12a9.8 9.8 0 0 0-2.9-7.1ZM12 20.2c-1.5 0-2.9-.4-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
    </svg>
  );
}
