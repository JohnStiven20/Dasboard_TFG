import { Box, Button, Typography, Paper } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/auth/authSlice";

export default function NoPermissionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const routes = useAppSelector((state) => state.auth.routes);

  const firstAllowedRoute = routes.find(
    (route) => typeof route === "string" && route.trim().length > 0,
  );
  const fallbackPath = firstAllowedRoute
    ? firstAllowedRoute.startsWith("/")
      ? firstAllowedRoute
      : `/${firstAllowedRoute}`
    : "/login";

  const isGuardRedirect = Boolean(
    (location.state as { fromGuard?: boolean } | null)?.fromGuard,
  );

  if (!isGuardRedirect) {
    return <Navigate to={token ? fallbackPath : "/login"} replace />;
  }

  const handleBackToLogin = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          No tienes permisos
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          No estas autorizado para acceder a esta seccion. Si crees que es un
          error, contacta con un administrador.
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleBackToLogin}>
            Cerrar sesion
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
