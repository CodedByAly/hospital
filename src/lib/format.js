export function formatPrice(value) {
  const rounded = Math.round(value * 100) / 100;
  return `$${rounded.toFixed(2)}`;
}

/** "12:00" -> "12 pm" / "12 م", "22:00" -> "10 pm" */
export function formatTime(hhmm, lang) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = lang === 'ar' ? (h < 12 ? 'ص' : 'م') : h < 12 ? 'am' : 'pm';
  const hour = h % 12 === 0 ? 12 : h % 12;
  const minutes = m ? `:${String(m).padStart(2, '0')}` : '';
  return `${hour}${minutes} ${suffix}`;
}

export function interpolate(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : `{${key}}`));
}
