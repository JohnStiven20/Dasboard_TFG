import { useMutation } from "@tanstack/react-query";
import { authLogin } from "../modules/auth/service/auth.service";

export const useAuthLogin = () => {
    // const dispatch = useAppDispatch();


    const   loginMutation =    useMutation({
        mutationFn: authLogin,
        // onSuccess: (data) => {
        //     dispatch(loginSuccess(data));
        // },
    });

     return {
         login:loginMutation.mutateAsync , 
         isLoading:loginMutation.isPending
     }
};

