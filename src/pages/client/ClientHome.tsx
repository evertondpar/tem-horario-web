import { Clock3, MapPin, Scissors, Search, Store, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getClientHome } from "../../api/client";
import type { MarketplaceEstablishment } from "../../types/client";
import { formatCurrency } from "../../lib/format";

export default function ClientHome() {
  const [items, setItems] = useState<MarketplaceEstablishment[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { getClientHome().then(setItems).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.address}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return <>
    <section className="relative overflow-hidden bg-[#0F5C56] px-4 py-16 text-white sm:py-24"><div className="th-grid-texture absolute inset-0 opacity-60" /><div className="relative mx-auto max-w-7xl"><div className="max-w-2xl"><p className="mb-4 text-sm font-medium text-[#F2A93B]">Agende sem complicação</p><h1 className="th-display text-4xl font-medium leading-tight sm:text-6xl">Encontre seu próximo horário.</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">Descubra barbearias perto de você, compare serviços e escolha o melhor horário em poucos passos.</p><div className="relative mt-8 max-w-xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5C6B68]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou endereço" className="w-full rounded-2xl bg-white py-4 pl-12 pr-4 text-sm text-[#12201E] outline-none shadow-xl placeholder:text-[#5C6B68]/60" /></div></div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-6 flex items-end justify-between"><div><h2 className="th-display text-2xl font-medium">Estabelecimentos</h2><p className="mt-1 text-sm text-[#5C6B68]">Escolha onde você quer ser atendido.</p></div><span className="text-sm text-[#5C6B68]">{filtered.length} encontrados</span></div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0F5C56]" /></div> : error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">Não foi possível carregar os estabelecimentos.</div> : filtered.length === 0 ? <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E1D8] py-20"><Store className="h-6 w-6 text-[#5C6B68]" /><p className="text-sm text-[#5C6B68]">Nenhum estabelecimento encontrado.</p></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <Link key={item.id} to={`/estabelecimentos/${item.id}/agendar`} className="group overflow-hidden rounded-2xl border border-[#E4E1D8] bg-white transition hover:-translate-y-0.5 hover:shadow-lg"><div className="flex h-36 items-center justify-center bg-[#0F5C56]/8">{item.photo ? <img src={item.photo} alt="" className="h-full w-full object-cover" /> : <Store className="h-9 w-9 text-[#0F5C56]/45" />}</div><div className="p-5"><h3 className="text-lg font-semibold group-hover:text-[#0F5C56]">{item.name}</h3><p className="mt-2 flex items-center gap-1.5 text-sm text-[#5C6B68]"><MapPin className="h-4 w-4" />{item.address || "Endereço não informado"}</p><div className="mt-4 flex items-center justify-between border-t border-[#E4E1D8] pt-4 text-xs text-[#5C6B68]"><span className="flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5" />{item.service_count} serviços</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{item.starting_price === null ? "Consulte" : `A partir de ${formatCurrency(item.starting_price)}`}</span></div></div></Link>)}</div>}
    </section>
  </>;
}
