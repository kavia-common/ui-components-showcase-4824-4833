import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useToast
 * A hook to trigger toast notifications across the app.
 */
const ToastContext = createContext({ notify: (_msg, _type) => {} });

// PUBLIC_INTERFACE
export function useToast() {
  return useContext(ToastContext);
}

/**
 * PUBLIC_INTERFACE
 * ToastProvider
 * Wraps children and provides a notify(message, type) function.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`surface px-4 py-3 border-l-4 transition-all ${
              t.type === "success" ? "border-green-500" :
              t.type === "error" ? "border-red-500" :
              "border-blue-500"
            } shadow-soft`}
          >
            <p className="text-sm">
              {t.message}
            </p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
