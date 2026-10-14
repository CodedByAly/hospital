import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from './cart'

interface ItemDialogState {
  itemId: string
  /** When editing an existing cart line. */
  line?: CartLine
}

interface UIContextValue {
  dialog: ItemDialogState | null
  openItem: (itemId: string, line?: CartLine) => void
  closeItem: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ItemDialogState | null>(null)
  const value = useMemo<UIContextValue>(
    () => ({
      dialog,
      openItem: (itemId, line) => setDialog({ itemId, line }),
      closeItem: () => setDialog(null),
    }),
    [dialog],
  )
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
