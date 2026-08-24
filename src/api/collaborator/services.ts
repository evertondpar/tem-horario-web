import { api } from "../api";
import type { Service } from "../../types/service";

export type CollaboratorServiceLink = {
  id: number;
  collaborator_id: number;
  service_id: number;
  createdAt?: string;
  updatedAt?: string;
};

export async function getEstablishmentServices() {
  const { data } = await api.get<Service[]>("/services");
  return data;
}

export async function getAssignedServices() {
  const { data } = await api.get<CollaboratorServiceLink[]>(
    "/collaborator-service",
  );
  return data;
}

export async function assignService(serviceId: number) {
  const { data } = await api.post<CollaboratorServiceLink>(
    "/collaborator-service",
    { service_id: serviceId },
  );
  return data;
}

export async function unassignService(linkId: number) {
  await api.delete(`/collaborator-service/${linkId}`);
}
