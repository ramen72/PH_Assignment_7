import { useQuery } from "@tanstack/react-query";

import { AssetFilterParams, getAllAssets } from "@/api";
// import type { AssetFilterParams } from "@/api/assets";

export const useGetAllAssets = (params?: AssetFilterParams) => {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAllAssets(params),
  });
};