
export const getAllAssets = (params?: AssetFilterParams) => {
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