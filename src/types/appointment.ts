export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  CONFIRMED = "confirmed",
  REFUSED = "refused",
  CANCELED = "canceled",
  COMPLETED = "completed",
}

export type Collaborator = {
  id: number;
  name: string;
};

export type Service = {
  id: number;
  name: string;
};

export type Appointment = {
  id: number;
  collaborator_id: number;
  collaborator: Collaborator;
  client_name: string;
  client_phone: string;
  service_id: number;
  service: Service;
  status: AppointmentStatus;
  /** formato "YYYY-MM-DD" */
  appointment_date: string;
  /** formato "HH:mm" ou "HH:mm:ss" */
  start_time: string;
  createdAt: string;
  updatedAt: string;
};
