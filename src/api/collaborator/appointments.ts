import { api } from "../api";
import type { Appointment, AppointmentStatus } from "../../types/appointment";

export async function getCollaboratorAppointments(collaboratorId: number) {
  const { data } = await api.get<Appointment[]>("/appointments");
  return data.filter((appointment) => appointment.collaborator_id === collaboratorId);
}

export async function changeAppointmentStatus(
  appointmentId: number,
  status: AppointmentStatus,
) {
  const { data } = await api.patch<Appointment>(
    `/appointments/status/${appointmentId}`,
    { status },
  );
  return data;
}
