import apiClient from "@/lib/apiClient";
import type { AssetPurchaseFilterParams, AssetPurchasePayload } from "@/types";

export const createAssetPurchase = (data: AssetPurchasePayload) => {
  return apiClient("/assetPurchases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const getAllAssetPurchases = (params?: AssetPurchaseFilterParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiClient(`/assetPurchases${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

// Get single asset Purchase
export const getSingleAssetPurchaseById = (assetPurchaseId: string) => {
  return apiClient(`/assetPurchases/${assetPurchaseId}`, {
    method: "GET",
  });
};

// Get single asset Purchase
export const deleteAssetPurchaseById = (assetPurchaseId: string) => {
  return apiClient(`/assetPurchases/${assetPurchaseId}`, {
    method: "DELETE",
  });
};