import { api } from "./api";
import type { Appointment, AppointmentStatus } from "../types/appointment";
import type { Client, EstablishmentBookingDetails, MarketplaceEstablishment } from "../types/client";

export async function registerClient(payload: { name: string; phone: string; password: string }) {
  const { data } = await api.post<Client>("/clients", payload);
  return data;
}

export async function loginClient(payload: { phone: string; password: string }) {
  const { data } = await api.post<{ access_token: string; client: Client }>("/auth/login-client", payload);
  return data;
}

export async function getClientHome() {
  const { data } = await api.get<MarketplaceEstablishment[]>("/clients/home");
  return data;
}

export async function getBookingDetails(id: number) {
  const { data } = await api.get<EstablishmentBookingDetails>(`/clients/establishments/${id}`);
  return data;
}

export async function createClientAppointment(payload: { collaborator_id: number; service_id: number; appointment_date: string; start_time: string }) {
  const { data } = await api.post<Appointment>("/appointments", payload);
  return data;
}

export async function getClientAppointments() {
  const { data } = await api.get<Appointment[]>("/appointments");
  return data;
}

export async function cancelClientAppointment(id: number, status: AppointmentStatus) {
  const { data } = await api.patch<Appointment>(`/appointments/status/${id}`, { status });
  return data;
}
