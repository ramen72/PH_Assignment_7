import { useQuery } from "@tanstack/react-query";
import { getAllAssetCategories } from "@/api";

// Get All Categories
export const useGetAllAssetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllAssetCategories()
  });
};