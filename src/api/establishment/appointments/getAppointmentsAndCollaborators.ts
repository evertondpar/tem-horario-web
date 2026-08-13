import type { Collaborator } from "@/types/collaborator";
import { api } from "@/api/api";
import { storage } from "@/utils/storage";
import type { Appointment } from "@/types/appointment";

export type ListAppointmentsAndCollaborators = Omit<
  Collaborator,
  "password" | "collaboratorServices"
>;

export interface ListAppointmentsAndCollaboratorsResponse {
  collaborators: ListAppointmentsAndCollaborators[];
  appointments: Appointment[];
}

export async function getAppointmentsAndCollaborators() {
  const token = storage.getToken();

  const { data } = await api.get<ListAppointmentsAndCollaboratorsResponse>(
    "/appointments/collaborators",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
}
