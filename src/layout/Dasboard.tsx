import { useEffect, useState } from "react";
import "./Dasboard.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  Stack,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { MenuItemTree } from "../type/auth.types";
import { useCheckRoute } from "../hooks/useCheckRoute";
import { logout } from "../store/auth/authSlice";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonIcon from "@mui/icons-material/Person";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { ItemNavbar, type NavbarItem } from "../components/item/itemNavbar";
import logoJPJ from "../assets/icon-jpj-4.png";

const DEFAULT_MENU_ICON = "bx bx-grid-alt";

const MENU_ICON_BY_ROUTE: Record<string, string> = {
  "": "bx bx-home-alt",
  entries: "bx bx-log-in-circle",
  out: "bx bx-log-out-circle",
  assigment: "bx bx-task",
  returns: "bx bx-repeat",
  history: "bx bx-history",
  permisses: "bx bx-shield-quarter",
  account: "bx bx-user-check",
  tool: "bx bx-spanner",
  product_model: "bx bx-cube-alt",
  worker: "bx bx-group",
  inventory: "bx bx-archive",
  profile: "bx bx-id-card",
};

const MENU_ICON_BY_LABEL: Array<[string, string]> = [
  ["entrada", "bx bx-log-in-circle"],
  ["salida", "bx bx-log-out-circle"],
  ["asign", "bx bx-clipboard-check"],
  ["retorn", "bx bx-redo-alt"],
  ["hist", "bx bx-history"],
  ["permis", "bx bx-shield-quarter"],
  ["cuenta", "bx bx-user-check"],
  ["herr", "bx bx-spanner"],
  ["modelo", "bx bx-cube-alt"],
  ["trabaj", "bx bx-group"],
  ["invent", "bx bx-archive"],
  ["perfil", "bx bx-id-card"],
];

const normalizeRoute = (route: string | null | undefined): string =>
  String(route ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

const normalizeLabel = (label: string | null | undefined): string =>
  String(label ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const resolveMenuIcon = (item: MenuItemTree): string => {
  const routeKey = normalizeRoute(item.route);
  const iconByRoute = MENU_ICON_BY_ROUTE[routeKey];

  if (iconByRoute) {
    return iconByRoute;
  }

  const labelKey = normalizeLabel(item.label);
  const iconByLabel = MENU_ICON_BY_LABEL.find(([token]) =>
    labelKey.includes(token),
  );

  if (iconByLabel) {
    return iconByLabel[1];
  }

  return item.icon?.trim() || DEFAULT_MENU_ICON;
};

export function mapMenuTreeToNavbar(items: MenuItemTree[]): NavbarItem[] {

  return items.map((item) => ({
    label: item.label,
    icon: resolveMenuIcon(item),
    to: item.route,
    children: item.children ? mapMenuTreeToNavbar(item.children) : undefined,
  }));
}

export function Layout() {
  
  const menuTree = useAppSelector((state) => state.auth.tree);

  const menuItems: NavbarItem[] = mapMenuTreeToNavbar(menuTree);
  const isMenuLoading = menuTree.length === 0;

  const dispaht = useAppDispatch();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: isRouteChecking } = useCheckRoute(location.pathname);

  const Navigation = (item: NavbarItem) => {
    if (item.to) navigate(item.to);
  };

  const confirmLogout = () => {
    dispaht(logout());
    navigate("/login");
  };

  const [close, setclose] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarState");
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false,
  );

  useEffect(() => {
    localStorage.setItem("sidebarState", JSON.stringify(close));
  }, [close]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const onChange = () => setIsMobileViewport(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isMobileViewport) return;
    document.body.style.overflow = isMobileSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileViewport, isMobileSidebarOpen]);

  return (
    <Stack>
      {!isMobileSidebarOpen && (
        <IconButton
          aria-label="Abrir menu lateral"
          className="mobile-sidebar-trigger"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <MenuRoundedIcon />
        </IconButton>
      )}

      {isMobileSidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menu lateral"
          className="sidebar-mobile-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <nav
        style={{
          borderRight: "1px solid #e0e0e0",
        }}
        className={`sidebar ${!isMobileViewport && close ? "close" : ""} ${isMobileSidebarOpen ? "mobile-open" : ""}`}
      >
        <header>
          <div className="logo-title">
            <div className="logo-container">
              <img src={logoJPJ} alt="Logo JPJ" />
            </div>
            <div className="title-container">
              <p
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                Almacen JPJ
              </p>
            </div>
          </div>
          <i
            className="bx bx-chevron-right toggle"
            onClick={() => {
              setclose((prev) => !prev);
            }}
          ></i>
        </header>

        <div className="menu-items">
          <ul className="menu-links">
            {isMenuLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <li key={index} className="menu-skeleton-item">
                  <span className="menu-skeleton-icon" />
                  <span className="menu-skeleton-text" />
                </li>
              ))
            ) : (
              menuItems.map((item, index) => (
                <ItemNavbar
                  key={index}
                  item={item}
                  level={1}
                  Navigation={Navigation}
                  isSidebarClosed={isMobileViewport ? false : close}
                />
              ))
            )}
          </ul>
        </div>
      </nav>

      <div className="home">
        {isRouteChecking ? (
          <div className="home-loader">
            <div className="home-loader-title" />
            <div className="home-loader-card" />
            <div className="home-loader-card" />
            <div className="home-loader-action" />
          </div>
        ) : (
          <Outlet></Outlet>
        )}
      </div>

      <SpeedDial
        ariaLabel="Menu rapido"
        icon={<AppsRoundedIcon />}
        style={{
          position: "fixed",
          right: "16px",
          top: "16px",
          bottom: "auto",
          left: "auto",
        }}
        sx={{
          zIndex: 2000,
          "& .MuiFab-primary": {
            backgroundColor: "#000000",
            color: "#ffffff",
          },
          "& .MuiFab-primary:hover": {
            backgroundColor: "#111111",
          },
        }}
        direction="down"
      >
        <SpeedDialAction
          icon={<PersonIcon />}
          tooltipTitle="Perfil"
          onClick={() => {
            navigate("/profile");
          }}
        />
        <SpeedDialAction
          icon={<LogoutRoundedIcon />}
          tooltipTitle="Salir"
          onClick={() => {
            setOpenLogoutDialog(true);
          }}
        />
      </SpeedDial>
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Cerrar sesion</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Seguro que quieres cerrar sesion? Tendras que volver a iniciar sesion para acceder al sistema.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancelar</Button>

          <Button color="error" variant="contained" onClick={confirmLogout}>
            Salir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
