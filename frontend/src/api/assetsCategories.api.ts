import apiClient from "@/lib/apiClient";

// Get single asset
export const getAllAssetCategories = () => {
  return apiClient(`/assetCategories`, {
    method: "GET",
  });
};