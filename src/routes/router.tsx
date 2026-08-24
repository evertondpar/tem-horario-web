import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import { AppShell } from "../components/layout/AppShell";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Servicos from "../pages/Servicos";
import Colaboradores from "../pages/Colaboradores";
import Agenda from "../pages/Agenda";
import Agendamentos from "../pages/Agendamentos";
import Configuracoes from "../pages/Configuracoes";
import CollaboratorDashboard from "../pages/collaborator/CollaboratorDashboard";
import CollaboratorAppointments from "../pages/collaborator/CollaboratorAppointments";
import CollaboratorSchedule from "../pages/collaborator/CollaboratorSchedule";
import CollaboratorServices from "../pages/collaborator/CollaboratorServices";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/login/colaborador",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute role="establishment" />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/servicos",
            element: <Servicos />,
          },
          {
            path: "/colaboradores",
            element: <Colaboradores />,
          },
          {
            path: "/agenda",
            element: <Agenda />,
          },
          {
            path: "/agendamentos",
            element: <Agendamentos />,
          },
          {
            path: "/configuracoes",
            element: <Configuracoes />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role="collaborator" />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/colaborador", element: <CollaboratorDashboard /> },
          { path: "/colaborador/agendamentos", element: <CollaboratorAppointments /> },
          { path: "/colaborador/agenda", element: <CollaboratorSchedule /> },
          { path: "/colaborador/servicos", element: <CollaboratorServices /> },
        ],
      },
    ],
  },
]);
