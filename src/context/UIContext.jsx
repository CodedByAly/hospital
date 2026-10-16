import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [itemId, setItemId] = useState(null);
  const searchInput = useRef(null);

  const focusSearch = useCallback(() => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => searchInput.current?.focus({ preventScroll: true }), 450);
  }, []);

  const value = useMemo(
    () => ({
      itemId,
      openItem: (id) => setItemId(id),
      closeItem: () => setItemId(null),
      searchInput,
      focusSearch,
    }),
    [itemId, focusSearch]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
