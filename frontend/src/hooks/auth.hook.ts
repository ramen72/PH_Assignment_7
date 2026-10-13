import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  getMe,
  googleOAuth,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/utils";

export const useRegistration = () => {
  return useMutation({
    mutationFn: userRegistration,
    onError:(error)=>{
      toast.add({
        type:"error",
        title:"Login failed",
        description:getApiErrorMessage(
            error,
            "Unable to login. Please try again.",
          ),
      })
    }
  });
};

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount,
    onError:(error)=>{
      toast.add({
        type:"error",
        title:"Login failed",
        description:getApiErrorMessage(
            error,
            "Unable to login. Please try again.",
          ),
      })
    }
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
    onError:(error)=>{
      toast.add({
        type:"error",
        title:"Login failed",
        description:getApiErrorMessage(
            error,
            "Unable to login. Please try again.",
          ),
      })
    }
  });
};

export const useLogout = () => {
   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["user"],
      });
    },
    onError:(error)=>{
      toast.add({
        type:"error",
        title:"Login failed",
        description:getApiErrorMessage(
            error,
            "Unable to login. Please try again.",
          ),
      })
    }
  });
};

export const useGoogleOAuth = () => {
  return useMutation({
    mutationFn: googleOAuth,
    onError:(error)=>{
      toast.add({
        type:"error",
        title:"Login failed",
        description:getApiErrorMessage(
            error,
            "Unable to login. Please try again.",
          ),
      })
    }
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: false,
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
};
