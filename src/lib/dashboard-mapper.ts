import type { Appointment } from "../types/appointment";
import type { DashboardInfosResponse } from "../types/api/dashboard";

export type DashboardData = {
  appointments: Appointment[];
  totalCollaborators: number;
  totalServices: number;
};

/**
 * A API devolve appointments só com collaborator_id/service_id (sem os
 * objetos aninhados). Aqui a gente junta com as listas de services e
 * collaborators que já vêm na mesma resposta pra montar o Appointment
 * completo que os componentes do dashboard esperam.
 */
export function mapDashboardResponse(raw: DashboardInfosResponse): DashboardData {
  const collaboratorsById = new Map(raw.collaborators.map((c) => [c.id, c]));
  const servicesById = new Map(raw.services.map((s) => [s.id, s]));

  const appointments: Appointment[] = raw.appointments.flatMap((appointment) => {
    const collaborator = collaboratorsById.get(appointment.collaborator_id);
    const service = servicesById.get(appointment.service_id);

    // Se o colaborador/serviço não vier na resposta (dado inconsistente),
    // ignora esse agendamento em vez de quebrar a tela inteira.
    if (!collaborator || !service) return [];

    return [
      {
        id: appointment.id,
        collaborator_id: appointment.collaborator_id,
        collaborator: { id: collaborator.id, name: collaborator.name },
        client_name: appointment.client_name,
        client_phone: appointment.client_phone,
        service_id: appointment.service_id,
        service: { id: service.id, name: service.name },
        status: appointment.status,
        appointment_date: appointment.appointment_date,
        start_time: appointment.start_time,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    ];
  });

  return {
    appointments,
    totalCollaborators: raw.collaborators.length,
    totalServices: raw.services.length,
  };
}
