import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-surface border border-divider shadow-premium rounded-xl min-w-[300px] max-w-[400px]"
            >
              <div className="shrink-0">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="text-emerald-500" size={18} />
                ) : toast.type === 'error' ? (
                  <AlertCircle className="text-red-500" size={18} />
                ) : (
                  <Info className="text-indigo-500" size={18} />
                )}
              </div>
              <p className="text-xs font-semibold text-text-main flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-main p-0.5 hover:bg-gray-50 rounded transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
