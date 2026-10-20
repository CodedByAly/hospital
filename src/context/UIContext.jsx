import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

// Shared UI state: the item sheet, the cart drawer and the small
// "added to order" notice.
const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [sheet, setSheet] = useState(null) // { itemId, editKey? }
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const noticeTimer = useRef()

  const openItem = useCallback((itemId, editKey = null) => setSheet({ itemId, editKey }), [])
  const closeItem = useCallback(() => setSheet(null), [])

  const notify = useCallback((text) => {
    clearTimeout(noticeTimer.current)
    setNotice({ text, id: Date.now() })
    noticeTimer.current = setTimeout(() => setNotice(null), 2600)
  }, [])

  const value = useMemo(
    () => ({ sheet, openItem, closeItem, cartOpen, setCartOpen, notice, notify }),
    [sheet, openItem, closeItem, cartOpen, notice, notify],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>')
  return ctx
}
