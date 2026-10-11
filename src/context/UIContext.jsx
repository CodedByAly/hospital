import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

/**
 * Global overlays: the item sheet (open for adding or editing a cart line),
 * the cart drawer, and a short-lived status toast.
 */
export function UIProvider({ children }) {
  const [itemSheet, setItemSheet] = useState(null); // { itemId, line? }
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const openItem = useCallback((itemId, line = null) => setItemSheet({ itemId, line }), []);
  const closeItem = useCallback(() => setItemSheet(null), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);
  const clearToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({ itemSheet, openItem, closeItem, cartOpen, openCart, closeCart, toast, notify, clearToast }),
    [itemSheet, openItem, closeItem, cartOpen, openCart, closeCart, toast, notify, clearToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
