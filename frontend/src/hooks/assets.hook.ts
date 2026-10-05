// import { useQuery } from "@tanstack/react-query";
// import { type AssetFilterParams, getAllAssets } from "@/api";

// export const useGetAllAssets = (params?: AssetFilterParams) => {
  
//   return useQuery({
//     queryKey: ["assets", params],
//     queryFn: () => getAllAssets(params),
//   });
// };

import { useQuery } from "@tanstack/react-query";

import {
  type AssetFilterParams,
  getAllAssets,
  getAssetById,
} from "@/api";

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