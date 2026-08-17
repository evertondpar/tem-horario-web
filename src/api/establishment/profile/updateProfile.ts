import { api } from "@/api/api";
import type { EstablishmentFormData } from "@/pages/Configuracoes";
import { storage } from "@/utils/storage";

type UpdateProfilePayload = Pick<
  EstablishmentFormData,
  "name" | "phone" | "address"
> &
  Partial<Pick<EstablishmentFormData, "open_hour" | "close_hour">>;

export async function updateProfile(payload: UpdateProfilePayload) {
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
