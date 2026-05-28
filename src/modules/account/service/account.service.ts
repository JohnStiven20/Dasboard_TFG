import { http } from "../../../api/http"
import type { Account } from "../interface/account";



const BASE = "api/account";

export const createAccount = async (account: Account): Promise<void> => {
    
    await http.post<Account>(BASE, {
        username: account.username,
        password: account.password,
        subjectid: account?.subject?.id,
        typeAccount: account.typeAccount,
        isactive: account.isactive,
    });

}


export const updateAccountPartial = async (accountid: number, account: Partial<Account>): Promise<void> => {

    const payload: Record<string, unknown> = {
        typeAccount: account.typeAccount ?? "WEB",
        isactive: account.isactive ?? true,
    };

    await http.put<void>(`${BASE}/account/${accountid}`, payload);

}


export const updateAccount = async (accountid: number, account: Account): Promise<Account> => {

    const payload: Record<string, unknown> = {
        typeAccount: account.typeAccount ?? "WEB",
        isactive: account.isactive ?? true,
    };

    const { data } = await http.put<Account>(`${BASE}/${accountid}`, payload);

    return data;
}


export const deleteAaccount = async (accountid: number) => {
    await http.delete(`${BASE}/${accountid}`);
}



export const geallAccount = async (): Promise<Account[]> => {
    const { data } = await http.get<Account[]>(`${BASE}`);
    const pp = data.map(e => {
        return {
            ...e,
            subjectName: e.subject?.name ?? null,
            subjectEmail: e.subject?.email ?? null,
            subjectPhone: e.subject?.phone ?? null,
            subjectEmployeeCode: e.subject?.employeeCode ?? null,
            subjectObservation: e.subject?.observation ?? null,
            subjectCreatedAt: e.subject?.createdAt ?? null,
            subjectUpdatedAt: e.subject?.updatedAt ?? null,
        }
    });

    return pp ?? [];
}


export const findByAccountid = async (accounid: number) => {
    const { data } = await http.get(`${BASE}/${accounid}`);
    return data;
}


