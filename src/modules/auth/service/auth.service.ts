import { http } from "../../../api/http"
import type { ResquestLogin } from "../../../interface/login/RequestLogin";
import type { AuthState } from "../../../type/auth.types";


export const authLogin = async (login: ResquestLogin): Promise<AuthState> => {
    const { data } = await http.post<AuthState>("api/auth/login", {
        username: login.username,
        password: login.password
    });

    return data;
}

export const checkRouteAccess = async (path: string): Promise<boolean> => {
    const { data } = await http.get<boolean>("/api/auth/check-route", {
        params: { path },
    });
    return data;
};

