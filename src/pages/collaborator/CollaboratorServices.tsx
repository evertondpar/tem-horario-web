import { useEffect, useMemo, useState } from "react";
import { Loader2, Scissors } from "lucide-react";
import {
  assignService,
  getAssignedServices,
  getEstablishmentServices,
  unassignService,
  type CollaboratorServiceLink,
} from "../../api/collaborator/services";
import type { Service } from "../../types/service";
import { formatCurrency, formatDuration } from "../../lib/format";

export default function CollaboratorServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [links, setLinks] = useState<CollaboratorServiceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getEstablishmentServices(), getAssignedServices()])
      .then(([available, assigned]) => {
        setServices(available);
        setLinks(assigned);
      })
      .catch(() =>
        setError("Não foi possível carregar os serviços do estabelecimento."),
      )
      .finally(() => setLoading(false));
  }, []);
  const linkByService = useMemo(() => new Map(links.map((link) => [link.service_id, link])), [links]);

  async function toggle(serviceId: number) {
    setChangingId(serviceId);
    setError(null);
    try {
      const link = linkByService.get(serviceId);
      if (link) {
        await unassignService(link.id);
        setLinks((current) => current.filter((item) => item.id !== link.id));
      } else {
        const created = await assignService(serviceId);
        setLinks((current) => [...current, created]);
      }
    } catch {
      setError("Não foi possível atualizar esse serviço.");
    } finally {
      setChangingId(null);
    }
  }

  return <div className="flex flex-col gap-5">
    <div><p className="text-sm text-[#5C6B68]">Escolha, entre os serviços cadastrados pelo estabelecimento, quais você realiza.</p></div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {loading ? <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-[#0F5C56]" /></div> : services.length === 0 ?
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] py-16 text-center"><Scissors className="h-5 w-5 text-[#5C6B68]" /><p className="text-sm text-[#5C6B68]">Nenhum serviço disponível para atribuição.</p></div> :
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{services.map((service) => {
        const assigned = linkByService.has(service.id);
        return <article key={service.id} className="rounded-2xl border border-[#E4E1D8] bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-medium text-[#12201E]">{service.name}</h3><p className="mt-1 text-sm text-[#5C6B68]">{formatDuration(service.duration_minutes)} · {formatCurrency(service.price)}</p></div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${assigned ? "bg-[#0F5C56]/10 text-[#0F5C56]" : "bg-[#12201E]/5 text-[#5C6B68]"}`}>{assigned ? "Atribuído" : "Não atribuído"}</span></div>
          <button type="button" disabled={changingId === service.id} onClick={() => void toggle(service.id)} className={`mt-5 w-full rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${assigned ? "border border-[#E4E1D8] text-[#5C6B68] hover:bg-[#12201E]/5" : "bg-[#0F5C56] text-white hover:bg-[#0B4842]"}`}>{changingId === service.id ? "Atualizando…" : assigned ? "Remover dos meus serviços" : "Atribuir a mim"}</button>
        </article>;
      })}</div>}
  </div>;
}
