import type { Collaborator } from "@/types/collaborator";
import type { Service } from "@/types/service";
import { api } from "@/api/api";
import { storage } from "@/utils/storage";

export type ListCollaboratorsResponseCollaborator = Omit<
  Collaborator,
  "password" | "collaboratorServices"
> & {
  services: Partial<Service>[];
};

export interface ListCollaboratorsResponse {
  collaborators: ListCollaboratorsResponseCollaborator[];
}

export async function getCollaborators() {
  const token = storage.getToken();

  const { data } = await api.get<ListCollaboratorsResponse>(
    "/establishments/collaborators",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
