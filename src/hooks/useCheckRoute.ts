import { useQuery } from "@tanstack/react-query";
import { checkRouteAccess } from "../modules/auth/service/auth.service";
import type { RootState } from "../store";
import { useSelector } from "react-redux";


export const useCheckRoute = (path: string) => {
    
    const token = useSelector((state: RootState) => state.auth.token);
    
    return useQuery({
        queryKey: ["check-route", path],
        queryFn: () => checkRouteAccess(path),
        enabled: !!token,
        retry: false,
    });
};