import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseMessagingConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId &&
  import.meta.env.VITE_FIREBASE_VAPID_KEY,
);

function getServiceWorkerUrl() {
  const params = new URLSearchParams(firebaseConfig);
  return `/firebase-messaging-sw.js?${params.toString()}`;
}

export async function getFirebaseMessagingToken() {
  if (!firebaseMessagingConfigured) {
    throw new Error("Configuração pública do Firebase não informada.");
  }
  if (!(await isSupported())) {
    throw new Error("Este navegador não oferece suporte a notificações push.");
  }

  const registration = await navigator.serviceWorker.register(
    getServiceWorkerUrl(),
  );
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getToken(getMessaging(app), {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
}
