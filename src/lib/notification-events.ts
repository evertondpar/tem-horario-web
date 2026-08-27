export const APPOINTMENTS_UPDATED_EVENT = "tem-horario-appointments-updated";

export type AppointmentNotificationData = {
  type?: string;
  appointment_id?: string;
  status?: string;
};
