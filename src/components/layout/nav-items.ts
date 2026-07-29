import {
  LayoutDashboard,
  Tag,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Serviços", path: "/servicos", icon: Tag },
  { label: "Colaboradores", path: "/colaboradores", icon: Users },
  { label: "Agenda", path: "/agenda", icon: Calendar },
  { label: "Agendamentos", path: "/agendamentos", icon: ClipboardList },
  { label: "Configurações", path: "/configuracoes", icon: Settings },
];
