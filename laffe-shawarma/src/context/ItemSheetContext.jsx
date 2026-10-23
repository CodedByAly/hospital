import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import ItemSheet from '../components/ItemSheet'

const ItemSheetContext = createContext(null)

export function ItemSheetProvider({ children }) {
  const [state, setState] = useState({ open: false, itemId: null, line: null })

  /** openItem('kebab') to order, openItem('kebab', cartLine) to edit a cart line. */
  const openItem = useCallback((itemId, line = null) => setState({ open: true, itemId, line }), [])
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const value = useMemo(() => ({ openItem }), [openItem])

  return (
    <ItemSheetContext.Provider value={value}>
      {children}
      <ItemSheet {...state} onClose={close} />
    </ItemSheetContext.Provider>
  )
}

export function useItemSheet() {
  const ctx = useContext(ItemSheetContext)
  if (!ctx) throw new Error('useItemSheet must be used inside <ItemSheetProvider>')
  return ctx
}
