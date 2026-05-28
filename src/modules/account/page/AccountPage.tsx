import {
  Alert,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobalFormRef } from "../../../type/DinamFormField";
import TableSystemGrid, { type MenuContext } from "../../../components/table/TableSystem";
// import { ConfirmDeleteDialog } from "../../../components/dialog/ConfirmDeleteDialog";
import { useNotifications } from "../../../context/NotificationsContext";
import { appBlackButtonSx } from "../../entries/components/muiButtonStyles";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Card from "../../entries/components/Card";
import { DialogAccount } from "../components/DailogAccount";
import { AccountPermissionItem } from "../components/AccountPermissionItem";
import { useAccount } from "../hook/useAccount";
import { useAccountPermission } from "../hook/useAccountPermission";
import { usePermissionsQuery } from "../../permisses/hooks/usePermissions";
import {
  accountCreateFormUI,
  accountEditFormUI,
  accountViewFormUI,
  accountTableUI,
  type AccountPermsion,
} from "../ui/accountForm.ui";
import "../style/AccountPage.css";
import type { Account } from "../interface/account";



const buildPermissionDraft = (rows: AccountPermsion[]): Record<number, boolean> => {
  return rows.reduce<Record<number, boolean>>((draft, row) => {
    draft[row.id] = row.isActive;
    return draft;
  }, {});
};

const hasSamePermissionDraft = (
  current: Record<number, boolean>,
  next: Record<number, boolean>,
): boolean => {
  const currentKeys = Object.keys(current);
  const nextKeys = Object.keys(next);
  if (currentKeys.length !== nextKeys.length) return false;
  return nextKeys.every((key) => current[Number(key)] === next[Number(key)]);
};

