import { Box, Button, Paper, Typography } from "@mui/material";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

export default function RouterErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const routes = useAppSelector((state) => state.auth.routes);

  const firstAllowedRoute = routes.find(
    (route) => typeof route === "string" && route.trim().length > 0,
  );
  const fallbackPath = firstAllowedRoute
    ? firstAllowedRoute.startsWith("/")
      ? firstAllowedRoute
      : `/${firstAllowedRoute}`
    : token
      ? "/unauthorized"
      : "/login";

  let title = "Ha ocurrido un error";
  let description = "No se pudo cargar la pagina solicitada.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "404 - Pagina no encontrada";
      description = "La ruta que intentas abrir no existe o ya no esta disponible.";
    } else {
      title = `${error.status} - ${error.statusText}`;
      description = "Se produjo un error al resolver la ruta.";
    }
  }

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
          maxWidth: 560,
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(fallbackPath, { replace: true })}
        >
          Ir al inicio
        </Button>
      </Paper>
    </Box>
  );
}
