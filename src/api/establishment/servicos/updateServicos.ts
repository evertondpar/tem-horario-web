import { api } from "@/api/api";
import type { ServiceFormData } from "@/components/services/ServiceFormDialog";
import { storage } from "@/utils/storage";

export async function updateServicos(id: string, payload: ServiceFormData) {
  const token = storage.getToken();

  const { data } = await api.patch(`/services/${id}`, JSON.stringify(payload), {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
