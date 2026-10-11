import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { itemsById, priceOf, variantOf } from '../data/menu';
import restaurant from '../config/restaurant';
import { readJSON, writeJSON } from '../lib/storage';

const STORAGE_KEY = 'khalifa.cart.v1';
const MAX_QTY = 50;

const CartContext = createContext(null);

/**
 * A cart line stores choices only. Prices are always looked up from the menu
 * data, so a cart saved in the browser never shows stale prices.
 */
function normalizeLine(line) {
  const item = itemsById[line.itemId];
  if (!item) return null;
  const variant = item.variants ? (variantOf(item, line.variant) || item.variants[0]).id : null;
  const choice = item.choice ? (item.choice.options.includes(line.choice) ? line.choice : item.choice.options[0]) : null;
  const removable = new Set(item.remove || []);
  return {
    itemId: item.id,
    variant,
    choice,
    qty: Math.min(MAX_QTY, Math.max(1, Math.round(line.qty) || 1)),
    removed: [...new Set(line.removed || [])].filter((r) => removable.has(r)).sort(),
    note: String(line.note || '').trim().slice(0, 200),
  };
}

export const lineKey = (l) => [l.itemId, l.variant, l.choice, l.removed.join('+'), l.note].join('|');
export const unitPrice = (line) => {
  const item = itemsById[line.itemId];
  return item ? priceOf(item, line.variant) : 0;
};

function withKeys(lines) {
  // Identical lines (same item and choices) merge into one.
  const map = new Map();
  for (const raw of lines) {
    const line = normalizeLine(raw);
    if (!line) continue;
    const key = lineKey(line);
    const existing = map.get(key);
    if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + line.qty);
    else map.set(key, { ...line, key });
  }
  return [...map.values()];
}

function reducer(lines, action) {
  switch (action.type) {
    case 'add':
      return withKeys([...lines, action.line]);
    case 'replace':
      return withKeys(lines.map((l) => (l.key === action.key ? action.line : l)));
    case 'qty':
      return lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(MAX_QTY, Math.max(1, action.qty)) } : l));
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    case 'set':
      return withKeys(Array.isArray(action.lines) ? action.lines : []);
    default:
      return lines;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, null, () => withKeys(readJSON(STORAGE_KEY, [])));

  useEffect(() => {
    writeJSON(STORAGE_KEY, lines.map(({ key, ...rest }) => rest));
  }, [lines]);

  // Keep open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'set', lines: readJSON(STORAGE_KEY, []) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((line) => dispatch({ type: 'add', line }), []);
  const replace = useCallback((key, line) => dispatch({ type: 'replace', key, line }), []);
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = Math.round(lines.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0) * 100) / 100;
    return { lines, count, subtotal, add, replace, setQty, remove, clear, maxQty: MAX_QTY };
  }, [lines, add, replace, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

/** Delivery fee for an order type; null means "confirmed on WhatsApp". */
export function deliveryFeeFor(type) {
  return type === 'delivery' ? restaurant.ordering.deliveryFee : 0;
}

/** Display name of a line, e.g. "Chicken Shawarma — Large Shawarma". */
export function lineName(line) {
  const item = itemsById[line.itemId];
  const v = variantOf(item, line.variant);
  if (!v) return item.name;
  // "Chicken Shawarma · Markook" rather than repeating "Shawarma".
  const label = item.name.includes('Shawarma') ? v.label.replace(/\s*Shawarma$/, '') : v.label;
  return `${item.name} · ${label}`;
}

/** Image for a line (variant photo when there is one). */
export function lineImage(line) {
  const item = itemsById[line.itemId];
  return variantOf(item, line.variant)?.image ?? item.image ?? null;
}

/** "Honey BBQ sauce · No lettuce · Note: …" parts. */
export function lineDetails(line) {
  const parts = [];
  if (line.choice) parts.push(line.choice);
  for (const r of line.removed) parts.push(`No ${r}`);
  return parts;
}
