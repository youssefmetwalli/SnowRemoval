import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type ToastVariant = "default" | "destructive";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastItem extends ToastOptions {
  id: number;
  visible: boolean; // ✅ for fade animation
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...options, id, visible: false }]);
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
        );
      }, 10);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              transition: "opacity 300ms ease, transform 300ms ease",
              opacity: t.visible ? 1 : 0,
              transform: t.visible ? "translateY(0)" : "translateY(8px)",
            }}
            className={`rounded-lg px-4 py-3 shadow-md text-sm max-w-xs ${
              t.variant === "destructive"
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 opacity-80">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className={`mt-0.5 text-lg leading-none shrink-0 opacity-60 hover:opacity-100 transition-opacity ${
                  t.variant === "destructive" ? "text-white" : "text-gray-900"
                }`}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}