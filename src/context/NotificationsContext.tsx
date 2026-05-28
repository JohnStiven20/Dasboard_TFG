import { Alert, Fade, Portal, Snackbar } from "@mui/material";
import { createContext, useContext, useState, type ReactNode } from "react";

type NotificationSeverity = "info" | "warning" | "error" | "success";

type NotificationContextValue = {
  notify: (message: string, servity: NotificationSeverity) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const NotificationsContext = createContext<NotificationContextValue | undefined
>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [severity, setSeverity] = useState<NotificationSeverity>("info");

  const notify = (msg: string, sev: NotificationSeverity = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const success = (msg: string) => notify(msg, "success");
  const error = (msg: string) => notify(msg, "error");

  const value: NotificationContextValue = {
    notify,
    success,
    error,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <Portal>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          TransitionComponent={Fade}
          transitionDuration={{ enter: 120, exit: 100 }}
          sx={{
            top: 12,
          }}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={severity}
            variant="filled"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "min(560px, calc(100vw - 16px))",
              maxWidth: "100%",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Portal>
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotifications debe usarse dentro de NotificationsProvider"
    );
  }
  return ctx;
}
