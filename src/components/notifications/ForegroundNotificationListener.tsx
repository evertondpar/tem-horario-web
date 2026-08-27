import { useEffect } from "react";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
import {
  firebaseMessagingConfigured,
  getFirebaseApp,
} from "../../lib/firebase";

export function ForegroundNotificationListener() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;

    void isSupported().then((supported) => {
      if (!active || !supported || !firebaseMessagingConfigured) return;

      unsubscribe = onMessage(getMessaging(getFirebaseApp()), (payload) => {
        if (Notification.permission !== "granted") return;

        const title =
          payload.notification?.title ??
          payload.data?.title ??
          "Nova notificação";
        const body = payload.notification?.body ?? payload.data?.body ?? "";
        const url = payload.data?.url ?? "/";

        void navigator.serviceWorker.ready.then((registration) =>
          registration.showNotification(title, {
            body,
            icon: "/favicon.svg",
            data: { url },
          }),
        );
      });
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  return null;
}
