import { configureStore } from "@reduxjs/toolkit";
import type { Dispatch, MiddlewareAPI } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import authSlice, { loginSuccess, logout, setToken } from "./auth/authSlice";
import pendingProductItemsSlice from "./entries/pendingProductItemsSlice";
import pendingProductGenericsSlice from "./entries/pendingProductGenericsSlice";

export const AUTH_LOGOUT_SYNC_KEY = "auth:logout-sync";
export const AUTH_LOGIN_SYNC_KEY = "auth:login-sync";

const authPersistConfig = {
    key: "auth",
    storage,
};

const pendingProductItemsPersistConfig  = {
    key: "pendingProductItems",
    storage,
};


const pendingProductGenericsPersistConfig = {
    key: "pendingProductGenerics",
    storage
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);
const persistedPendingProductItemsReducer  = persistReducer(pendingProductItemsPersistConfig , pendingProductItemsSlice.reducer);
const persistedPedingProductGenericsReducer = persistReducer(pendingProductGenericsPersistConfig , pendingProductGenericsSlice.reducer)

type MiddlewareState = {
    auth: {
        token: string | null;
    };
};

const hasType = (action: unknown): action is { type: string } =>
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof (action as { type?: unknown }).type === "string";

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        pendingProductItems: persistedPendingProductItemsReducer,
        pendingProductGenerics: persistedPedingProductGenericsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat((api: MiddlewareAPI<Dispatch, MiddlewareState>) => (next: (action: unknown) => unknown) => (action: unknown) => {
                const hadTokenBefore = Boolean(api.getState().auth.token);
                const result = next(action);
                const hasTokenAfter = Boolean(api.getState().auth.token);

                if (hasType(action) && action.type === logout.type && hadTokenBefore) {
                    localStorage.setItem(AUTH_LOGOUT_SYNC_KEY, String(Date.now()));
                }

                const actionType = hasType(action) ? action.type : undefined;
                const isLoginAction =
                    actionType === loginSuccess.type || actionType === setToken.type;

                if (isLoginAction && !hadTokenBefore && hasTokenAfter) {
                    localStorage.setItem(AUTH_LOGIN_SYNC_KEY, String(Date.now()));
                }

                return result;
            })
            .concat(() => (next: (action: unknown) => unknown) => (action: unknown) => {
                if (hasType(action) && action.type === REHYDRATE) {};
                return next(action);
            }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
