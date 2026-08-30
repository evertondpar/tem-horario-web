import { AlertCircle, ArrowLeft, ArrowRight, Camera, Check, Loader2, MapPin, Scissors, Store, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeOnboarding, type OnboardingPayload } from "../../api/onboarding";
import { findAddressByZipCode, formatAddress, formatZipCode } from "../../api/viacep";
import { updateCoverPhoto } from "../../api/establishment/profile/updateCoverPhoto";
import { storage } from "../../utils/storage";

const STEPS = ["Endereço", "Serviço", "Colaborador", "Visual", "Revisão"];
const initial: OnboardingPayload = { address: "", zip_code: "", street: "", address_number: "", address_complement: "", neighborhood: "", city: "", state: "", cover_position: 50, open_hour: "08:00", close_hour: "18:00", service_name: "", service_duration_minutes: 30, service_price: 0, collaborator_name: "", collaborator_phone: "", collaborator_password: "" };
const input = "mt-1.5 w-full rounded-xl border border-[#E4E1D8] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15";
const DRAFT_KEY = "tem-horario-onboarding-draft";

export default function EstablishmentOnboarding() {
  const navigate = useNavigate();
  const session = storage.getSession();
  const [step, setStep] = useState<number>(() => { try { return Number(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null")?.step ?? 0); } catch { return 0; } });
  const [form, setForm] = useState<OnboardingPayload>(() => { try { return { ...initial, ...(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null")?.form ?? {}) }; } catch { return initial; } });
  const [cover, setCover] = useState<File>();
  const [coverPreview, setCoverPreview] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [loadingZip, setLoadingZip] = useState(false);
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof OnboardingPayload>(key: K, value: OnboardingPayload[K]) => setForm((current) => ({ ...current, [key]: value }));
  const fullAddress = useMemo(() => formatAddress(form), [form]);
  useEffect(() => { localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, form })); }, [step, form]);

  async function lookupZip() {
    setLoadingZip(true); setError(null);
    try { const result = await findAddressByZipCode(form.zip_code); setForm((current) => ({ ...current, ...result })); }
    catch (err) { setError(err instanceof Error ? err.message : "Não foi possível consultar o CEP. Preencha manualmente."); }
    finally { setLoadingZip(false); }
  }

  function next() {
    setError(null);
    if (step === 0 && (form.zip_code.replace(/\D/g, "").length !== 8 || !form.street || !form.address_number || !form.neighborhood || !form.city || form.state.length !== 2 || form.open_hour >= form.close_hour)) return setError("Preencha o endereço completo e informe horários válidos.");
    if (step === 1 && (!form.service_name || form.service_price <= 0 || form.service_duration_minutes % 30 !== 0)) return setError("Informe um serviço válido com duração múltipla de 30 minutos.");
    if (step === 2 && (!form.collaborator_name || !form.collaborator_phone || form.collaborator_password.length < 6)) return setError("Preencha o colaborador e uma senha de pelo menos 6 caracteres.");
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  }

  async function finish() {
    setSaving(true); setError(null);
    try {
      await completeOnboarding({ ...form, address: fullAddress, zip_code: form.zip_code.replace(/\D/g, "") });
      if (cover) await updateCoverPhoto(cover);
      localStorage.removeItem(DRAFT_KEY);
      if (session?.establishment) storage.setSession({ ...session, establishment: { ...session.establishment, onboarding_completed: true } });
      navigate("/painel");
    } catch { setError("Não foi possível concluir. Confira os dados e tente novamente."); }
    finally { setSaving(false); }
  }

  return <div className="min-h-screen bg-[#F7F6F2] px-4 py-8 sm:px-6"><div className="mx-auto max-w-3xl">
    <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F5C56] text-white"><Store className="h-4 w-4" /></span><span className="th-display text-xl font-semibold">tem horário?</span></div>
    <div className="mt-10"><p className="text-sm font-medium text-[#0F5C56]">Configuração inicial</p><h1 className="th-display mt-1 text-3xl font-medium">Prepare seu estabelecimento</h1><p className="mt-2 text-sm text-[#5C6B68]">Você pode revisar tudo antes de publicar.</p></div>
    <ol className="mt-8 grid grid-cols-5 gap-2">{STEPS.map((label, index) => <li key={label}><div className={`h-1.5 rounded-full ${index <= step ? "bg-[#0F5C56]" : "bg-[#E4E1D8]"}`} /><span className={`mt-2 hidden text-xs sm:block ${index === step ? "font-medium" : "text-[#5C6B68]"}`}>{label}</span></li>)}</ol>
    <div className="mt-6 rounded-2xl border border-[#E4E1D8] bg-white p-5 sm:p-8">
      {step === 0 && <AddressStep form={form} update={update} loadingZip={loadingZip} lookupZip={lookupZip} />}
      {step === 1 && <div><SectionTitle icon={Scissors} title="Cadastre seu primeiro serviço" text="Você poderá adicionar outros depois." /><div className="mt-6 grid gap-4"><label className="text-sm font-medium">Nome<input value={form.service_name} onChange={(e) => update("service_name", e.target.value)} className={input} /></label><div className="grid grid-cols-2 gap-4"><label className="text-sm font-medium">Duração<select value={form.service_duration_minutes} onChange={(e) => update("service_duration_minutes", Number(e.target.value))} className={input}>{[30,60,90,120].map((v) => <option key={v} value={v}>{v} minutos</option>)}</select></label><label className="text-sm font-medium">Preço<input type="number" min="1" step="0.01" value={form.service_price || ""} onChange={(e) => update("service_price", Number(e.target.value))} className={input} /></label></div></div></div>}
      {step === 2 && <div><SectionTitle icon={UserRound} title="Primeiro colaborador" text="Ele receberá uma agenda e acesso próprio." /><div className="mt-6 grid gap-4"><label className="text-sm font-medium">Nome<input value={form.collaborator_name} onChange={(e) => update("collaborator_name", e.target.value)} className={input} /></label><label className="text-sm font-medium">Telefone<input value={form.collaborator_phone} onChange={(e) => update("collaborator_phone", e.target.value)} className={input} /></label><label className="text-sm font-medium">Senha<input type="password" value={form.collaborator_password} onChange={(e) => update("collaborator_password", e.target.value)} className={input} /></label></div></div>}
      {step === 3 && <div><SectionTitle icon={Camera} title="Foto de capa" text="Uma imagem horizontal deixa seu perfil mais atraente. Você também pode adicionar depois." /><label className="mt-6 block cursor-pointer overflow-hidden rounded-2xl border border-dashed border-[#E4E1D8] bg-[#F7F6F2] text-center">{coverPreview ? <img src={coverPreview} alt="Prévia da capa" style={{ objectPosition: `50% ${form.cover_position}%` }} className="aspect-[16/7] w-full object-cover" /> : <span className="flex aspect-[16/7] items-center justify-center text-sm text-[#5C6B68]">Selecionar JPG ou PNG de até 3 MB</span>}<input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (!file || file.size > 3 * 1024 * 1024) return setError("Escolha uma imagem de até 3 MB."); setCover(file); setCoverPreview(URL.createObjectURL(file)); }} /></label>{coverPreview && <label className="mt-4 block text-sm font-medium">Ajustar enquadramento<input type="range" min="0" max="100" value={form.cover_position} onChange={(e) => update("cover_position", Number(e.target.value))} className="mt-2 w-full accent-[#0F5C56]" /></label>}</div>}
      {step === 4 && <div><SectionTitle icon={Check} title="Pré-visualização" text="É assim que as informações principais aparecerão para o cliente." /><div className="mt-6 overflow-hidden rounded-2xl border border-[#E4E1D8]"><div className="aspect-[16/6] bg-[#0F5C56]/10">{coverPreview && <img src={coverPreview} alt="" className="h-full w-full object-cover" />}</div><div className="p-5"><h2 className="text-xl font-semibold">{session?.establishment?.name}</h2><p className="mt-2 text-sm text-[#5C6B68]">{fullAddress}</p><p className="mt-2 text-sm">{form.service_name} · {form.service_duration_minutes} min · R$ {form.service_price.toFixed(2)}</p></div></div></div>}
      {error && <div className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      <div className="mt-7 flex justify-between border-t border-[#E4E1D8] pt-5"><button onClick={() => setStep((v) => Math.max(0, v - 1))} disabled={step === 0 || saving} className="flex items-center gap-2 px-2 py-2 text-sm text-[#5C6B68] disabled:invisible"><ArrowLeft className="h-4 w-4" />Voltar</button>{step < STEPS.length - 1 ? <button onClick={next} className="flex items-center gap-2 rounded-xl bg-[#0F5C56] px-5 py-2.5 text-sm font-medium text-white">Continuar<ArrowRight className="h-4 w-4" /></button> : <button onClick={() => void finish()} disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0F5C56] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Publicar</button>}</div>
    </div>
  </div></div>;
}

type Update = <K extends keyof OnboardingPayload>(key: K, value: OnboardingPayload[K]) => void;
function AddressStep({ form, update, loadingZip, lookupZip }: { form: OnboardingPayload; update: Update; loadingZip: boolean; lookupZip: () => Promise<void> }) {
  return <div><SectionTitle icon={MapPin} title="Onde e quando você atende?" text="Digite o CEP para preencher o endereço automaticamente." /><div className="mt-6 grid gap-4"><label className="text-sm font-medium">CEP<div className="flex gap-2"><input value={formatZipCode(form.zip_code)} onChange={(e) => update("zip_code", e.target.value)} onBlur={() => form.zip_code.replace(/\D/g, "").length === 8 && void lookupZip()} className={input} inputMode="numeric" /><button type="button" onClick={() => void lookupZip()} disabled={loadingZip} className="mt-1.5 rounded-xl border border-[#E4E1D8] px-4 text-sm">{loadingZip ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}</button></div></label><label className="text-sm font-medium">Rua<input value={form.street} onChange={(e) => update("street", e.target.value)} className={input} /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Número<input value={form.address_number} onChange={(e) => update("address_number", e.target.value)} className={input} /></label><label className="text-sm font-medium">Complemento<input value={form.address_complement} onChange={(e) => update("address_complement", e.target.value)} className={input} /></label></div><div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-medium">Bairro<input value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} className={input} /></label><label className="text-sm font-medium">Cidade<input value={form.city} onChange={(e) => update("city", e.target.value)} className={input} /></label><label className="text-sm font-medium">Estado<input maxLength={2} value={form.state} onChange={(e) => update("state", e.target.value.toUpperCase())} className={input} /></label></div><div className="grid grid-cols-2 gap-4"><label className="text-sm font-medium">Abertura<input type="time" step="1800" value={form.open_hour} onChange={(e) => update("open_hour", e.target.value)} className={input} /></label><label className="text-sm font-medium">Fechamento<input type="time" step="1800" value={form.close_hour} onChange={(e) => update("close_hour", e.target.value)} className={input} /></label></div></div></div>;
}

function SectionTitle({ icon: Icon, title, text }: { icon: typeof MapPin; title: string; text: string }) {
  return <div className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#0F5C56]" /><div><h2 className="font-semibold">{title}</h2><p className="text-sm text-[#5C6B68]">{text}</p></div></div>;
}
