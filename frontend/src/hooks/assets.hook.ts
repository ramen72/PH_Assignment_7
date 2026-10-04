import { useQuery } from "@tanstack/react-query";
import { type AssetFilterParams, getAllAssets } from "@/api";

export const useGetAllAssets = (params?: AssetFilterParams) => {
  
  return useQuery({
    queryKey: ["assets", params],
    queryFn: () => getAllAssets(params),
  });
};