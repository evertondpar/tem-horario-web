import { api } from "@/api/api";
import type { CollaboratorFormData } from "@/components/collaborators/CollaboratorFormDialog";
import { storage } from "@/utils/storage";

export async function createCollaborators(payload: CollaboratorFormData) {
  const token = storage.getToken();

  const { data } = await api.post("/collaborators", JSON.stringify(payload), {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
}