export default function AccounPage() {

  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  // const [removeAccount, setRemoveAccount] = useState<boolean>(false);

  const [selectedAccountId, setSelectedAccountId] = useState<number>();
  const [editAccount, seteditAccount] = useState<Account | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<Record<number, boolean>>({});
  const [isApplyingPermissions, setIsApplyingPermissions] = useState(false);

  const accountRef = useRef<GlobalFormRef<Account> | null>(null);

  const { notify } = useNotifications();

  const { items, creating, isLoading, create, update, updating} = useAccount();

  const {
    assignPermission,
    items: assignedPermissions,
    removePermission,
    isAssigning,
    isRemoving,
  } = useAccountPermission(selectedAccountId);

  const { itemPermissionAccount: allPermissions } = usePermissionsQuery();

  const selectedAccount = useMemo(
    () => items.find((account) => account.id === selectedAccountId),
    [items, selectedAccountId],
  );

  const permissionRows = useMemo<AccountPermsion[]>(() => {
    const assignedIds = new Set(assignedPermissions.map((permission) => Number(permission.id)));
    return allPermissions.map((permission) => ({
      id: Number(permission.id),
      permission: permission.permission,
      isActive: assignedIds.has(Number(permission.id)),
    }));
  }, [allPermissions, assignedPermissions]);

  const sortedPermissionRows = useMemo(
    () =>
      [...permissionRows].sort((a, b) =>
        a.permission.localeCompare(b.permission, "es", { sensitivity: "base" }),
      ),
    [permissionRows],
  );

  useEffect(() => {
    setPermissionDraft((prev) => {
      const nextDraft = buildPermissionDraft(sortedPermissionRows);
      return hasSamePermissionDraft(prev, nextDraft) ? prev : nextDraft;
    });
  }, [sortedPermissionRows]);

  const pendingPermissionChanges = useMemo(
    () =>
      sortedPermissionRows.filter(
        (permission) =>
          (permissionDraft[permission.id] ?? permission.isActive) !== permission.isActive,
      ),
    [permissionDraft, sortedPermissionRows],
  );

  const formatPermissionLabel = (permission: string): string => {
    return permission
      .replace(/[_-]+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleAddAccount = async () => {

    const account = accountRef.current?.getValues();

    if (!account) return;

    const username = account.username?.trim();
    const password = account.password?.trim();
    const typeAccount = account.typeAccount?.trim().toUpperCase();

    if (!username) {
      notify("El campo usuario es obligatorio", "warning");
      return;
    }

    if (!password) {
      notify("El campo contraseña es obligatorio", "warning");
      return;
    }

    if (password.length < 6) {
      notify("La contraseña debe tener al menos 6 caracteres", "warning");
      return;
    }

    if (!account.subject?.id) {
      notify("El campo empleado es obligatorio", "warning");
      return;
    }

    if (!typeAccount || !["WEB", "BOTH", "MOBILE"].includes(typeAccount)) {
      notify("Debes seleccionar un tipo de cuenta valido", "warning");
      return;
    }

    const normalizedAccount: Account = {
      ...account,
      username,
      password,
      typeAccount,
    };

    await create(normalizedAccount);
    setAdd(false);
    accountRef.current?.reset();

    notify("Cuenta creada correctamente", "success");
  };

  const handleUpdateAccount = async () => {

    const accountEdit = accountRef.current?.getValues();
    const accountid = editAccount?.id;

    if (!accountEdit || !accountid) return;

    if(accountEdit.typeAccount === " ") {
      notify("El campo tipo de cuenta es obligatorio", "warning");
      return;
    }

    await update({ id: accountid as number, account: accountEdit as Account });

    setEdit(false);
    accountRef.current?.reset();
    notify("Cuenta actualizada correctamente", "success");
  };

  const handleApplyPermissionChanges = async () => {

    if (!selectedAccountId) {
      notify("Selecciona una cuenta para actualizar permisos", "warning");
      return;
    }

    if (pendingPermissionChanges.length === 0) {
      notify("No hay cambios pendientes. Los permisos ya estan como los marcaste.", "warning");
      return;
    }

    let successCount = 0;
    let failedCount = 0;

    setIsApplyingPermissions(true);

    try {
      for (const permission of pendingPermissionChanges) {
        const nextValue = permissionDraft[permission.id] ?? permission.isActive;
        try {
          if (nextValue) {
            await assignPermission({
              accountid: selectedAccountId,
              permissionid: permission.id,
            });
          } else {
            await removePermission({
              accountid: selectedAccountId,
              permissionid: permission.id,
            });
          }
          successCount += 1;
        } catch {
          failedCount += 1;
        }
      }

      if (successCount > 0 && failedCount === 0) {
        notify("Permisos actualizados correctamente", "success");
        return;
      }

      if (successCount > 0 && failedCount > 0) {
        notify(
          `Se aplicaron ${successCount} cambios y ${failedCount} fallaron`,
          "warning",
        );
        return;
      }

      notify("No se pudo actualizar ningun permiso", "error");
    } finally {
      setIsApplyingPermissions(false);
    }
  };

  return (
    <div className="account-container">
      <Box className="account-grid">
        <div className="account-header">
          <article className="account-title-article">
            <h1>Cuentas</h1>
            <p>Administra usuarios y permisos de forma centralizada.</p>
          </article>

          <Button
            size="small"
            variant="contained"
            startIcon={<AddBoxOutlinedIcon />}
            color="primary"
            type="button"
            sx={{
              ...appBlackButtonSx,
              minWidth: 170,
            }}
            onClick={() => setAdd(true)}
          >
            Agregar cuenta
          </Button>
        </div>
        <Box className="account-table">
          <Card
            title="Listado de cuentas"
            subtitle="Haz doble clic en una fila para seleccionar la cuenta y gestionar permisos abajo. Usa clic derecho para acciones."
            className="account-card"
          >
            <TableSystemGrid<Account>
              onRowClick={(row) => {
                const rowId = Number(row.id);
                if (Number.isNaN(rowId)) return;
                setSelectedAccountId(rowId);
              }}
              onRowDoubleClick={(row) => {
                const rowId = Number(row.id);
                if (Number.isNaN(rowId)) return;
                setSelectedAccountId(rowId);
              }}
              onMenu={(contextMenu: MenuContext<Account> | null) => {
                return (
                  <>
                    <Menu
                      open={Boolean(contextMenu)}
                      onClose={contextMenu?.close}
                      anchorReference="anchorPosition"
                      anchorPosition={{
                        top: contextMenu?.mouseY ?? 0,
                        left: contextMenu?.mouseX ?? 0,
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          const account = contextMenu?.row;
                          if (!account) return;
                          seteditAccount(account);
                          setView(true);
                          contextMenu?.close();
                        }}
                      >
                        Ver detalle
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          const account = contextMenu?.row;
                          if (!account) return;
                          seteditAccount(account);
                          setEdit(true);
                          contextMenu?.close();
                        }}
                      >
                        Editar
                      </MenuItem>
                    </Menu>
                  </>
                );
              }}
              rows={items}
              loading={isLoading}
              formconfig={accountTableUI}
            />
          </Card>
          <Card
            title="Permisos de la cuenta"
            subtitle={selectedAccountId
              ? `Marca switches y pulsa "Asignar permisos" para confirmar cambios en ${selectedAccount?.username}.`
              : "Selecciona una cuenta en la tabla superior para empezar."
            }
            className="account-card"
          >
            <Box className="account-permissions-panel">
              <Box className="account-permissions-actions">
                <Typography variant="subtitle2" >
                  Cambia switches libremente. No se guarda nada hasta pulsar el boton.
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  type="button"
                  sx={{
                    ...appBlackButtonSx,
                    minWidth: 170,
                    whiteSpace: "nowrap",
                  }}
                  disabled={
                    !selectedAccountId ||
                    pendingPermissionChanges.length === 0 ||
                    isAssigning ||
                    isRemoving ||
                    isApplyingPermissions
                  }
                  onClick={handleApplyPermissionChanges}
                >
                  Asignar permisos
                </Button>
              </Box>

              {!selectedAccountId ? (
                <Alert severity="info" variant="outlined" sx={{ borderRadius: 2, display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  No hay cuenta seleccionada.
                </Alert>
              ) : sortedPermissionRows.length === 0 ? (
                <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
                  No hay permisos disponibles para asignar.
                </Alert>
              ) : (
                <Box className="account-permissions-list">
                  {sortedPermissionRows.map((permission) => (
                    <AccountPermissionItem
                      key={permission.id}
                      permission={permission}
                      checked={permissionDraft[permission.id] ?? permission.isActive}
                      disabled={isApplyingPermissions}
                      formatLabel={formatPermissionLabel}
                      onChange={(checked) => {
                        setPermissionDraft((prev) => ({
                          ...prev,
                          [permission.id]: checked,
                        }));
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Card>
        </Box>

        <DialogAccount
          isPedding={creating}
          ref={accountRef}
          open={add}
          setOpen={setAdd}
          onclick={handleAddAccount}
          fields={accountCreateFormUI}
          mode="create"
        />

        <DialogAccount
          isPedding={updating}
          ref={accountRef}
          open={edit}
          editAccount={editAccount ?? undefined}
          setOpen={setEdit}
          onclick={handleUpdateAccount}
          fields={accountEditFormUI}
          mode="edit"
        />

        <DialogAccount
          ref={accountRef}
          open={view}
          editAccount={editAccount ?? undefined}
          setOpen={setView}
          onclick={() => setView(false)}
          fields={accountViewFormUI}
          mode="view"
        />
      </Box>
    </div>
  );
}
