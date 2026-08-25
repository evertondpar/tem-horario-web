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
import ClientLayout from "../components/client/ClientLayout";
import ClientHome from "../pages/client/ClientHome";
import ClientAuth from "../pages/client/ClientAuth";
import BookingPage from "../pages/client/BookingPage";
import ClientAppointments from "../pages/client/ClientAppointments";
import EstablishmentSignup from "../pages/onboarding/EstablishmentSignup";
import EstablishmentOnboarding from "../pages/onboarding/EstablishmentOnboarding";

export const router = createBrowserRouter([
  {
    element: <ClientLayout />,
    children: [
      { path: "/", element: <ClientHome /> },
      { path: "/estabelecimentos/:id/agendar", element: <BookingPage /> },
    ],
  },
  { path: "/entrar", element: <ClientAuth /> },
  { path: "/cadastro", element: <ClientAuth /> },
  { path: "/cadastro-estabelecimento", element: <EstablishmentSignup /> },
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
      { path: "/onboarding", element: <EstablishmentOnboarding /> },
      {
        element: <AppShell />,
        children: [
          {
            path: "/painel",
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
    element: <ProtectedRoute role="client" />,
    children: [
      {
        element: <ClientLayout />,
        children: [
          { path: "/meus-agendamentos", element: <ClientAppointments /> },
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
