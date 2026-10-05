// import { useQuery } from "@tanstack/react-query";
// import { type AssetFilterParams, getAllAssets } from "@/api";

// export const useGetAllAssets = (params?: AssetFilterParams) => {
  
//   return useQuery({
//     queryKey: ["assets", params],
//     queryFn: () => getAllAssets(params),
//   });
// };

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type AssetFilterParams,
  deleteAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
} from "@/api";
import { UpdateAssetPayload } from "@/types";

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
      // Single asset cache update/refetch
      queryClient.invalidateQueries({
        queryKey: ["asset", variables.assetId],
      });

      // Assets list refetch
      queryClient.invalidateQueries({
        queryKey: ["assets"],
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
    },
  });
};