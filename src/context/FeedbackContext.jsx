import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const FeedbackContext = createContext(null);

const toneMap = {
  success: {
    icon: CheckCircle2,
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-900",
    iconColor: "text-emerald-600"
  },
  error: {
    icon: AlertCircle,
    wrapper: "border-rose-200 bg-rose-50 text-rose-900",
    iconColor: "text-rose-600"
  },
  info: {
    icon: Info,
    wrapper: "border-zinc-200 bg-white text-zinc-900",
    iconColor: "text-zinc-600"
  }
};

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? 2800;

    setToasts((current) => [...current, { id, tone: "info", ...toast }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, duration);
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const tone = toneMap[toast.tone] || toneMap.info;
          const Icon = tone.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-md border px-4 py-3 shadow-soft transition duration-300 animate-[toast-in_.28s_ease] ${tone.wrapper}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconColor}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold">{toast.title}</p>
                  {toast.message && <p className="mt-1 text-sm leading-6 opacity-80">{toast.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-md p-1 text-zinc-500 transition hover:bg-white/60 hover:text-zinc-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback must be used inside FeedbackProvider");
  }

  return context;
}
