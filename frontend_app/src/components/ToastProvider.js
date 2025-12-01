import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useToast
 * A hook to trigger toast notifications across the app.
 */
const ToastContext = createContext({ notify: (_msg, _type, _opts) => {} });

// PUBLIC_INTERFACE
export function useToast() {
  return useContext(ToastContext);
}

/**
 * PUBLIC_INTERFACE
 * ToastProvider
 * Wraps children and provides a notify(message, type, options) function.
 * Options: { duration?: number }
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = "info", options = {}) => {
    const id = Date.now() + Math.random();
    const duration = typeof options.duration === "number" ? options.duration : 3500;
    setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
    // auto remove
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => remove(id), 220);
    }, duration);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  const typeConfig = {
    success: { bg: "rgba(16,185,129,0.1)", title: "Success", icon: "✓", grad: "linear-gradient(45deg, #10B98155, #34D39955)" },
    error: { bg: "rgba(239,68,68,0.1)", title: "Error", icon: "⚠", grad: "linear-gradient(45deg, #EF444455, #F8717155)" },
    info: { bg: "rgba(59,130,246,0.1)", title: "Info", icon: "ℹ", grad: "linear-gradient(45deg, #3B82F655, #60A5FA55)" },
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] space-y-2 w-[min(92vw,360px)]">
        {toasts.map((t) => {
          const cfg = typeConfig[t.type] || typeConfig.info;
          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className="rounded-xl shadow-lg border overflow-hidden"
              style={{
                background: "#fff",
                borderColor: "rgba(0,0,0,0.06)",
                transform: `translateY(${t.leaving ? "-4px" : "0"})`,
                opacity: t.leaving ? 0 : 1,
                transition: "transform 200ms ease, opacity 200ms ease",
              }}
            >
              <div
                className="px-4 py-3 flex items-start gap-3"
                style={{
                  backgroundImage: cfg.grad,
                }}
              >
                <div
                  aria-hidden="true"
                  className="h-8 w-8 rounded-lg grid place-items-center text-white"
                  style={{
                    background: "var(--header-gradient)",
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
                    fontWeight: 700,
                  }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-900" style={{ textTransform: "uppercase" }}>
                    {cfg.title}
                  </p>
                  <p className="text-sm text-slate-800">{t.message}</p>
                </div>
                <button
                  className="ml-2 text-slate-500 hover:text-slate-700 focus-ring rounded"
                  aria-label="Close notification"
                  onClick={() => remove(t.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
