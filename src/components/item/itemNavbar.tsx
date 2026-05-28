import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import "./item.css";

export interface NavbarItem {
  label: string;
  icon: string;
  to?: string;
  onClick?: () => void;
  children?: NavbarItem[];
}

type Props = {
  item: NavbarItem;
  forceClose?: boolean;
  level?: number;
  Navigation?: (item: NavbarItem) => void;
  isSidebarClosed?: boolean;
};

export function ItemNavbar({
  item,
  forceClose = false,
  level = 0,
  Navigation,
  isSidebarClosed = false,
}: Props) {

  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [submenuCoords, setSubmenuCoords] = useState<{ top: number; left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const submenuRef = useRef<HTMLUListElement>(null);
  const hasChildren = !!item.children?.length;

   // Determinar si este item está activo basado en la URL
  const isActive = useMemo(() => {
    // Si el item tiene un link directo y coincide con el path actual
    if (item.to && pathname === item.to) return true;

    // Si alguno de sus hijos está activo, el padre también debería estar resaltado? 
    // Opcional, pero por ahora buscaremos si el path exacto coincide en algún sub-item
    const checkChildren = (items: NavbarItem[]): boolean => {
      return items.some(child => {
        if (child.to && pathname === child.to) return true;
        if (child.children) return checkChildren(child.children);
        return false;
      });
    };

    if (item.children) return checkChildren(item.children);

    return false;
  }, [pathname, item.to, item.children]);
  

  useEffect(() => {
    if (forceClose) setOpen(false);
  }, [forceClose]);

  // Cerrar submenús cuando el sidebar se colapsa
  useEffect(() => {
    if (isSidebarClosed && hasChildren) {
      setOpen(false);
    }
  }, [isSidebarClosed, hasChildren]);

  // Solo detectar clics fuera cuando el sidebar está CERRADO (submenús flotantes)
  useEffect(() => {
    if (!hasChildren || !open || !isSidebarClosed) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInside =
        (popupRef.current && popupRef.current.contains(target)) ||
        (submenuRef.current && submenuRef.current.contains(target));

      if (!clickedInside) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, hasChildren, isSidebarClosed]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(prev => !prev);
      return;
    }

    if (item.onClick) {
      item.onClick();
    } else if (Navigation) {
      Navigation(item);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    if (isSidebarClosed) {
      const rect = e.currentTarget.getBoundingClientRect();
      setCoords({ top: rect.top, left: rect.right });
    }
  };

  useEffect(() => {
    if (open && hasChildren && isSidebarClosed && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setSubmenuCoords({ top: rect.top, left: rect.right });
    } else {
      setSubmenuCoords(null);
    }
  }, [open, hasChildren, isSidebarClosed]);

  return (
    <div className="item-relative-container" ref={popupRef}>
      <li
        ref={itemRef}
        className={isActive ? "item-navbar active" : "item-navbar"}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setCoords(null)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      >
        <div className="item-container">
          <i className={`${item.icon} icon`} aria-hidden="true" />
          <span className="text nav-text">{item.label}</span>

          {isSidebarClosed && coords && !open && createPortal(
            <div
              style={{
                position: "fixed",
                top: coords.top + 10,
                left: coords.left + 10,
                background: "var(--sidebar-color)",
                color: "var(--text-color)",
                padding: "6px 12px",
                borderRadius: "5px",
                boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
                zIndex: 99999,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                fontSize: "16px"
              }}
            >
              {item.label}
            </div>,
            document.body
          )}
        </div>

        {hasChildren && (
          <i className={`bx bx-chevron-down arrow-bottom ${open ? "rotate" : ""}`} />
        )}
      </li>

      {/* Submenú Normal (Sidebar Abierto) */}
      {hasChildren && !isSidebarClosed && (
        <ul className={`children ${open ? "open" : ""} ${level === 1 ? "first-level" : ""}`}>
          {item.children!.map((child, idx) => (
            <ItemNavbar
              key={`${child.label}-${idx}`}
              item={child}
              forceClose={!open}
              level={level + 1}
              Navigation={Navigation}
              isSidebarClosed={false}
            />
          ))}
        </ul>
      )}

      {/* Submenú Flotante con Portal (Sidebar Cerrado) */}
      {hasChildren && isSidebarClosed && open && submenuCoords && createPortal(
        <ul
          ref={submenuRef}
          className="children-floating"
          style={{
            position: "fixed",
            top: submenuCoords.top,
            left: submenuCoords.left + 40,
            background: "var(--sidebar-color)",
            borderRadius: "8px",
            zIndex: 99999,
            padding: "8px",
            minWidth: "180px",
            listStyle: "none",
            margin: 0
          }}
        >
          {item.children!.map((child, idx) => (
            <ItemNavbar
              key={`${child.label}-${idx}`}
              item={child}
              forceClose={!open}
              level={level + 1}
              Navigation={Navigation}
              isSidebarClosed={false}
            />
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}
