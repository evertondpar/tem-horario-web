import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { ScheduleEditor } from "../components/agenda/ScheduleEditor";
import { SlotStatusLegend } from "../components/agenda/SlotStatusLegend";
import { MOCK_COLLABORATORS } from "../data/mock-collaborators";
import { MOCK_SCHEDULES } from "../data/mock-schedules";
import type { WeekSlots } from "../types/schedule";

export default function Agenda() {
  // TODO: trocar pelos dados reais
  // (GET /collaborators para o seletor, GET/PUT /schedules?collaborator_id= para a agenda)
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState(
    MOCK_COLLABORATORS[0]?.id ?? null
  );
  const [schedules, setSchedules] = useState(MOCK_SCHEDULES);

  const selectedCollaborator = MOCK_COLLABORATORS.find((c) => c.id === selectedCollaboratorId);
  const schedule = schedules.find((s) => s.collaborator_id === selectedCollaboratorId);

  async function handleSave(week: WeekSlots) {
    if (!schedule) return;
    // TODO: substituir por chamada real (PUT /schedules/:id)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSchedules((prev) =>
      prev.map((s) => (s.id === schedule.id ? { ...s, ...week } : s))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="collaborator" className="mb-1.5 block text-sm font-medium text-[#12201E]">
            Colaborador
          </label>
          <select
            id="collaborator"
            value={selectedCollaboratorId ?? ""}
            onChange={(e) => setSelectedCollaboratorId(Number(e.target.value))}
            className="w-full max-w-xs rounded-xl border border-[#E4E1D8] bg-white py-2.5 px-3.5 text-sm text-[#12201E] outline-none transition-colors focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15 sm:w-auto"
          >
            {MOCK_COLLABORATORS.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name}
              </option>
            ))}
          </select>
        </div>

        <SlotStatusLegend />
      </div>

      {!selectedCollaborator || !schedule ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
          <CalendarClock className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
          <p className="text-sm text-[#5C6B68]">
            Esse colaborador ainda não tem uma agenda configurada.
          </p>
        </div>
      ) : (
        // key força reiniciar o editor (sem edições pendentes) ao trocar de colaborador
        <ScheduleEditor key={schedule.id} schedule={schedule} onSave={handleSave} />
      )}
    </div>
  );
}
