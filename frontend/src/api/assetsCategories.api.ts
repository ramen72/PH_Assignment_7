import apiClient from "@/lib/apiClient";
import type { AssetCategoryPayload } from "@/types";


// Get all categories
export const getAllAssetCategories = () => {
  return apiClient("/assetCategories", {
    method: "GET",
  });
};

// Get single category
export const getSingleAssetCategory = (id: string) => {
  return apiClient(`/assetCategories/${id}`, {
    method: "GET",
  });
};

// Create category
export const createAssetCategory = (
  payload: AssetCategoryPayload,
) => {
  return apiClient("/assetCategories", {
    method: "POST",
    body: payload,
  });
};

// Update category
export const updateAssetCategory = (
  id: string,
  payload: Partial<AssetCategoryPayload>,
) => {
  return apiClient(`/assetCategories/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

// Delete category
export const deleteAssetCategory = (id: string) => {
  return apiClient(`/assetCategories/${id}`, {
    method: "DELETE",
  });
};
