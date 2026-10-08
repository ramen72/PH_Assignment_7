import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBkashPayment } from "@/api";

export const useCreateBkashPayment  = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchaseId: string) =>
      createBkashPayment(purchaseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },
  });
};
