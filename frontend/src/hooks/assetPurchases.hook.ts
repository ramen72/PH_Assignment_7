import { createAssetPurchase, getAllAssetPurchases } from "@/api";
import type { AssetPurchaseFilterParams, AssetPurchasePayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


// CREATE ASSET
export const useCreateAssetPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssetPurchasePayload) =>
      createAssetPurchase(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets-purchase"],
      });
    },
  });
};

export const useGetAllAssetPurchases = (
  params?: AssetPurchaseFilterParams,
) => {
  return useQuery({
    queryKey: ["assets-purchase", params],

    queryFn: () => getAllAssetPurchases(params),

    placeholderData: (previousData) => previousData,
  });
};