/**
 * Lebanese numbers: 03 123 456, 71 123 456, 01 123 456, +961 3 123 456 ...
 * Returns digits in international form (9613123456) or null if invalid.
 */
export function normalizeLebanesePhone(input) {
  let digits = String(input).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('961')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  // Mobile (3, 70, 71, 76, 78, 79, 81...) and landlines are 7 or 8 digits after the prefix.
  if (!/^\d{7,8}$/.test(digits)) return null;
  return `961${digits}`;
}
