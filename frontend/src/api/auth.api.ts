import apiClient from "@/lib/apiClient";
import type {
  LoginPayload,
  RegistrationPayload,
  VerifyAccountPayload,
} from "@/types";

export const userRegistration = (payload: RegistrationPayload) => {
  return apiClient("/auth/register", { method: "POST", body: payload });
};

export const verifyAccount = (payload: VerifyAccountPayload) => {
  return apiClient("/auth/verifyEmail", { method: "POST", body: payload });
};

export const userLogin = (payload: LoginPayload) => {
  return apiClient("/auth/login", { method: "POST", body: payload });
};

export const getMe = () => {
  return apiClient("/auth/getMe", { method: "GET" });
};

export const userLogout = () => {
  return apiClient("/auth/logout", { method: "POST" });
};

export const googleOAuth = (payload: { idToken: string }) => {
  return apiClient("/auth/google", { method: "POST", body: payload });
};