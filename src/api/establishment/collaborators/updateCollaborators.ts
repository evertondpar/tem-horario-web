import { api } from "@/api/api";
import type { CollaboratorFormData } from "@/components/collaborators/CollaboratorFormDialog";
import { storage } from "@/utils/storage";

export async function updateCollaborators(
  id: string,
  payload: CollaboratorFormData,
) {
  const token = storage.getToken();
  const body = {
    name: payload.name,
    phone: payload.phone,
    ...(payload.password ? { password: payload.password } : {}),
  };

  const { data } = await api.patch(
    `/collaborators/${id}`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
