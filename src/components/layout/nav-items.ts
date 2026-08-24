import {
  LayoutDashboard,
  Tag,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/painel", icon: LayoutDashboard },
  { label: "Serviços", path: "/servicos", icon: Tag },
  { label: "Colaboradores", path: "/colaboradores", icon: Users },
  { label: "Agenda", path: "/agenda", icon: Calendar },
  { label: "Agendamentos", path: "/agendamentos", icon: ClipboardList },
  { label: "Configurações", path: "/configuracoes", icon: Settings },
];

export const COLLABORATOR_NAV_ITEMS: NavItem[] = [
  { label: "Visão geral", path: "/colaborador", icon: LayoutDashboard },
  { label: "Meus agendamentos", path: "/colaborador/agendamentos", icon: ClipboardList },
  { label: "Minha agenda", path: "/colaborador/agenda", icon: Calendar },
  { label: "Meus serviços", path: "/colaborador/servicos", icon: BriefcaseBusiness },
];
