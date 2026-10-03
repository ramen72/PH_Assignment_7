import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMe,
  googleOAuth,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";

export const useRegistration = () => {
  return useMutation({
    mutationFn: userRegistration,
  });
};

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
  });
};

export const useGoogleOAuth = () => {
  return useMutation({
    mutationFn: googleOAuth,
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
};
