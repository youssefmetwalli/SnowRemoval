import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "snowremoval.installPromptDismissedAt";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 日

const isIosSafari = () => {
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isStandalone = (window.navigator as any).standalone === true;
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  return isIos && isSafari && !isStandalone;
};

const wasDismissedRecently = () => {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  return Number.isFinite(ts) && Date.now() - ts < DISMISS_TTL_MS;
};

export const InstallPrompt = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [hidden, setHidden] = useState(wasDismissedRecently());

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (isIosSafari() && !wasDismissedRecently()) {
      setShowIosGuide(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      setDeferred(null);
    }
  };

  const onDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setHidden(true);
  };

  if (hidden) return null;
  if (!deferred && !showIosGuide) return null;

  return (
    <div
      role="dialog"
      aria-label="ホーム画面に追加"
      className="fixed bottom-4 left-4 right-4 z-50 rounded-lg border border-slate-300 bg-white p-4 shadow-lg sm:left-auto sm:right-4 sm:w-96"
    >
      {deferred ? (
        <>
          <p className="mb-3 text-sm font-medium text-slate-900">
            ホーム画面に追加すると、アプリのように起動できます。
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="px-3 py-1.5 text-sm text-slate-600"
            >
              あとで
            </button>
            <button
              type="button"
              onClick={onInstall}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white"
            >
              追加する
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2 text-sm font-medium text-slate-900">
            ホーム画面に追加
          </p>
          <p className="mb-3 text-xs text-slate-600 leading-relaxed">
            Safari 下部の共有ボタン → 「ホーム画面に追加」でアプリのように起動できます。
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white"
            >
              閉じる
            </button>
          </div>
        </>
      )}
    </div>
  );
};
