import { useEffect, type PropsWithChildren } from "react";
import { useGlobalError } from "../hooks/useGlobalerror";
import { setGlobalErrorHandler } from "../queryClient";

export const GlobalErrorProvider = ({ children }: PropsWithChildren) => {
  
  const { handleError } = useGlobalError();

  useEffect(() => {
    setGlobalErrorHandler((err) => {
      handleError(err);
    });
  }, [handleError]);

  return <>{children}</>;
};
