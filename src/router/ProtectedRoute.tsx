import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function ProtectedRoute2() {
  
  const isAuthenticated = useAppSelector((state) => state.auth.token);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
