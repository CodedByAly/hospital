// Small inline icon set (no icon font, no extra requests). 24px grid, stroke-based.
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
};

const make = (children, extra = {}) =>
  function Icon({ size = 20, ...props }) {
    return (
      <svg {...base} {...extra} width={size} height={size} {...props}>
        {children}
      </svg>
    );
  };

export const BagIcon = make(
  <>
    <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </>,
);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const MinusIcon = make(<path d="M5 12h14" />);
export const CloseIcon = make(<path d="M6 6l12 12M18 6 6 18" />);
export const SearchIcon = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>,
);
export const ArrowRightIcon = make(<path d="M5 12h14m-5-5 5 5-5 5" />, { className: 'icon-dir' });
export const ArrowLeftIcon = make(<path d="M19 12H5m5-5-5 5 5 5" />);
export const ArrowUpIcon = make(<path d="M12 19V5m-6 6 6-6 6 6" />);
export const PhoneIcon = make(
  <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />,
);
export const PinIcon = make(
  <>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </>,
);
export const ClockIcon = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
);
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const CopyIcon = make(
  <>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </>,
);
export const EditIcon = make(<path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" />);
export const TrashIcon = make(<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.9 12.1a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />);
export const HomeIcon = make(<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z" />);
export const MenuBookIcon = make(
  <>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v14H5.5A1.5 1.5 0 0 0 4 19.5v-14Z" />
    <path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H19v-3M8 8.5h7M8 12h5" />
  </>,
);
export const InfoIcon = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5M12 7.8v.2" />
  </>,
);
export const ChatIcon = make(<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z" />);
export const StarIcon = make(
  <path d="m12 3.8 2.5 5.2 5.6.7-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.7L12 3.8Z" />,
);
export const ChevronDownIcon = make(<path d="m6 9 6 6 6-6" />);

export function InstagramIcon({ size = 20, ...props }) {
  return (
    <svg {...base} width={size} height={size} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d="M12.04 2.5a9.43 9.43 0 0 0-8.07 14.3L2.6 21.5l4.83-1.27a9.43 9.43 0 1 0 4.61-17.73Zm0 17.2c-1.43 0-2.83-.38-4.05-1.1l-.29-.17-2.87.75.77-2.8-.19-.29a7.8 7.8 0 1 1 6.63 3.61Zm4.28-5.84c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.91-.13.16-.27.18-.5.06a6.4 6.4 0 0 1-3.18-2.78c-.24-.41.24-.38.69-1.27.08-.16.04-.29-.02-.41-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.82 1.94c0 1.14.83 2.25.95 2.4.12.16 1.64 2.5 3.97 3.5 1.47.64 2.05.69 2.78.58.45-.07 1.38-.56 1.57-1.11.2-.55.2-1.02.14-1.11-.06-.1-.21-.16-.44-.27Z" />
    </svg>
  );
}

export function SocialIcon({ id, ...props }) {
  if (id === 'instagram') return <InstagramIcon {...props} />;
  if (id === 'whatsapp') return <WhatsAppIcon {...props} />;
  return <ChatIcon {...props} />;
}
