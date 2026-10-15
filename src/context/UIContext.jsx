import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/** Item sheet state + a polite screen-reader announcer. */
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [itemSheet, setItemSheet] = useState(null); // { itemId, lineKey? }
  const [announcement, setAnnouncement] = useState('');

  const openItem = useCallback((itemId, options = {}) => setItemSheet({ itemId, ...options, openedAt: Date.now() }), []);
  const closeItem = useCallback(() => setItemSheet(null), []);

  const announce = useCallback((message) => {
    // Clearing first makes repeated identical messages get read again.
    setAnnouncement('');
    window.setTimeout(() => setAnnouncement(message), 60);
  }, []);

  const value = useMemo(
    () => ({ itemSheet, openItem, closeItem, announce }),
    [itemSheet, openItem, closeItem, announce],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used inside UIProvider');
  return context;
}
