import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import ItemDialog from '../components/ItemDialog'

/** Opens the item-detail dialog from anywhere (menu cards, homepage, cart "edit"). */
const ItemContext = createContext(null)

export function ItemProvider({ children }) {
  const [state, setState] = useState({ open: false, itemId: null, lineKey: null, preset: null, nonce: 0 })

  /** preset: optional partial config, e.g. { options: { type: 'royal-white' } } */
  const openItem = useCallback(
    (itemId, lineKey = null, preset = null) => setState((s) => ({ open: true, itemId, lineKey, preset, nonce: s.nonce + 1 })),
    [],
  )
  const closeItem = useCallback(() => setState((s) => ({ ...s, open: false })), [])

  const value = useMemo(() => ({ openItem, closeItem }), [openItem, closeItem])
  return (
    <ItemContext.Provider value={value}>
      {children}
      <ItemDialog {...state} onClose={closeItem} />
    </ItemContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useItemDialog = () => useContext(ItemContext)
