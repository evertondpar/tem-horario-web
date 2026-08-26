import { api } from "@/api/api";
import { storage } from "@/utils/storage";

export async function updateCollaboratorPhoto(id: string, file: File) {
  const token = storage.getToken();

  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.patch(`/collaborators/${id}/photo`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
