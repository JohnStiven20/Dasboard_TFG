import axios from "axios";
import { store } from "../store";
import { logout, setToken } from "../store/auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({
       baseURL: API_URL,
       timeout: 100000,
       withCredentials: false
})


http.interceptors.request.use((config) => {
       const token = store.getState().auth.token;
       if (token) {

              config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
})


http.interceptors.response.use(
       (response) => {
              const newToken = response.headers["x-new-token"];

              if (newToken) {
                     store.dispatch(setToken(newToken));
              }

              return response;
       },
       (error) => {

              if (error.response?.status === 401) {
                     store.dispatch(logout());

                     window.location.href = "/login";
              }

              return Promise.reject(error);
       }
);