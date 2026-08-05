import type { AppointmentStatus } from "../appointment";

export type RawService = {
  id: number;
  establishment_id: number;
  name: string;
  duration_minutes: number;
  /** vem como string do backend (coluna decimal) */
  price: string;
  createdAt: string;
  updatedAt: string;
};

export type RawCollaborator = {
  id: number;
  establishment_id: number;
  name: string;
  phone: string;
  password: string;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RawAppointment = {
  id: number;
  collaborator_id: number;
  establishment_id: number;
  client_name: string;
  client_phone: string;
  service_id: number;
  status: AppointmentStatus;
  /** "YYYY-MM-DD" */
  appointment_date: string;
  /** "HH:mm" */
  start_time: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardInfosResponse = {
  services: RawService[];
  collaborators: RawCollaborator[];
  appointments: RawAppointment[];
};
