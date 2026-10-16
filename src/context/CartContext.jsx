import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { getItem } from '../data/menu';
import { unitPrice } from '../lib/pricing';
import { load, save } from '../lib/storage';

const STORAGE_KEY = 'talia.cart.v1';
const CartContext = createContext(null);

// Same item + same choices + same note = same line, so quantities merge.
const lineKey = (itemId, selection, note) =>
  [itemId, JSON.stringify(selection?.options ?? {}), (selection?.addons ?? []).slice().sort().join(','), note?.trim() ?? ''].join('|');

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const { itemId, qty, selection, note } = action;
      const key = lineKey(itemId, selection, note);
      const existing = lines.find((l) => l.key === key);
      if (existing) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...lines, { key, itemId, qty, selection, note: note?.trim() ?? '' }];
    }
    case 'replace': {
      // Editing a line: swap it in place, merging if the new config matches another line.
      const { oldKey, itemId, qty, selection, note } = action;
      const key = lineKey(itemId, selection, note);
      const without = lines.filter((l) => l.key !== oldKey);
      const twin = without.find((l) => l.key === key);
      if (twin) return without.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      const index = lines.findIndex((l) => l.key === oldKey);
      const next = [...without];
      next.splice(index < 0 ? next.length : index, 0, { key, itemId, qty, selection, note: note?.trim() ?? '' });
      return next;
    }
    case 'setQty':
      return action.qty <= 0
        ? lines.filter((l) => l.key !== action.key)
        : lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l));
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

function hydrate() {
  const stored = load(STORAGE_KEY, []);
  // Drop lines whose item no longer exists or has no price (menu was edited).
  return Array.isArray(stored) ? stored.filter((l) => getItem(l.itemId)?.price != null && l.qty > 0) : [];
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, hydrate);

  useEffect(() => save(STORAGE_KEY, lines), [lines]);

  const value = useMemo(() => {
    const detailed = lines.map((line) => {
      const item = getItem(line.itemId);
      const unit = unitPrice(item, line.selection);
      return { ...line, item, unit, total: Math.round(unit * line.qty * 100) / 100 };
    });
    const count = detailed.reduce((n, l) => n + l.qty, 0);
    const subtotal = Math.round(detailed.reduce((s, l) => s + l.total, 0) * 100) / 100;
    return {
      lines: detailed,
      count,
      subtotal,
      total: subtotal, // dine-in: no delivery or service fees
      add: (itemId, qty = 1, selection = {}, note = '') => dispatch({ type: 'add', itemId, qty, selection, note }),
      replace: (oldKey, itemId, qty, selection, note) => dispatch({ type: 'replace', oldKey, itemId, qty, selection, note }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
