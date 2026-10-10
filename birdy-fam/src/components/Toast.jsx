import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef()
  const show = useCallback((message) => {
    clearTimeout(timer.current)
    setToast({ message, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])
  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <Icon name="check" size={16} strokeWidth={2.4} />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
