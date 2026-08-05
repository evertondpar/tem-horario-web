import { storage } from "@/utils/storage";
import { api } from "../api";

export async function getDashboardInfos() {
  const token = storage.getToken();

  const { data } = await api.get("/establishments/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
