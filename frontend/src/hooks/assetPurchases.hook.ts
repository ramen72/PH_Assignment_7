import { createAssetPurchase, deleteAssetPurchaseById, getAllAssetPurchases, getSingleAssetPurchaseById } from "@/api";
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
      queryClient.invalidateQueries({
        queryKey: ["payment"],
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

// Get single asset
export const useGetSingleAssetPurchaseById = (assetPurchaseId?: string) => {
  return useQuery({
    queryKey: ["asset-purchase", assetPurchaseId],

    queryFn: () => getSingleAssetPurchaseById(assetPurchaseId as string),

    enabled: Boolean(assetPurchaseId),
  });
};

// Delete Single asset purchase
export const useDeleteAssetPurchaseById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetPurchaseId: string) => deleteAssetPurchaseById(assetPurchaseId),

    onSuccess: () => {
      // Refresh all asset queries
      queryClient.invalidateQueries({
        queryKey: ["assets-purchase"],
      });
      
      // Refresh all asset queries
      queryClient.invalidateQueries({
        queryKey: ["asset-purchase"],
      });
    },
  });
};