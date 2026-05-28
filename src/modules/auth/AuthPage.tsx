import { useEffect, useRef} from "react";
import { DynamicFormSection } from "../../components/dynamic/DynamicFormSection";
import type { FieldConfig, GlobalFormRef } from "../../type/DinamFormField";
import "./AuthPage.css";
import { useAuthLogin } from "../../hooks/useAuthLogin";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { appBlackButtonSx } from "../entries/components/muiButtonStyles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import type { RootState } from "../../store";
import { loginSuccess } from "../../store/auth/authSlice";
import { useNotifications } from "../../context/NotificationsContext";

interface Auth {
  username: string;
  password: string;
}

const resolvePostLoginRoute = (routes: string[] | undefined): string => {
  
  const firstRoute = routes?.find((route) => typeof route === "string" && route.trim().length > 0);

  if (!firstRoute) {
    return "/unauthorized";
  }

  return firstRoute.startsWith("/") ? firstRoute : `/${firstRoute}`;
};

const authFormUI: FieldConfig<Auth>[] = [
  {
    key: "username",
    label: "Nombre",
    type: "text",
    placeholder: "Nombre de usuario",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
  },
  {
    key: "password",
    label: "Contraseña",
    type: "password",
    placeholder: "Contraseña",
    grid: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
  },
];

export function AuthPage() {

  const formRef = useRef<GlobalFormRef<Auth>>(null);
  const dispath = useAppDispatch();
  const { notify } = useNotifications();
  const { login, isLoading } = useAuthLogin();
  const navigate = useNavigate();
  const auth = useAppSelector((e: RootState) => e.auth);

  useEffect(() => {
    if (auth.token) {
      navigate(resolvePostLoginRoute(auth.routes), { replace: true });
    }
  }, [auth.token, auth.routes, navigate]);

  const handleSubmit = async () => {

    if (!formRef.current) return;

    const values = formRef.current.getValues();

    const data = await login({
      username: values.username,
      password: values.password,
    });

    if (data.typeAccount === "WEB" || data.typeAccount === "BOTH") {
      dispath(loginSuccess(data));
      navigate(resolvePostLoginRoute(data.routes), { replace: true });
    } else {
      notify("No tienes una cuenta con acceso ala web", "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Almacén JPJ</h2>
        <p className="auth-subtitle">Acceso al sistema</p>

        <DynamicFormSection<Auth>
          ref={formRef}
          fields={authFormUI}
          onSubmit={handleSubmit}
        />

        <Button
          onClick={() => {
            formRef.current?.submit();
          }}
          disabled={isLoading}
          sx={{
            ...appBlackButtonSx,
            width: "100%",
            color: "#ffffff",
          }}
          type="submit"
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
}

export default AuthPage;

