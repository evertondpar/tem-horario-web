import { useMemo, useState } from "react";
import { AppointmentsFiltersBar } from "../components/appointments/AppointmentsFiltersBar";
import { AppointmentsTable } from "../components/appointments/AppointmentsTable";
import { MOCK_APPOINTMENTS } from "../data/mock-appointments";
import { MOCK_COLLABORATORS } from "../data/mock-collaborators";
import {
  DEFAULT_APPOINTMENT_FILTERS,
  filterAppointments,
  type AppointmentFilters,
} from "../lib/appointments";

export default function Agendamentos() {
  // TODO: trocar pelos dados reais (GET /appointments — todos os agendamentos
  // do estabelecimento). Os filtros abaixo podem virar query params da própria
  // requisição (?date=&collaborator_id=&status=) em vez de filtro no cliente.
  const [filters, setFilters] = useState<AppointmentFilters>(DEFAULT_APPOINTMENT_FILTERS);

  const appointments = useMemo(
    () => filterAppointments(MOCK_APPOINTMENTS, filters),
    [filters]
  );

  const hasActiveFilters =
    filters.date !== "" || filters.collaboratorId !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-col gap-6">
      <AppointmentsFiltersBar
        filters={filters}
        onChange={setFilters}
        collaborators={MOCK_COLLABORATORS}
      />

      <AppointmentsTable
        appointments={appointments}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => setFilters(DEFAULT_APPOINTMENT_FILTERS)}
      />
    </div>
  );
}
