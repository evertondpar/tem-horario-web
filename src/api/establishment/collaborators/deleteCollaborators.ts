import { api } from "@/api/api";
import { storage } from "@/utils/storage";

export async function deleteCollaborators(id: string) {
  const token = storage.getToken();

  const { data } = await api.delete(`/collaborators/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
