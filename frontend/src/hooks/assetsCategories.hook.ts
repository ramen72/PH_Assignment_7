import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAssetCategory, deleteAssetCategory, getAllAssetCategories, getSingleAssetCategory, updateAssetCategory } from "@/api";
import type { AssetCategoryPayload } from "@/types";


export const assetCategoryKeys = {
  all: ["categories"] as const,
  detail: (id: string) => ["categories", id] as const,
};

// Get All Categories
// export const useGetAllAssetCategories = () => {
//   return useQuery({
//     queryKey: ["categories"],
//     queryFn: () => getAllAssetCategories()
//   });
// };


// Get all categories
export const useGetAllAssetCategories = () => {
  return useQuery({
    queryKey: assetCategoryKeys.all,
    queryFn: getAllAssetCategories,
  });
};

// Get single category
export const useGetSingleAssetCategory = (id: string) => {
  return useQuery({
    queryKey: assetCategoryKeys.detail(id),
    queryFn: () => getSingleAssetCategory(id),
    enabled: Boolean(id),
  });
};

// Create category
export const useCreateAssetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssetCategoryPayload) =>
      createAssetCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: assetCategoryKeys.all,
      });
    },
  });
};

// Update category
export const useUpdateAssetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AssetCategoryPayload>;
    }) => updateAssetCategory(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: assetCategoryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: assetCategoryKeys.detail(variables.id),
        }),
      ]);
    },
  });
};

// Delete category
export const useDeleteAssetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssetCategory,
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: assetCategoryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: assetCategoryKeys.detail(id),
        }),
      ]);
    },
  });
};
