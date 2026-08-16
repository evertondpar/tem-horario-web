import { api } from "@/api/api";
import type { EstablishmentFormData } from "@/pages/Configuracoes";
import { storage } from "@/utils/storage";

export async function updateProfile(payload: EstablishmentFormData) {
  const token = storage.getToken();

  const { data } = await api.patch(
    `/establishments/profile`,
    JSON.stringify(payload),
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
