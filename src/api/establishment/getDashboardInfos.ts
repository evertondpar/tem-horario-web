import { storage } from "@/utils/storage";
import { api } from "../api";
import type { DashboardInfosResponse } from "@/types/api/dashboard";

export async function getDashboardInfos() {
  const token = storage.getToken();

  const { data } = await api.get<DashboardInfosResponse>("/establishments/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
