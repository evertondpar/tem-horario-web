import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOnboardingStatus } from "../../api/onboarding";

const LABELS = {
  profile: "Dados e funcionamento",
  service: "Primeiro serviço",
  collaborator: "Primeiro colaborador",
  schedule: "Agenda inicial",
  assigned_service: "Serviço atribuído",
};

export function OnboardingChecklist() {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getOnboardingStatus>> | null>(null);
  useEffect(() => { getOnboardingStatus().then(setStatus).catch(() => undefined); }, []);
  if (!status || status.completed) return null;
  const completed = Object.values(status.steps).filter(Boolean).length;
  return <div className="rounded-2xl border border-[#F2A93B]/40 bg-[#FFF9EE] p-5"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[#12201E]">Termine de preparar seu estabelecimento</p><p className="mt-1 text-sm text-[#5C6B68]">Seu perfil será publicado após concluir os passos iniciais.</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{Object.entries(status.steps).map(([key, done]) => <span key={key} className="flex items-center gap-1.5 text-xs text-[#5C6B68]">{done ? <CheckCircle2 className="h-3.5 w-3.5 text-[#0F5C56]" /> : <Circle className="h-3.5 w-3.5" />}{LABELS[key as keyof typeof LABELS]}</span>)}</div></div><div className="shrink-0"><p className="mb-2 text-xs text-[#5C6B68]">{completed} de 5 concluídos</p><Link to="/onboarding" className="flex items-center justify-center gap-2 rounded-xl bg-[#0F5C56] px-4 py-2.5 text-sm font-medium text-white">Continuar configuração<ArrowRight className="h-4 w-4" /></Link></div></div></div>;
}
