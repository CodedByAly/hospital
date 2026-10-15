import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { itemsById } from '../data/menu';
import { lineSignature, sanitizeLines, unitPrice } from '../lib/cart';
import { readJSON, writeJSON } from '../lib/storage';

const STORAGE_KEY = 'lk.cart.v1';
const MAX_QTY = 50;

const CartContext = createContext(null);

const newKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function CartProvider({ children }) {
  const [lines, setLines] = useState(() => sanitizeLines(readJSON(STORAGE_KEY, [])));
  const [isOpen, setIsOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => writeJSON(STORAGE_KEY, lines), [lines]);

  // Keep carts in sync across tabs.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setLines(sanitizeLines(readJSON(STORAGE_KEY, [])));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((itemId, selection, qty = 1) => {
    setLines((current) => {
      const signature = lineSignature(itemId, selection);
      const existing = current.find((line) => lineSignature(line.itemId, line.selection) === signature);
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line,
        );
      }
      return [...current, { key: newKey(), itemId, selection, qty: Math.min(MAX_QTY, qty) }];
    });
    setBump((n) => n + 1);
  }, []);

  const replace = useCallback((key, selection, qty) => {
    setLines((current) => {
      const target = current.find((line) => line.key === key);
      if (!target) return current;
      const signature = lineSignature(target.itemId, selection);
      // If the edit makes this line identical to another one, merge them.
      const twin = current.find(
        (line) => line.key !== key && lineSignature(line.itemId, line.selection) === signature,
      );
      if (twin) {
        return current
          .filter((line) => line.key !== key)
          .map((line) => (line === twin ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line));
      }
      return current.map((line) => (line.key === key ? { ...line, selection, qty } : line));
    });
  }, []);

  const setQty = useCallback((key, qty) => {
    setLines((current) =>
      qty < 1
        ? current.filter((line) => line.key !== key)
        : current.map((line) => (line.key === key ? { ...line, qty: Math.min(MAX_QTY, qty) } : line)),
    );
  }, []);

  const remove = useCallback((key) => setLines((current) => current.filter((line) => line.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines.map((line) => {
        const item = itemsById[line.itemId];
        const unit = unitPrice(item, line.selection);
        return { ...line, item, unit, total: Math.round(unit * line.qty * 100) / 100 };
      }),
    [lines],
  );

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines]);
  const subtotal = useMemo(
    () => Math.round(detailed.reduce((sum, line) => sum + line.total, 0) * 100) / 100,
    [detailed],
  );

  const value = useMemo(
    () => ({
      lines: detailed,
      count,
      subtotal,
      bump,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      replace,
      setQty,
      remove,
      clear,
    }),
    [detailed, count, subtotal, bump, isOpen, add, replace, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
