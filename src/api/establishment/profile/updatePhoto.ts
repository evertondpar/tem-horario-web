import { api } from "@/api/api";
import { storage } from "@/utils/storage";

export type PhotoUpdatePayload = {
  photo: File;
};

export async function updatePhoto(payload: PhotoUpdatePayload) {
  const token = storage.getToken();

  const formData = new FormData();

  formData.append("file", payload.photo);

  const { data } = await api.patch("/establishments/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
