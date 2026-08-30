import { api } from "./api";
import { storage } from "@/utils/storage";
import type { Appointment, AppointmentStatus } from "../types/appointment";
import type {
  Client,
  EstablishmentBookingDetails,
  MarketplaceEstablishment,
} from "../types/client";

export async function registerClient(payload: {
  name: string;
  phone: string;
  password: string;
}) {
  const { data } = await api.post<Client>("/clients", payload);
  return data;
}

export async function loginClient(payload: {
  phone: string;
  password: string;
}) {
  const { data } = await api.post<{ access_token: string; client: Client }>(
    "/auth/login-client",
    payload,
  );
  return data;
}

export async function getClientProfile() {
  const { data } = await api.get<Client>("/clients/me");
  return data;
}

export async function updateClientProfile(payload: {
  name: string;
  phone: string;
  password?: string;
}) {
  const { data } = await api.patch<Client>("/clients/me", payload);
  return data;
}

export async function updateClientPhoto(file: File) {
  const token = storage.getToken();

  const formData = new FormData();

  formData.append("file", file);

  const { data } = await api.patch("/clients/me/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

// export async function updateClientPhoto(file: File) {
//   const formData = new FormData();
//   formData.append("file", file);
//   const { data } = await api.patch<Client>("/clients/me/photo", formData);
//   return data;
// }

export async function getClientHome() {
  const { data } = await api.get<MarketplaceEstablishment[]>("/clients/home");
  return data;
}

export async function getBookingDetails(id: number) {
  const { data } = await api.get<EstablishmentBookingDetails>(
    `/clients/establishments/${id}`,
  );
  return data;
}

export async function createClientAppointment(payload: {
  collaborator_id: number;
  service_id: number;
  appointment_date: string;
  start_time: string;
}) {
  const { data } = await api.post<Appointment>("/appointments", payload);
  return data;
}

export async function getClientAppointments() {
  const { data } = await api.get<Appointment[]>("/appointments");
  return data;
}

export async function cancelClientAppointment(
  id: number,
  status: AppointmentStatus,
) {
  const { data } = await api.patch<Appointment>(`/appointments/status/${id}`, {
    status,
  });
  return data;
}

export type EstablishmentReview = { id: number; client_id: number; client_name: string; rating: number; comment?: string | null; createdAt: string };

export async function getEstablishmentReviews(id: number) {
  const { data } = await api.get<EstablishmentReview[]>(`/clients/establishments/${id}/reviews`);
  return data;
}

export async function saveEstablishmentReview(id: number, payload: { rating: number; comment?: string }) {
  const { data } = await api.post<EstablishmentReview>(`/clients/establishments/${id}/reviews`, payload);
  return data;
}

export async function getClientFavorites() {
  const { data } = await api.get<number[]>("/clients/me/favorites");
  return data;
}

export async function addClientFavorite(id: number) {
  await api.post(`/clients/me/favorites/${id}`);
}

export async function removeClientFavorite(id: number) {
  await api.delete(`/clients/me/favorites/${id}`);
}

export async function deleteClientAccount() {
  await api.delete("/clients/me");
}
