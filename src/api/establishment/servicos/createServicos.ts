import { api } from "@/api/api";
import type { ServiceFormData } from "@/components/services/ServiceFormDialog";
import { storage } from "@/utils/storage";

export async function createServicos(payload: ServiceFormData) {
  const token = storage.getToken();

  const { data } = await api.post("/services", JSON.stringify(payload), {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
