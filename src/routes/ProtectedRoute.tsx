import { Navigate, Outlet } from "react-router-dom";
import { storage } from "../utils/storage";

export default function ProtectedRoute() {
  const token = storage.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
