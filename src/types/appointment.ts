export const AppointmentStatus = {
  SCHEDULED: "scheduled",
  CONFIRMED: "confirmed",
  REFUSED: "refused",
  CANCELED: "canceled",
  COMPLETED: "completed",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: "Agendado",
  [AppointmentStatus.CONFIRMED]: "Confirmado",
  [AppointmentStatus.COMPLETED]: "Concluído",
  [AppointmentStatus.CANCELED]: "Cancelado",
  [AppointmentStatus.REFUSED]: "Recusado",
};

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
