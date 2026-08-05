import { api } from "@/api/api";
import { storage } from "@/utils/storage";

export async function deleteServicos(id: string) {
  const token = storage.getToken();

  const { data } = await api.delete(`/services/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
