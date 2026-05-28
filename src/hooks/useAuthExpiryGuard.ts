import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks"; // ajusta la ruta
import { logout } from "../store/auth/authSlice"; // ajusta la ruta

export const useAuthExpiryGuard = () => {
    const dispatch = useAppDispatch();
    const { token, expiresAT } = useAppSelector((s) => s.auth);

    useEffect(() => {
        if (!token || !expiresAT) return;

        const msLeft = expiresAT - Date.now();

        if (msLeft <= 0) {
            dispatch(logout());
            return;
        }

        const t = window.setTimeout(() => {
            dispatch(logout());
        }, msLeft);

        return () => window.clearTimeout(t);
    }, [token, expiresAT, dispatch]);
};
