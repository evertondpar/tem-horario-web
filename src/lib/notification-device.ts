import { registerDevice } from "../api/devices";
import { getFirebaseMessagingToken } from "./firebase";

export async function syncNotificationDevice() {
  const token = await getFirebaseMessagingToken();
  if (!token) throw new Error("O Firebase não retornou um token FCM.");
  return registerDevice(token);
}
