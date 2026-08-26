import { api } from "@/api/api";
import type { CollaboratorFormData } from "@/components/collaborators/CollaboratorFormDialog";
import { storage } from "@/utils/storage";

export async function createCollaborators(payload: CollaboratorFormData) {
  const token = storage.getToken();

  const body = { name: payload.name, phone: payload.phone, password: payload.password };
  const { data } = await api.post("/collaborators", body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
