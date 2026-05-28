import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useCheckRoute } from "../hooks/useCheckRoute";
import { useAuthExpiryGuard } from "../hooks/useAuthExpiryGuard";

const KNOWN_PROTECTED_PATHS = new Set([
  "/",
  "/entries",
  "/out",
  "/assigment",
  "/returns",
  "/history",
  "/permisses",
  "/account",
  "/tool",
  "/product_model",
  "/worker",
  "/inventory",
  "/profile",
]);

const normalizePath = (path: string): string => {
  if (!path) return "/";
  const normalized = path.replace(/\/+$/, "");
  return normalized.length === 0 ? "/" : normalized;
};

export default function ProtectedRoute() {

  const location = useLocation();
  const normalizedPath = normalizePath(location.pathname);
  
  const token = useSelector((state: RootState) => state.auth.token);

  const {
    data: allowed,
    isLoading,
    isError,
  } = useCheckRoute(location.pathname);

  useAuthExpiryGuard();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!KNOWN_PROTECTED_PATHS.has(normalizedPath)) {
    return <Navigate to="/not-found" replace />;
  }

  if (!isLoading && (isError || allowed === false)) {
    return <Navigate to="/unauthorized" replace state={{ fromGuard: true }} />;
  }

  return <Outlet />;
}
