import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { load, save } from '../lib/storage'

const UIContext = createContext(null)
const MODE_KEY = 'moods:mode'

function initialMode() {
  // A table QR code can link to /menu?mode=dine-in.
  const fromUrl = new URLSearchParams(window.location.search).get('mode')
  if (fromUrl === 'dine-in' || fromUrl === 'delivery') return fromUrl
  return load(MODE_KEY, 'delivery') === 'dine-in' ? 'dine-in' : 'delivery'
}

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null) // { id, lineKey? }
  const [mode, setModeState] = useState(initialMode)

  const setMode = useCallback((next) => {
    setModeState(next)
    save(MODE_KEY, next)
  }, [])

  const value = useMemo(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      activeItem,
      openItem: (id, lineKey) => setActiveItem({ id, lineKey }),
      closeItem: () => setActiveItem(null),
      mode,
      setMode,
      canOrder: mode === 'delivery',
    }),
    [cartOpen, activeItem, mode, setMode],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUI = () => useContext(UIContext)
