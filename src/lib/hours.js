import { restaurant } from '../config/restaurant';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

/** Current day (0-6) and minutes since midnight in the restaurant's time zone. */
export function restaurantNow(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: restaurant.timeZone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value;
    return {
      day: WEEKDAYS.indexOf(get('weekday')),
      minutes: Number(get('hour')) * 60 + Number(get('minute')),
    };
  } catch {
    return { day: date.getDay(), minutes: date.getHours() * 60 + date.getMinutes() };
  }
}

export function hoursForDay(day) {
  return restaurant.hours.find((entry) => entry.days.includes(day)) || null;
}

/**
 * { open: true, closes: '22:00' }
 * { open: false, next: { inDays: 0|1|n, day, time } }
 */
export function openStatus(date = new Date()) {
  const now = restaurantNow(date);
  const today = hoursForDay(now.day);

  if (today && now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)) {
    return { open: true, closes: today.close };
  }

  for (let inDays = 0; inDays < 7; inDays += 1) {
    const day = (now.day + inDays) % 7;
    const hours = hoursForDay(day);
    if (!hours) continue;
    if (inDays === 0 && now.minutes >= toMinutes(hours.open)) continue;
    return { open: false, next: { inDays, day, time: hours.open } };
  }
  return { open: false, next: null };
}

/**
 * Pickup slots for today and tomorrow, within opening hours.
 * Each slot: { id: '0|13:30', inDays: 0, time: '13:30' }
 */
export function pickupSlots(date = new Date()) {
  const { pickupLeadMinutes: lead, pickupSlotMinutes: step } = restaurant.ordering;
  const now = restaurantNow(date);
  const slots = [];

  for (let inDays = 0; inDays < 2; inDays += 1) {
    const hours = hoursForDay((now.day + inDays) % 7);
    if (!hours) continue;
    const open = toMinutes(hours.open);
    const close = toMinutes(hours.close);
    let start = open + lead;
    if (inDays === 0) start = Math.max(start, now.minutes + lead);
    start = Math.ceil(start / step) * step;
    for (let m = start; m <= close - step; m += step) {
      slots.push({ id: `${inDays}|${toHHMM(m)}`, inDays, time: toHHMM(m) });
    }
  }
  return slots;
}

/** Group consecutive days with identical hours, for display: [{ days: [1..6], open, close }] */
export function groupedHours() {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups = [];
  order.forEach((day) => {
    const hours = hoursForDay(day);
    const last = groups[groups.length - 1];
    if (last && hours && last.open === hours.open && last.close === hours.close) {
      last.days.push(day);
    } else if (hours) {
      groups.push({ days: [day], open: hours.open, close: hours.close });
    }
  });
  return groups;
}
