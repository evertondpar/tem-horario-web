import { api } from "@/api/api";
import type { Establishment } from "@/types/establishment";
import { storage } from "@/utils/storage";

export async function getProfile() {
  const token = storage.getToken();

  const { data } = await api.get<Partial<Establishment>>(
    "/establishments/profile",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
