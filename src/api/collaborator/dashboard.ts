import { api } from "../api";
import type { SessionUser } from "../../utils/storage";

export type CollaboratorDashboardResponse = {
  collaborator: SessionUser;
};

export async function getCollaboratorDashboard() {
  const { data } = await api.get<CollaboratorDashboardResponse>(
    "/collaborators/dashboard",
  );
  return data;
}
