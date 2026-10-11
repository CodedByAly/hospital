import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { getItem } from '../data/menu.js';
import { toCents } from '../lib/format.js';
import { readJSON, writeJSON } from '../lib/storage.js';

const CART_KEY = 'zahers.cart.v1';

/*
 * A cart line stores the customer's choices, not prices. Prices are looked up
 * from the menu data on every render, so a price change in src/data/menu.js is
 * reflected immediately, and items removed from the menu drop out of old carts.
 */
export function lineKey({ itemId, options = {}, addons = [], removed = [], note = '' }) {
  const opts = Object.keys(options).sort().map((k) => `${k}:${options[k]}`).join(',');
  return [itemId, opts, [...addons].sort().join(','), [...removed].sort().join(','), note.trim().toLowerCase()].join('|');
}

export function unitPriceCents(item, { options = {}, addons = [] }) {
  let cents = toCents(item.price);
  for (const group of item.options) {
    const choice = group.choices.find((c) => c.id === options[group.id]);
    if (choice) cents += toCents(choice.price);
  }
  for (const addon of item.addons) {
    if (addons.includes(addon.id)) cents += toCents(addon.price);
  }
  return cents;
}

function cartReducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      const existing = lines.find((l) => l.key === key);
      if (existing) {
        return lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(l.quantity + action.line.quantity, 50) } : l));
      }
      return [...lines, { ...action.line, key }];
    }
    case 'replace': {
      // Editing a line can make it identical to another line — merge them.
      const key = lineKey(action.line);
      const without = lines.filter((l) => l.key !== action.key);
      const twin = without.find((l) => l.key === key);
      if (twin) {
        return without.map((l) => (l.key === key ? { ...l, quantity: Math.min(l.quantity + action.line.quantity, 50) } : l));
      }
      const index = lines.findIndex((l) => l.key === action.key);
      const next = [...without];
      next.splice(index === -1 ? next.length : index, 0, { ...action.line, key });
      return next;
    }
    case 'quantity':
      return lines.map((l) => (l.key === action.key ? { ...l, quantity: Math.max(1, Math.min(action.quantity, 50)) } : l));
    case 'remove':
      return lines.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
    case 'set':
      return action.lines;
    default:
      return lines;
  }
}

function loadCart() {
  const saved = readJSON(CART_KEY, []);
  return Array.isArray(saved) ? saved.filter((l) => l && getItem(l.itemId) && l.quantity > 0) : [];
}

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [itemDialog, setItemDialog] = useState(null); // { itemId, editKey? }
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => writeJSON(CART_KEY, lines), [lines]);

  // Keep carts in sync across tabs.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === CART_KEY) dispatch({ type: 'set', lines: loadCart() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const detailed = useMemo(
    () =>
      lines
        .map((line) => {
          const item = getItem(line.itemId);
          if (!item) return null;
          const unit = unitPriceCents(item, line);
          return { ...line, item, unitCents: unit, totalCents: unit * line.quantity };
        })
        .filter(Boolean),
    [lines],
  );

  const count = detailed.reduce((sum, l) => sum + l.quantity, 0);
  const subtotalCents = detailed.reduce((sum, l) => sum + l.totalCents, 0);

  const announce = useCallback((message) => {
    setAnnouncement('');
    requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  const value = useMemo(
    () => ({
      lines: detailed,
      count,
      subtotalCents,
      addLine: (line) => {
        dispatch({ type: 'add', line });
        announce(`${line.quantity} × ${getItem(line.itemId)?.name} added to your order`);
      },
      replaceLine: (key, line) => {
        dispatch({ type: 'replace', key, line });
        announce('Item updated');
      },
      setQuantity: (key, quantity) => dispatch({ type: 'quantity', key, quantity }),
      removeLine: (key) => {
        dispatch({ type: 'remove', key });
        announce('Item removed from your order');
      },
      clearCart: () => dispatch({ type: 'clear' }),
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      itemDialog,
      openItem: (itemId, editKey = null) => setItemDialog({ itemId, editKey }),
      closeItem: () => setItemDialog(null),
    }),
    [detailed, count, subtotalCents, cartOpen, itemDialog, announce],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </div>
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}
