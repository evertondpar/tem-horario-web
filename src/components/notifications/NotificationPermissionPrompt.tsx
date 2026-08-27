import { Bell, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { firebaseMessagingConfigured } from "../../lib/firebase";
import { syncNotificationDevice } from "../../lib/notification-device";
import { storage } from "../../utils/storage";

const DISMISSED_KEY = "tem-horario-notification-prompt-dismissed";

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(
    () =>
      Boolean(storage.getToken() && storage.getSession()) &&
      firebaseMessagingConfigured &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      Notification.permission === "default" &&
      localStorage.getItem(DISMISSED_KEY) !== "true",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !storage.getToken() ||
      !storage.getSession() ||
      !firebaseMessagingConfigured ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    )
      return;

    if (Notification.permission === "granted") {
      void syncNotificationDevice().catch(() => undefined);
      return;
    }
  }, []);
  async function enableNotifications() {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        return;
      }
      await syncNotificationDevice();
      localStorage.removeItem(DISMISSED_KEY);
      setVisible(false);
    } catch {
      setError("Não foi possível ativar as notificações. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-[#E4E1D8] bg-white p-4 shadow-xl sm:left-auto sm:mx-0 sm:w-[25rem]">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Agora não"
        className="absolute right-3 top-3 rounded-lg p-1 text-[#5C6B68] hover:bg-[#12201E]/5"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3 pr-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F5C56]/10 text-[#0F5C56]">
          <Bell className="h-5 w-5" />
        </span>
        <div>
          <p className="font-medium text-[#12201E]">
            Receba atualizações dos seus horários
          </p>
          <p className="mt-1 text-sm text-[#5C6B68]">
            Ative as notificações para acompanhar novos agendamentos e mudanças
            importantes.
          </p>
        </div>
      </div>
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-xl px-3 py-2 text-sm text-[#5C6B68] hover:bg-[#12201E]/5"
        >
          Agora não
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void enableNotifications()}
          className="flex items-center gap-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Ativar notificações
        </button>
      </div>
    </div>
  );
}
