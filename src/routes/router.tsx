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

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
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
]);
