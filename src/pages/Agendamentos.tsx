import { useEffect, useMemo, useState } from "react";
import { AppointmentsFiltersBar } from "../components/appointments/AppointmentsFiltersBar";
import { AppointmentsTable } from "../components/appointments/AppointmentsTable";
import {
  DEFAULT_APPOINTMENT_FILTERS,
  filterAppointments,
  type AppointmentFilters,
} from "../lib/appointments";
import {
  getAppointmentsAndCollaborators,
  type ListAppointmentsAndCollaboratorsResponse,
} from "@/api/establishment/appointments/getAppointmentsAndCollaborators";
import { APPOINTMENTS_UPDATED_EVENT } from "@/lib/notification-events";

export default function Agendamentos() {
  // TODO: trocar pelos dados reais (GET /appointments — todos os agendamentos
  // do estabelecimento). Os filtros abaixo podem virar query params da própria
  // requisição (?date=&collaborator_id=&status=) em vez de filtro no cliente.
  const [filters, setFilters] = useState<AppointmentFilters>(
    DEFAULT_APPOINTMENT_FILTERS,
  );

  const [appointmentsAndCollaborators, setAppointmentsAndCollaborators] =
    useState<ListAppointmentsAndCollaboratorsResponse | undefined>(undefined);

  const appointments = useMemo(
    () =>
      filterAppointments(
        appointmentsAndCollaborators?.appointments ?? [],
        filters,
      ),
    [appointmentsAndCollaborators, filters],
  );

  const hasActiveFilters =
    filters.date !== "" ||
    filters.collaboratorId !== "all" ||
    filters.status !== "all";

  useEffect(() => {
    let active = true;
    const refresh = () => void getAppointmentsAndCollaborators()
      .then((response) => { if (active) setAppointmentsAndCollaborators(response); })
      .catch((error) => console.error("Erro ao carregar as agendas", error));
    const refreshWhenVisible = () => { if (document.visibilityState === "visible") refresh(); };

    refresh();
    window.addEventListener(APPOINTMENTS_UPDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener(APPOINTMENTS_UPDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);
  return (
    <div className="flex flex-col gap-6">
      {appointmentsAndCollaborators && (
        <>
          <AppointmentsFiltersBar
            filters={filters}
            onChange={setFilters}
            collaborators={appointmentsAndCollaborators?.collaborators}
          />

          <AppointmentsTable
            appointments={appointments}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={() => setFilters(DEFAULT_APPOINTMENT_FILTERS)}
          />
        </>
      )}
    </div>
  );
}
