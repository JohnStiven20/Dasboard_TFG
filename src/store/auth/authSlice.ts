import { createSlice, type PayloadAction, } from "@reduxjs/toolkit";
import type { AuthState } from "../../type/auth.types";

const initialState: AuthState = {
    icon: "",
    token: null,
    tree: [],
    routes: [],
    id: 0,
    username: "",
    expiresAT: null,
    typeAccount: ""
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<AuthState>) {
            console.log(action.payload.tree);
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.tree = action.payload.tree;
            state.routes = action.payload.routes;
            state.username = action.payload.username;
            state.icon = action.payload.icon;
            state.expiresAT = Date.now() + 3 * 60 * 60 * 1000; 
            state.typeAccount = action.payload.typeAccount ?? "";

        },

        logout(state) {
            state.token = null;
            state.id = 0;
            state.username = "";
            state.icon = "";
            state.tree = [];
            state.routes = [];
            state.expiresAT = null;
            state.typeAccount = "";

        },

        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { loginSuccess, logout  , setToken } = authSlice.actions;
export default authSlice;
