import { useEffect, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { ScheduleEditor } from "../../components/agenda/ScheduleEditor";
import { SlotStatusLegend } from "../../components/agenda/SlotStatusLegend";
import { getCollaboratorSchedule, updateCollaboratorSchedule } from "../../api/collaborator/schedule";
import { storage } from "../../utils/storage";
import type { Schedule, WeekSlots } from "../../types/schedule";

export default function CollaboratorSchedule() {
  const session = storage.getSession();
  const collaboratorId = session?.user.id;
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collaboratorId) return;
    getCollaboratorSchedule(collaboratorId)
      .then(setSchedule)
      .catch(() => setError("Não foi possível carregar sua agenda."))
      .finally(() => setLoading(false));
  }, [collaboratorId]);

  async function handleSave(week: WeekSlots) {
    setError(null);
    try {
      const updated = await updateCollaboratorSchedule(week);
      setSchedule(updated);
    } catch {
      setError("Não foi possível salvar. Horários ocupados não podem ser alterados.");
      throw new Error("schedule update failed");
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#0F5C56]" /></div>;

  return <div className="flex flex-col gap-5">
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><h2 className="font-medium text-[#12201E]">Disponibilidade semanal</h2><p className="mt-1 text-sm text-[#5C6B68]">Clique nos horários para alternar entre disponível e indisponível.</p></div>
      <SlotStatusLegend />
    </div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {schedule ? <ScheduleEditor schedule={schedule} onSave={handleSave} /> : <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] py-16 text-[#5C6B68]"><CalendarClock className="h-5 w-5" /><p className="text-sm">Sua agenda ainda não foi criada pelo estabelecimento.</p></div>}
  </div>;
}
