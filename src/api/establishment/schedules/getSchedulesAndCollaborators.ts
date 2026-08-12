import type { Collaborator } from "@/types/collaborator";
import { api } from "@/api/api";
import { storage } from "@/utils/storage";
import type { Schedule } from "@/types/schedule";

export type ListCollaboratorsAndSchedules = Omit<
  Collaborator,
  "password" | "collaboratorServices"
> & {
  schedule: Partial<Schedule>;
};

export interface ListCollaboratorsAndSchedulesResponse {
  collaborators: ListCollaboratorsAndSchedules[];
}

export async function getSchedulesAndCollaborators() {
  const token = storage.getToken();

  const { data } = await api.get<ListCollaboratorsAndSchedulesResponse>(
    "/schedules/collaborators",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
