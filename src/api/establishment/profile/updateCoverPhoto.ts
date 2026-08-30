import { api } from "@/api/api";

export async function updateCoverPhoto(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.patch("/establishments/cover-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
