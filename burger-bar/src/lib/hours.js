import { schedule, site } from '../config/site.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function formatClock(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

// Current weekday and minutes since midnight in the restaurant's time zone.
function nowInRestaurant(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: site.timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/*
 * Open/closed status, handling hours that run past midnight
 * (e.g. 1:00 PM – 12:30 AM belongs to the day it opened).
 */
export function getOpenStatus(date = new Date()) {
  const { day, minutes } = nowInRestaurant(date);

  const yesterday = schedule[(day + 6) % 7];
  if (yesterday && toMinutes(yesterday.close) < toMinutes(yesterday.open) && minutes < toMinutes(yesterday.close)) {
    return { open: true, closesAt: yesterday.close, label: `Open until ${formatClock(yesterday.close)}` };
  }

  const today = schedule[day];
  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    const overnight = close < open;
    if (minutes >= open && (overnight || minutes < close)) {
      return { open: true, closesAt: today.close, label: `Open until ${formatClock(today.close)}` };
    }
    if (minutes < open) {
      return { open: false, label: `Opens today at ${formatClock(today.open)}` };
    }
  }

  for (let i = 1; i <= 7; i += 1) {
    const next = schedule[(day + i) % 7];
    if (next) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[(day + i) % 7];
      return { open: false, label: `Opens ${when} at ${formatClock(next.open)}` };
    }
  }
  return { open: false, label: 'Closed' };
}

// Rows for display, Monday first, with consecutive identical days merged.
export function hoursRows() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const rows = [];
  for (const d of order) {
    const s = schedule[d];
    const text = s ? `${formatClock(s.open)} – ${formatClock(s.close)}` : 'Closed';
    const last = rows.at(-1);
    if (last && last.text === text) {
      last.to = d;
      last.days.push(d);
    } else rows.push({ from: d, to: d, text, days: [d] });
  }
  return rows.map((r) => ({ ...r, label: r.from === r.to ? short[r.from] : `${short[r.from]} – ${short[r.to]}` }));
}

export const todayIndex = () => nowInRestaurant().day;
