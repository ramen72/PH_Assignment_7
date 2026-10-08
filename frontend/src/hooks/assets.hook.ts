import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type AssetFilterParams,
  createAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
} from "@/api";
import type { CreateAssetPayload, UpdateAssetPayload } from "@/types";

export const useGetAllAssets = (
  params?: AssetFilterParams,
) => {
  return useQuery({
    queryKey: ["assets", params],

    queryFn: () => getAllAssets(params),

    placeholderData: (previousData) => previousData,
  });
};

// Get single asset
export const useGetAssetById = (assetId?: string) => {
  return useQuery({
    queryKey: ["asset", assetId],

    queryFn: () => getAssetById(assetId as string),

    enabled: Boolean(assetId),
  });
};

// UPDATE ASSET
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assetId,
      payload,
    }: {
      assetId: string;
      payload: UpdateAssetPayload;
    }) => updateAsset(assetId, payload),

    onSuccess: (_, variables) => {
    // Single asset
    queryClient.invalidateQueries({
        queryKey: ["asset", variables.assetId],
    });

    // Asset list
    queryClient.invalidateQueries({
        queryKey: ["assets"],
    });

    // Asset purchase list
    queryClient.invalidateQueries({
        queryKey: ["assets-purchase"],
    });
},
  });
};

// DELETE ASSET
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assetId: string) => deleteAsset(assetId),

    onSuccess: () => {
      // Refresh all asset queries
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
      
      // Refresh all asset queries
      queryClient.invalidateQueries({
        queryKey: ["assets-purchase"],
      });
    },
  });
};

// CREATE ASSET
export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssetPayload) =>
      createAsset(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets"],
      });
    },
  });
};