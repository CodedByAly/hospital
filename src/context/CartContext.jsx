import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { itemsById, SAUCE_PRICE } from '../data/menu';
import restaurant from '../config/restaurant';
import { readJSON, writeJSON } from '../lib/storage';

const STORAGE_KEY = 'qambri.cart.v1';
const MAX_QTY = 50;

const CartContext = createContext(null);

const sorted = (list = []) => [...list].sort();

/**
 * A cart line holds choices only — prices are always recomputed from the
 * menu data, so an old cart in storage can never show stale prices.
 */
function normalizeLine(line) {
  const item = itemsById[line.itemId];
  if (!item) return null;
  const removable = new Set((item.ingredients || []).filter((i) => i.removable).map((i) => i.en));
  return {
    itemId: line.itemId,
    qty: Math.min(MAX_QTY, Math.max(1, Math.round(line.qty) || 1)),
    removed: sorted(line.removed).filter((r) => removable.has(r)),
    extras: sorted(line.extras).filter((id) => itemsById[id]?.category === 'sauces'),
    sauces: sorted(line.sauces).filter((id) => itemsById[id]?.category === 'sauces').slice(0, item.includedSauces || 0),
    note: String(line.note || '').trim().slice(0, 200),
  };
}

export const lineKey = (l) =>
  [l.itemId, l.removed.join('+'), l.extras.join('+'), l.sauces.join('+'), l.note].join('|');

export function unitPrice(line) {
  const item = itemsById[line.itemId];
  return item ? item.price + line.extras.length * SAUCE_PRICE : 0;
}

function withKeys(lines) {
  // Merge lines that ended up identical (e.g. after an edit).
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
      return withKeys(lines.map((l) => (l.key === action.key ? { ...action.line } : l)));
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

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      dispatch({ type: 'set', lines: readJSON(STORAGE_KEY, []) });
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
    const subtotal = lines.reduce((sum, l) => sum + unitPrice(l) * l.qty, 0);
    return { lines, count, subtotal, add, replace, setQty, remove, clear, maxQty: MAX_QTY };
  }, [lines, add, replace, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

/** Delivery fee for an order type; null means "to be confirmed". */
export function deliveryFeeFor(type) {
  if (type !== 'delivery') return 0;
  return restaurant.ordering.deliveryFee;
}
