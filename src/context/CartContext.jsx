import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { readJSON, writeJSON } from '../lib/storage';
import { hydrateLine, lineKey } from '../lib/cart';

const STORAGE_KEY = 'osnack.cart.v1';
const CartContext = createContext(null);

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.itemId, action.config);
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + action.qty) } : l));
      }
      return [...lines, { key, itemId: action.itemId, config: action.config, qty: action.qty }];
    }
    case 'replace': {
      // Editing a line: swap it in place, merging with an identical line if one exists.
      const key = lineKey(action.itemId, action.config);
      const others = lines.filter((l) => l.key !== action.key);
      const twin = others.find((l) => l.key === key);
      if (twin) {
        return others.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + action.qty) } : l));
      }
      return lines.map((l) =>
        l.key === action.key ? { key, itemId: action.itemId, config: action.config, qty: action.qty } : l,
      );
    }
    case 'qty':
      return lines
        .map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l))
        .filter((l) => l.qty > 0);
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

function init() {
  const stored = readJSON(STORAGE_KEY, []);
  return Array.isArray(stored)
    ? stored
        .map(hydrateLine)
        .filter(Boolean)
        .map(({ key, itemId, config, qty }) => ({ key, itemId, config, qty }))
    : [];
}

export function CartProvider({ children }) {
  const [rawLines, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => writeJSON(STORAGE_KEY, rawLines), [rawLines]);

  const lines = useMemo(() => rawLines.map(hydrateLine).filter(Boolean), [rawLines]);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.unit * l.qty, 0);

  const add = useCallback((itemId, config, qty = 1) => dispatch({ type: 'add', itemId, config, qty }), []);
  const replace = useCallback(
    (key, itemId, config, qty) => dispatch({ type: 'replace', key, itemId, config, qty }),
    [],
  );
  const setQty = useCallback((key, qty) => dispatch({ type: 'qty', key, qty }), []);
  const remove = useCallback((key) => dispatch({ type: 'remove', key }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(
    () => ({ lines, count, subtotal, add, replace, setQty, remove, clear }),
    [lines, count, subtotal, add, replace, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
