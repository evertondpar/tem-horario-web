import { CalendarCheck2, CalendarDays, LogOut, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { storage } from "../../utils/storage";
import { cn } from "../../lib/utils";

export default function ClientLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const session = storage.getSession();
  const isClient = session?.role === "client";
  const links = [{ label: "Explorar", path: "/", icon: Search }, ...(isClient ? [{ label: "Meus horários", path: "/meus-agendamentos", icon: CalendarDays }] : [])];

  return <div className="min-h-screen bg-[#F7F6F2] text-[#12201E]">
    <header className="sticky top-0 z-40 border-b border-[#E4E1D8] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F5C56] text-white"><CalendarCheck2 className="h-4 w-4" /></span><span className="th-display text-lg font-semibold lowercase">tem horário?</span></Link>
        <nav className="hidden items-center gap-1 md:flex">{links.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} end={path === "/"} className={({ isActive }) => cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium", isActive ? "bg-[#0F5C56]/8 text-[#0F5C56]" : "text-[#5C6B68] hover:bg-[#12201E]/5")}><Icon className="h-4 w-4" />{label}</NavLink>)}</nav>
        <div className="hidden items-center gap-2 md:flex">{isClient ? <><span className="mr-2 text-sm text-[#5C6B68]">Olá, {session.user.name.split(" ")[0]}</span><button onClick={() => { storage.clear(); navigate("/"); }} className="rounded-lg p-2 text-[#5C6B68] hover:bg-[#12201E]/5" aria-label="Sair"><LogOut className="h-4 w-4" /></button></> : <><Link to="/entrar" className="px-3 py-2 text-sm font-medium text-[#0F5C56]">Entrar</Link><Link to="/cadastro" className="rounded-xl bg-[#0F5C56] px-4 py-2 text-sm font-medium text-white">Criar conta</Link></>}</div>
        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {open && <div className="border-t border-[#E4E1D8] bg-white p-4 md:hidden">{links.map(({ label, path }) => <Link key={path} to={path} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-[#5C6B68]">{label}</Link>)}{isClient ? <button onClick={() => { storage.clear(); navigate("/"); }} className="mt-2 w-full rounded-xl border border-[#E4E1D8] px-4 py-2 text-sm">Sair</button> : <div className="mt-2 grid grid-cols-2 gap-2"><Link to="/entrar" className="rounded-xl border border-[#E4E1D8] px-4 py-2 text-center text-sm">Entrar</Link><Link to="/cadastro" className="rounded-xl bg-[#0F5C56] px-4 py-2 text-center text-sm text-white">Criar conta</Link></div>}</div>}
    </header>
    <main><Outlet /></main>
  </div>;
}
