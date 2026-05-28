import { AxiosError } from "axios";
import { useNotifications } from "../context/NotificationsContext"


interface ApiError {
    message?: string;
    error?: string;
}
export const useGlobalError = () => {

    const { notify } = useNotifications();


    const handleError = (error: unknown) => {

        let message = "Ha ocurrido un error inesperado";
        
        if (error instanceof AxiosError) {
            const data = error.response?.data as ApiError;

            message = data?.message || data?.error || error.response?.statusText || "Error del Servidor";

            
        } else if (error instanceof Error) {
            message = error.message;
        }

        notify(message, "error");
    }

    return {
        handleError
    }

}