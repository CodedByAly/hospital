/* Inline stroke icons (24×24 grid). Decorative unless a `title` is given. */
const paths = {
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
  menu: (
    <>
      <path d="M5 7h14M5 12h14M5 17h9" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  chat: <path d="M5 18l1.2-3.2A7 7 0 1 1 9 17.4L5 18z" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />
    </>
  ),
  edit: <path d="M5 19h4L19 9l-4-4L5 15v4zM13 7l4 4" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2" />
    </>
  ),
  phone: (
    <path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3A2 2 0 0 1 18 19.5 15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2z" />
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.8" />
    </>
  ),
  scooter: (
    <>
      <circle cx="6.5" cy="17" r="2.5" />
      <circle cx="17.5" cy="17" r="2.5" />
      <path d="M9 17h6l2-7h-3M14 6h2.5l1 4M4 12h6l1 5" />
    </>
  ),
  store: (
    <>
      <path d="M4 9l1.5-4h13L20 9M4 9h16M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9" />
      <path d="M5.5 11.5V19h13v-7.5M10 19v-4h4v4" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="7" width="18" height="11" rx="1.5" />
      <circle cx="12" cy="12.5" r="2.4" />
      <path d="M6.5 10v.01M17.5 15v.01" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7.5A1.5 1.5 0 0 1 5.5 6H17v3" />
      <rect x="4" y="9" width="16" height="10" rx="1.5" />
      <path d="M16 14h.01" />
    </>
  ),
  star: (
    <path d="M12 4.5l2.3 4.8 5.2.7-3.8 3.6.9 5.2L12 16.3l-4.6 2.5.9-5.2-3.8-3.6 5.2-.7L12 4.5z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.4 2.2 3.5 5 3.5 8s-1.1 5.8-3.5 8c-2.4-2.2-3.5-5-3.5-8S9.6 6.2 12 4z" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.6 7.4h.01" />
    </>
  ),
  tiktok: (
    <path d="M14.5 4c.4 2.6 2 4.2 4.5 4.5v3a8 8 0 0 1-4.5-1.5v5.3a5.2 5.2 0 1 1-5.2-5.2h.2v3.1h-.2a2.1 2.1 0 1 0 2.1 2.1V4h3.1z" />
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.4-4A8 8 0 1 1 8.4 19L4 20z" />
      <path d="M9.2 9.3c.2 2.6 2.3 4.9 5.2 5.4l1.1-1.2-1.8-.9-.8.8c-1-.4-1.9-1.3-2.4-2.4l.8-.8-.9-1.8-1.2.9z" />
    </>
  ),
};

export default function Icon({ name, size = 20, title, className = '', strokeWidth = 1.7 }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
