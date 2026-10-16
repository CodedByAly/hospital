import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [itemView, setItemView] = useState(null); // { itemId, lineKey }
  const [orderOpen, setOrderOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(0);
  const searchInput = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const focusSearch = useCallback(() => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => searchInput.current?.focus({ preventScroll: true }), 450);
  }, []);

  const value = useMemo(
    () => ({
      itemView,
      openItem: (itemId, lineKey = null) => setItemView({ itemId, lineKey }),
      closeItem: () => setItemView(null),
      orderOpen,
      openOrder: () => setOrderOpen(true),
      closeOrder: () => setOrderOpen(false),
      toast,
      showToast,
      searchInput,
      focusSearch,
    }),
    [itemView, orderOpen, toast, showToast, focusSearch]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
