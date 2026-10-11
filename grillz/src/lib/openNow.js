import restaurant from '../config/restaurant';

/** "Open now · until 1 AM" / "Closed · opens 12 PM", from the configured schedule. */
export function openStatus(date = new Date()) {
  const s = restaurant.schedule;
  if (!s) return null;
  let m = date.getHours() * 60 + date.getMinutes();
  if (m < s.open && s.close > 1440) m += 1440; // after midnight counts as the previous day
  const fmt = (mins) => {
    const h = Math.floor((mins % 1440) / 60);
    return `${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}`;
  };
  return m >= s.open && m < s.close
    ? { open: true, text: `Open now · until ${fmt(s.close)}` }
    : { open: false, text: `Closed · opens ${fmt(s.open)}` };
}
