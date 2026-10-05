import apiClient from "@/lib/apiClient";
import { UpdateAssetPayload } from "@/types";

export interface AssetFilterParams {
  searchTerm?: string;
  assetTag?: string;
  categoryId?: string;
  vendorId?: string;
  status?: string;
  condition?: string;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllAssets = (params?: AssetFilterParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiClient(`/assets${query ? `?${query}` : ""}`, {
    method: "GET",
  });
};

// Get single asset
export const getAssetById = (assetId: string) => {
  return apiClient(`/assets/${assetId}`, {
    method: "GET",
  });
};

// UPDATE SINGLE ASSET
export const updateAsset = (
  assetId: string,
  payload: UpdateAssetPayload,
) => {
  return apiClient(`/assets/${assetId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};