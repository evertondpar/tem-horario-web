import { Navigate, Outlet, useLocation } from "react-router-dom";
import { storage, type UserRole } from "../utils/storage";

export default function ProtectedRoute({ role }: { role?: UserRole }) {
  const token = storage.getToken();
  const session = storage.getSession();
  const location = useLocation();

  if (!token || !session) {
    const loginPath = role === "collaborator" ? "/login/colaborador" : role === "client" ? "/entrar" : "/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (role && session.role !== role) {
    const homePath = session.role === "collaborator" ? "/colaborador" : session.role === "client" ? "/" : "/painel";
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
}
