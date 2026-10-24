import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { lineKey, resolveLine } from '../lib/cartLine';
import { cents } from '../lib/format';
import { readJSON, writeJSON } from '../lib/storage';

const CART_KEY = 'cb.cart';
const MAX_QTY = 50;

const CartContext = createContext(null);

function reducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l));
      }
      return [...lines, { ...action.line, key }];
    }
    case 'replace': {
      // Editing a line: swap it in place, merging if the new config matches another line.
      const key = lineKey(action.line);
      const without = lines.filter((l) => l.key !== action.key);
      const match = without.find((l) => l.key === key);
      if (match) {
        return without.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l));
      }
      const index = lines.findIndex((l) => l.key === action.key);
      const next = [...without];
      next.splice(index === -1 ? next.length : index, 0, { ...action.line, key });
      return next;
    }
    case 'setQty':
      if (action.qty <= 0) return lines.filter((l) => l.key !== action.key);
      return lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l));
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    case 'load':
      return action.lines;
    default:
      return lines;
  }
}

function loadCart() {
  const stored = readJSON(CART_KEY, []);
  return Array.isArray(stored) ? stored.filter((l) => l && l.itemId && l.qty > 0) : [];
}

export function CartProvider({ children }) {
  const [rawLines, dispatch] = useReducer(reducer, undefined, loadCart);
  const [isOpen, setOpen] = useState(false);
  // { itemId, editKey? } while the item sheet is open
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => writeJSON(CART_KEY, rawLines), [rawLines]);

  // Keep tabs in sync when the cart changes in another window.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CART_KEY) dispatch({ type: 'load', lines: loadCart() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const lines = useMemo(() => rawLines.map(resolveLine).filter(Boolean), [rawLines]);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = cents(lines.reduce((sum, l) => sum + l.total, 0));

  const openItem = useCallback((itemId, editKey = null) => setActiveItem({ itemId, editKey }), []);
  const closeItem = useCallback(() => setActiveItem(null), []);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotal,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add: (line) => dispatch({ type: 'add', line }),
      replace: (key, line) => dispatch({ type: 'replace', key, line }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
      activeItem,
      openItem,
      closeItem,
    }),
    [lines, count, subtotal, isOpen, activeItem, openItem, closeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
