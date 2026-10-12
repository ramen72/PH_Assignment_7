import apiClient from "@/lib/apiClient";
import type {
  AssetRequestFilterParams,
  AssetRequestPayload,
  RejectAssetRequestPayload,
  UpdateAssetRequestPayload,
} from "@/types";

// Create Asset Request
export const createAssetRequest = (
  data: AssetRequestPayload,
) => {
  return apiClient("/assetRequests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      requestedAssetId: data.requestedAssetId || undefined,
    }),
  });
};

// Get All Asset Requests
export const getAllAssetRequests = (
  params?: AssetRequestFilterParams,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiClient(
    `/assetRequests${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
  );
};

// Get My Asset Requests
export const getMyAssetRequests = (
  params?: AssetRequestFilterParams,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiClient(
    `/assetRequests/myRequests${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
  );
};

// Get Single Asset Request
export const getSingleAssetRequestById = (
  assetRequestId: string,
) => {
  return apiClient(
    `/assetRequests/requests/${assetRequestId}`,
    {
      method: "GET",
    },
  );
};

// Update Asset Request
export const updateAssetRequest = (
  assetRequestId: string,
  data: UpdateAssetRequestPayload,
) => {
  return apiClient(`/assetRequests/${assetRequestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      requestedAssetId: data.requestedAssetId || undefined,
    }),
  });
};

// Approve Asset Request
export const approveAssetRequest = (
  assetRequestId: string,
) => {
  return apiClient(
    `/assetRequests/approve/${assetRequestId}`,
    {
      method: "PATCH",
    },
  );
};

// Cancel Asset Request
export const cancelAssetRequest = (
  assetRequestId: string,
) => {
  return apiClient(
    `/assetRequests/cancel/${assetRequestId}`,
    {
      method: "PATCH",
    },
  );
};

// Reject Asset Request
export const rejectAssetRequest = (
  assetRequestId: string,
  data: RejectAssetRequestPayload,
) => {
  return apiClient(
    `/assetRequests/reject/${assetRequestId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
};

// Delete Asset Request
export const deleteAssetRequestById = (
  assetRequestId: string,
) => {
  return apiClient(`/assetRequests/${assetRequestId}`, {
    method: "DELETE",
  });
};