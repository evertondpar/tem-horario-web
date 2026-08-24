import { Navigate, Outlet, useLocation } from "react-router-dom";
import { storage, type UserRole } from "../utils/storage";

export default function ProtectedRoute({ role }: { role?: UserRole }) {
  const token = storage.getToken();
  const session = storage.getSession();
  const location = useLocation();

  if (!token || !session) {
    return <Navigate to={role === "collaborator" ? "/login/colaborador" : "/login"} replace state={{ from: location }} />;
  }

  if (role && session.role !== role) {
    return <Navigate to={session.role === "collaborator" ? "/colaborador" : "/"} replace />;
  }

  return <Outlet />;
}
