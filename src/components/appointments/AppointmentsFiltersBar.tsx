import { X } from "lucide-react";
import {
  AppointmentStatus,
  APPOINTMENT_STATUS_LABELS,
} from "../../types/appointment";
import type { Collaborator } from "../../types/collaborator";
import { DEFAULT_APPOINTMENT_FILTERS, type AppointmentFilters } from "../../lib/appointments";

type AppointmentsFiltersBarProps = {
  filters: AppointmentFilters;
  onChange: (filters: AppointmentFilters) => void;
  collaborators: Collaborator[];
};

const SELECT_CLASSNAME =
  "w-full rounded-xl border border-[#E4E1D8] bg-white py-2.5 px-3.5 text-sm text-[#12201E] outline-none transition-colors focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15";

export function AppointmentsFiltersBar({
  filters,
  onChange,
  collaborators,
}: AppointmentsFiltersBarProps) {
  const hasActiveFilters =
    filters.date !== "" || filters.collaboratorId !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:flex-row sm:items-end sm:gap-3">
      <div className="flex-1">
        <label htmlFor="filter-date" className="mb-1.5 block text-sm font-medium text-[#12201E]">
          Data
        </label>
        <input
          id="filter-date"
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
          className={SELECT_CLASSNAME}
        />
      </div>

      <div className="flex-1">
        <label
          htmlFor="filter-collaborator"
          className="mb-1.5 block text-sm font-medium text-[#12201E]"
        >
          Colaborador
        </label>
        <select
          id="filter-collaborator"
          value={filters.collaboratorId}
          onChange={(e) =>
            onChange({
              ...filters,
              collaboratorId: e.target.value === "all" ? "all" : Number(e.target.value),
            })
          }
          className={SELECT_CLASSNAME}
        >
          <option value="all">Todos</option>
          {collaborators.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="filter-status" className="mb-1.5 block text-sm font-medium text-[#12201E]">
          Status
        </label>
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value === "all" ? "all" : (e.target.value as AppointmentStatus),
            })
          }
          className={SELECT_CLASSNAME}
        >
          <option value="all">Todos</option>
          {Object.values(AppointmentStatus).map((status) => (
            <option key={status} value={status}>
              {APPOINTMENT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_APPOINTMENT_FILTERS)}
          className="flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E] sm:w-auto"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
          Limpar filtros
        </button>
      )}
    </div>
  );
}
