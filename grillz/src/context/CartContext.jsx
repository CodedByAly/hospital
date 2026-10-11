import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { itemsById, addonsById, currencyOf } from '../data/menu';
import restaurant from '../config/restaurant';
import { readJSON, writeJSON } from '../lib/storage';

const STORAGE_KEY = 'grillz.cart.v1';
const MAX_QTY = 50;
const CartContext = createContext(null);

/** Lines store choices only; prices always come from the menu data. */
function normalizeLine(line) {
  const item = itemsById[line.itemId];
  if (!item) return null;
  const removable = new Set(item.remove || []);
  return {
    itemId: item.id,
    qty: Math.min(MAX_QTY, Math.max(1, Math.round(line.qty) || 1)),
    removed: [...new Set(line.removed || [])].filter((r) => removable.has(r)).sort(),
    addons: item.addons ? [...new Set(line.addons || [])].filter((a) => addonsById[a]).sort() : [],
    note: String(line.note || '').trim().slice(0, 200),
  };
}

export const lineKey = (l) => [l.itemId, l.removed.join('+'), l.addons.join('+'), l.note].join('|');
export const lineCurrency = (l) => currencyOf(itemsById[l.itemId]);
export function unitPrice(l) {
  const item = itemsById[l.itemId];
  if (!item) return 0;
  return item.price + l.addons.reduce((s, a) => s + addonsById[a].price, 0);
}
export const lineDetails = (l) => [
  ...l.removed.map((r) => `No ${r}`),
  ...l.addons.map((a) => `+ ${addonsById[a].name}`),
];

function withKeys(lines) {
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

/** { LBP, USD } totals for a list of lines. */
export function totalsOf(lines) {
  const t = { LBP: 0, USD: 0 };
  for (const l of lines) t[lineCurrency(l)] += unitPrice(l) * l.qty;
  return t;
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, null, () => withKeys(readJSON(STORAGE_KEY, [])));

  useEffect(() => {
    writeJSON(STORAGE_KEY, lines.map(({ key, ...rest }) => rest));
  }, [lines]);

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
    return { lines, count, totals: totalsOf(lines), add, replace, setQty, remove, clear, maxQty: MAX_QTY };
  }, [lines, add, replace, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

/** Delivery fee (L.L) for an order type; null = confirmed on WhatsApp. */
export const deliveryFeeFor = (type) => (type === 'delivery' ? restaurant.ordering.deliveryFee : 0);
