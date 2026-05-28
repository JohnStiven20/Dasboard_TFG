import { http } from "../../../api/http"
import type { AccountPermsion } from "../ui/accountForm.ui";

const BASE = "/api/account-permissions";

export const assignPermissionToAccount = async (
  permissionId: number,
  accountId: number
) => {
  const { data } = await http.post(`${BASE}/assign`, {
    permissionId,
    accountId,
  });

  return data;
};

export const getPermissionsByAccount = async (accountId: number):Promise<AccountPermsion[]> => {
  const { data } = await http.get<AccountPermsion[]>(`${BASE}/account/${accountId}`);
  return data;
};

export const removePermissionFromAccount = async (
  permissionId: number,
  accountId: number
) => {
  await http.delete(`${BASE}/remove`, {
    data: {
      permissionId,
      accountId
    }
  });
};
