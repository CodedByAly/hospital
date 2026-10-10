import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ItemApi = { itemId: string | null; open: (id: string) => void; close: () => void }
const ItemContext = createContext<ItemApi | null>(null)

/** Which dish is open in the detail sheet. One sheet for the whole site. */
export function ItemProvider({ children }: { children: ReactNode }) {
  const [itemId, setItemId] = useState<string | null>(null)
  const open = useCallback((id: string) => setItemId(id), [])
  const close = useCallback(() => setItemId(null), [])
  const value = useMemo(() => ({ itemId, open, close }), [itemId, open, close])
  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>
}

export function useItemSheet() {
  const ctx = useContext(ItemContext)
  if (!ctx) throw new Error('useItemSheet must be used inside ItemProvider')
  return ctx
}
