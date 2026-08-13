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

export default function Agendamentos() {
  // TODO: trocar pelos dados reais (GET /appointments — todos os agendamentos
  // do estabelecimento). Os filtros abaixo podem virar query params da própria
  // requisição (?date=&collaborator_id=&status=) em vez de filtro no cliente.
  const [filters, setFilters] = useState<AppointmentFilters>(
    DEFAULT_APPOINTMENT_FILTERS,
  );

  const [appointmentsAndCollaborators, setAppointmentsAndCollaborators] =
    useState<ListAppointmentsAndCollaboratorsResponse>(undefined);

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

  const handleGetAppointmentsAndCollaborators = async () => {
    // setLoading(true);
    // setLoadError(false);
    try {
      const response = await getAppointmentsAndCollaborators();
      setAppointmentsAndCollaborators(response);
      console.log("res ", response);
    } catch (err) {
      console.error("Erro ao carregar os agendas", err);
      // setLoadError(true);
    } finally {
      // setLoading(false);
      // setHasLoadedOnce(true);
    }
  };
  useEffect(() => {
    handleGetAppointmentsAndCollaborators();
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
