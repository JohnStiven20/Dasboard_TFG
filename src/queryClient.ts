import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

let globalErrorHandler: ((error: unknown) => void) | null = null;

export const setGlobalErrorHandler = (handler: (error: unknown) => void) => {
  globalErrorHandler = handler;
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      globalErrorHandler?.(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      globalErrorHandler?.(error);
    },
  }),
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

