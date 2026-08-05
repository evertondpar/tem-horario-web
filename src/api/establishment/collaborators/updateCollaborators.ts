import { api } from "@/api/api";
import type { CollaboratorFormData } from "@/components/collaborators/CollaboratorFormDialog";
import { storage } from "@/utils/storage";

export async function updateCollaborators(
  id: string,
  payload: CollaboratorFormData,
) {
  const token = storage.getToken();

  const { data } = await api.patch(
    `/collaborators/${id}`,
    JSON.stringify(payload),
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
