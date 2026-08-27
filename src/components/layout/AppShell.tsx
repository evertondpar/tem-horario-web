import { useState } from "react";
import { Outlet } from "react-router-dom";
import "@fontsource-variable/geist";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NotificationPermissionPrompt } from "../notifications/NotificationPermissionPrompt";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F6F2]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Área de conteúdo — cada página é renderizada aqui */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <NotificationPermissionPrompt />
    </div>
  );
}
