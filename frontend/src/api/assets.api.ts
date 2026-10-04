import apiClient from "@/lib/apiClient";

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