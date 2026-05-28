import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");

import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router/router.tsx";
import { ScannerProvider } from "./context/ScannerContext.tsx";
import { NotificationsProvider } from "./context/NotificationsContext.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { store, persistor } from "./store";
import { AUTH_LOGIN_SYNC_KEY, AUTH_LOGOUT_SYNC_KEY } from "./store";
import { logout } from "./store/auth/authSlice";
import { PersistGate } from "redux-persist/integration/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { GlobalErrorProvider } from "./context/GlobalErrorProvider.tsx";
import { queryClient } from "./queryClient.ts";

window.addEventListener("storage", (event) => {

  if (event.key === AUTH_LOGOUT_SYNC_KEY) {
    
    if (!store.getState().auth.token) return;

    store.dispatch(logout());
    window.location.href = "/login";
    return;
  }

  if (event.key === AUTH_LOGIN_SYNC_KEY) {
    if (store.getState().auth.token) return;

    window.location.reload();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="es" >
          <NotificationsProvider>
            <PersistGate loading={null} persistor={persistor}>
              <GlobalErrorProvider>
                <ScannerProvider>
                  <RouterProvider router={router} />
                </ScannerProvider>
              </GlobalErrorProvider>
            </PersistGate>
          </NotificationsProvider>
        </LocalizationProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
