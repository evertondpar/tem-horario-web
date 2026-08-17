import { useEffect, useState } from "react";
import { CalendarClock, Loader2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ScheduleEditor } from "../components/agenda/ScheduleEditor";
import { SlotStatusLegend } from "../components/agenda/SlotStatusLegend";
import { ErrorState } from "../components/ui/ErrorState";
import type { WeekSlots } from "../types/schedule";
import {
  getSchedulesAndCollaborators,
  type ListCollaboratorsAndSchedulesResponse,
} from "@/api/establishment/schedules/getSchedulesAndCollaborators";

export default function Agenda() {
  const [schedulesAndCollaborators, setSchedulesAndCollaborators] =
    useState<ListCollaboratorsAndSchedulesResponse | undefined>(undefined);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState(
    schedulesAndCollaborators?.collaborators[0]?.id ?? null,
  );
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const collaborators = schedulesAndCollaborators?.collaborators ?? [];
  const selectedCollaborator = collaborators.find(
    (collaborator) => collaborator.id === selectedCollaboratorId,
  );
  const schedule = selectedCollaborator?.schedule;

  async function handleSave(week: WeekSlots) {
    console.log("atualizar ", week);
    if (!schedule) return;
    // TODO: substituir por chamada real (PUT /schedules/:id)
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // setSchedules((prev) =>
    //   prev.map((s) => (s.id === schedule.id ? { ...s, ...week } : s)),
    // );
  }

  const handleGetSchedulesAndCollaborators = async () => {
    try {
      const response = await getSchedulesAndCollaborators();
      setSchedulesAndCollaborators(response);
      setSelectedCollaboratorId(response.collaborators[0]?.id ?? null);
      setLoadError(false);
    } catch (err) {
      console.error("Erro ao carregar as agendas", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setLoadError(false);
    void handleGetSchedulesAndCollaborators();
  };

  useEffect(() => {
    let ignore = false;

    getSchedulesAndCollaborators()
      .then((response) => {
        if (ignore) return;
        setSchedulesAndCollaborators(response);
        setSelectedCollaboratorId(response.collaborators[0]?.id ?? null);
        setLoadError(false);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        console.error("Erro ao carregar as agendas", err);
        setLoadError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {isLoading ? (
        <div
          className="flex items-center justify-center gap-2 rounded-2xl border border-[#E4E1D8] bg-white py-16"
          role="status"
        >
          <Loader2 className="h-5 w-5 animate-spin text-[#0F5C56]" strokeWidth={2} />
          <span className="text-sm text-[#5C6B68]">Carregando agenda…</span>
        </div>
      ) : loadError ? (
        <ErrorState
          title="Não foi possível carregar a agenda"
          description="Verifique sua conexão e tente novamente."
          onRetry={handleRetry}
        />
      ) : collaborators.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] bg-white px-6 py-16 text-center">
          <Users className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
          <p className="text-sm font-medium text-[#12201E]">
            Nenhum colaborador cadastrado
          </p>
          <p className="max-w-sm text-sm text-[#5C6B68]">
            Cadastre um colaborador para visualizar e configurar sua agenda.
          </p>
          <Link
            to="/colaboradores"
            className="mt-2 rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B4842]"
          >
            Cadastrar colaborador
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <label
                htmlFor="collaborator"
                className="mb-1.5 block text-sm font-medium text-[#12201E]"
              >
                Colaborador
              </label>
              <select
                id="collaborator"
                value={selectedCollaboratorId ?? ""}
                onChange={(e) => setSelectedCollaboratorId(Number(e.target.value))}
                className="w-full max-w-xs rounded-xl border border-[#E4E1D8] bg-white py-2.5 px-3.5 text-sm text-[#12201E] outline-none transition-colors focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15 sm:w-auto"
              >
                {collaborators.map((collaborator) => (
                  <option key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </option>
                ))}
              </select>
            </div>

            <SlotStatusLegend />
          </div>

          {!schedule ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] px-6 py-16 text-center">
              <CalendarClock className="h-5 w-5 text-[#5C6B68]" strokeWidth={1.75} />
              <p className="text-sm text-[#5C6B68]">
                Esse colaborador ainda não tem uma agenda configurada.
              </p>
            </div>
          ) : (
            // key força reiniciar o editor (sem edições pendentes) ao trocar de colaborador
            <ScheduleEditor
              key={schedule.id}
              schedule={schedule}
              onSave={handleSave}
              readonly
            />
          )}
        </>
      )}
    </div>
  );
}
