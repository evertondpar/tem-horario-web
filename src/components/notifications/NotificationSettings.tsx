import { Bell, BellOff, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { firebaseMessagingConfigured } from "../../lib/firebase";
import { syncNotificationDevice } from "../../lib/notification-device";
import { cn } from "../../lib/utils";

function getPermission(): NotificationPermission | "unsupported" {
  return "Notification" in window && "serviceWorker" in navigator
    ? Notification.permission
    : "unsupported";
}

export function NotificationSettings({ className }: { className?: string }) {
  const [permission, setPermission] = useState(getPermission);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function synchronize() {
    setLoading(true);
    setError(null);
    try {
      await syncNotificationDevice();
    } catch {
      setError("A permissão foi concedida, mas não foi possível registrar este dispositivo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function refreshPermission() {
      const current = getPermission();
      setPermission(current);
      if (current === "granted") void synchronize();
    }
    document.addEventListener("visibilitychange", refreshPermission);
    window.addEventListener("focus", refreshPermission);
    return () => {
      document.removeEventListener("visibilitychange", refreshPermission);
      window.removeEventListener("focus", refreshPermission);
    };
  }, []);

  async function requestPermission() {
    setLoading(true);
    setError(null);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") await syncNotificationDevice();
    } catch {
      setError("Não foi possível ativar as notificações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={cn("rounded-2xl border border-[#E4E1D8] bg-white p-6", className)}>
      <div className="flex items-start gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", permission === "denied" ? "bg-red-50 text-red-600" : "bg-[#0F5C56]/10 text-[#0F5C56]")}>
          {permission === "denied" ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </span>
        <div>
          <h2 className="font-medium text-[#12201E]">Notificações</h2>
          {permission === "granted" && <p className="mt-1 flex items-center gap-1.5 text-sm text-[#0F5C56]"><Check className="h-4 w-4" />Ativadas neste navegador</p>}
          {permission === "default" && <p className="mt-1 text-sm text-[#5C6B68]">Ative para receber atualizações importantes dos seus horários.</p>}
          {permission === "denied" && <p className="mt-1 text-sm text-red-700">As notificações estão bloqueadas neste navegador.</p>}
          {permission === "unsupported" && <p className="mt-1 text-sm text-[#5C6B68]">Este navegador não oferece suporte a notificações push.</p>}
        </div>
      </div>

      {!firebaseMessagingConfigured && <p className="mt-4 text-sm text-amber-700">O Firebase ainda não está configurado neste ambiente.</p>}

      {permission === "default" && firebaseMessagingConfigured && (
        <button type="button" disabled={loading} onClick={() => void requestPermission()} className="mt-4 flex items-center gap-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Ativar notificações
        </button>
      )}

      {permission === "denied" && (
        <div className="mt-4 rounded-xl bg-[#F7F6F2] p-4 text-sm text-[#5C6B68]">
          <p className="font-medium text-[#12201E]">Como permitir novamente</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Clique no ícone ao lado do endereço do site.</li>
            <li>Abra as configurações ou permissões do site.</li>
            <li>Altere “Notificações” para “Permitir”.</li>
            <li>Volte para esta página; a ativação será detectada automaticamente.</li>
          </ol>
        </div>
      )}

      {loading && permission === "granted" && <p className="mt-3 flex items-center gap-2 text-xs text-[#5C6B68]"><Loader2 className="h-3.5 w-3.5 animate-spin" />Sincronizando este dispositivo...</p>}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
    </section>
  );
}
