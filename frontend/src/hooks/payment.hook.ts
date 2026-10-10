import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBkashPayment, getSingleAssetPurchaseById, getSinglePaymentByAssetPurchaseId } from "@/api";

export const useCreateBkashPayment  = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchaseId: string) => createBkashPayment(purchaseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["asset-purchases"],
      });
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },
  });
};

// Get single asset
export const useGetSinglePaymentByAssetPurchaseId = (assetPurchaseId?: string) => {
  return useQuery({
    queryKey: ["payment", assetPurchaseId],

    queryFn: () => getSinglePaymentByAssetPurchaseId(assetPurchaseId as string),

    enabled: Boolean(assetPurchaseId),
  });
};