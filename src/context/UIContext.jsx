import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

/** Global overlays: the cart drawer and the item detail sheet. */
export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [itemSheet, setItemSheet] = useState(null); // { itemId, editKey? }

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openItem = useCallback((itemId, editKey = null) => setItemSheet({ itemId, editKey }), []);
  const closeItem = useCallback(() => setItemSheet(null), []);

  const value = useMemo(
    () => ({ cartOpen, openCart, closeCart, itemSheet, openItem, closeItem }),
    [cartOpen, openCart, closeCart, itemSheet, openItem, closeItem],
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
