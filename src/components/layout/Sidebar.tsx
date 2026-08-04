import { NavLink } from "react-router-dom";
import { CalendarCheck2, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { EstablishmentAvatar } from "./EstablishmentAvatar";
import { LogoutButton } from "./LogoutButton";
import { MOCK_ESTABLISHMENT } from "../../data/mock-establishment";
import "../../styles/brand.css";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F5C56] text-white">
          <CalendarCheck2 className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="th-display text-lg font-semibold lowercase text-[#12201E]">
          tem horário?
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={path === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-lg py-2 pl-3.5 pr-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#0F5C56]/8 text-[#0F5C56]"
                      : "text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[#F2A93B] transition-opacity",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé: estabelecimento + logout */}
      <div className="border-t border-[#E4E1D8] p-3">
        <div className="rounded-lg px-1 py-1.5">
          <EstablishmentAvatar
            name={MOCK_ESTABLISHMENT.name}
            subtitle="Plano Profissional"
            imageUrl={MOCK_ESTABLISHMENT.photo ?? undefined}
          />
        </div>
        <LogoutButton className="mt-1" />
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop: fixa */}
      <aside className="hidden w-64 shrink-0 border-r border-[#E4E1D8] bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile: drawer sobreposto */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div
          onClick={onClose}
          className={cn(
            "absolute inset-0 bg-[#12201E]/40 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[80%] bg-white shadow-xl transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="absolute right-3 top-4 rounded-lg p-1.5 text-[#5C6B68] hover:bg-[#12201E]/5 hover:text-[#12201E]"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <SidebarContent onNavigate={onClose} />
        </div>
      </div>
    </>
  );
}
