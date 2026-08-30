import { Camera, Check, Loader2, Lock, Phone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { deleteClientAccount, getClientProfile, updateClientPhoto, updateClientProfile } from "../../api/client";
import type { Client } from "../../types/client";
import { getInitials } from "../../lib/utils";
import { storage } from "../../utils/storage";
import { NotificationSettings } from "../../components/notifications/NotificationSettings";
import { useNavigate } from "react-router-dom";

export default function ClientProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Client | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File>();
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function syncSession(client: Client) {
    const session = storage.getSession();
    if (session?.role === "client") storage.setSession({ ...session, user: { ...session.user, ...client } });
  }

  useEffect(() => {
    void getClientProfile().then((client) => {
      setProfile(client);
      setName(client.name);
      setPhone(client.phone);
      syncSession(client);
    });
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setMessage(null);
    try {
      const client = await updateClientProfile({ name, phone, ...(password ? { password } : {}) });
      setProfile(client); setPassword(""); syncSession(client); setMessage("Perfil atualizado.");
    } catch { setMessage("Não foi possível atualizar o perfil."); }
    finally { setSaving(false); }
  }

  async function changePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 3 * 1024 * 1024) {
      setMessage("Escolha uma imagem de até 3 MB."); return;
    }
    setMessage(null);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setNewPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function savePhoto() {
    if (!photoFile) return;
    setSavingPhoto(true); setMessage(null);
    try {
      const client = await updateClientPhoto(photoFile);
      setProfile(client); setPhotoFile(undefined); setNewPhoto(null); syncSession(client); setMessage("Foto atualizada.");
    } catch { setMessage("Não foi possível atualizar a foto."); }
    finally { setSavingPhoto(false); }
  }

  if (!profile) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-[#0F5C56]" /></div>;
  const inputClass = "w-full rounded-xl border border-[#E4E1D8] bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0F5C56] focus:ring-2 focus:ring-[#0F5C56]/15";
  const displayedPhoto = newPhoto ?? profile.photo;
  return <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10"><h1 className="th-display text-3xl font-medium">Meu perfil</h1><p className="mt-2 text-sm text-[#5C6B68]">Atualize seus dados e a foto da sua conta.</p><div className="mt-7 rounded-2xl border border-[#E4E1D8] bg-white p-4 sm:p-6"><div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">{displayedPhoto ? <img src={displayedPhoto} alt={profile.name} className="h-20 w-20 rounded-full border border-[#E4E1D8] object-cover" /> : <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F5C56] text-xl font-medium text-white">{getInitials(profile.name)}</span>}<div className="min-w-0 w-full sm:w-auto"><div className="flex flex-col gap-2 min-[400px]:flex-row"><button type="button" disabled={savingPhoto} onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-xl border border-[#E4E1D8] px-4 py-2 text-sm font-medium hover:bg-[#12201E]/5"><Camera className="h-4 w-4" />{profile.photo ? "Trocar foto" : "Adicionar foto"}</button>{photoFile && <button type="button" disabled={savingPhoto} onClick={() => void savePhoto()} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#5C6B68] hover:bg-green-50 hover:text-green-600 disabled:opacity-60">{savingPhoto && <Loader2 className="h-4 w-4 animate-spin" />}Salvar</button>}</div><p className="mt-2 text-xs text-[#5C6B68]">JPG ou PNG, até 3 MB</p><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => void changePhoto(event)} /></div></div><form onSubmit={(event) => void submit(event)} className="mt-7 space-y-4"><label className="block text-sm font-medium">Nome<div className="relative mt-1.5"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input value={name} onChange={(event) => setName(event.target.value)} required className={inputClass} /></div></label><label className="block text-sm font-medium">Telefone<div className="relative mt-1.5"><Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input value={phone} onChange={(event) => setPhone(event.target.value)} required className={inputClass} /></div></label><label className="block text-sm font-medium">Nova senha <span className="font-normal text-[#5C6B68]">(opcional)</span><div className="relative mt-1.5"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C6B68]" /><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} placeholder="Deixe vazio para manter a atual" className={inputClass} /></div></label>{message && <p className="text-sm text-[#5C6B68]">{message}</p>}<button disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0F5C56] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Salvar alterações</button></form></div><NotificationSettings className="mt-6" /><section className="mt-6 rounded-2xl border border-red-200 bg-white p-5"><h2 className="font-medium text-red-700">Excluir conta</h2><p className="mt-1 text-sm text-[#5C6B68]">Seus dados de acesso serão removidos. O histórico dos estabelecimentos será preservado sem vínculo com sua conta.</p><button type="button" onClick={() => { if (window.confirm("Deseja realmente excluir sua conta? Essa ação não pode ser desfeita.")) void deleteClientAccount().then(() => { storage.clear(); navigate("/"); }); }} className="mt-4 rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600">Excluir minha conta</button></section></div>;
}
