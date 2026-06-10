import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext()
let uid = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++uid
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800)
  }, [])

  return (
    <Ctx.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-toast-in pointer-events-auto
              ${toast.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-white border border-slate-200 text-slate-700 shadow-slate-200/60'
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
